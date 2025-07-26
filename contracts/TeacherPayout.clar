;; Teacher Payout Smart Contract
;; Pay per student completion system

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-teacher (err u101))
(define-constant err-already-completed (err u102))
(define-constant err-invalid-amount (err u103))
(define-constant err-insufficient-funds (err u104))

;; Data variables
(define-data-var payout-per-student uint u100000) ;; 0.1 STX per completion
(define-data-var contract-balance uint u0)

;; Data maps
(define-map teachers principal bool) ;; Track registered teachers
(define-map student-completions {teacher: principal, student: principal} bool) ;; Track completed students
(define-map teacher-earnings principal uint) ;; Track teacher earnings

;; Function 1: Record student completion and trigger payout
(define-public (record-completion (teacher principal) (student principal))
  (let (
    (completion-key {teacher: teacher, student: student})
    (payout-amount (var-get payout-per-student))
    (current-balance (var-get contract-balance))
  )
    ;; Check if teacher is registered
    (asserts! (default-to false (map-get? teachers teacher)) err-not-teacher)
    
    ;; Check if student hasn't already completed for this teacher
    (asserts! (is-none (map-get? student-completions completion-key)) err-already-completed)
    
    ;; Check if contract has sufficient funds
    (asserts! (>= current-balance payout-amount) err-insufficient-funds)
    
    ;; Record completion
    (map-set student-completions completion-key true)
    
    ;; Update teacher earnings
    (map-set teacher-earnings teacher 
      (+ (default-to u0 (map-get? teacher-earnings teacher)) payout-amount))
    
    ;; Transfer payout to teacher
    (try! (as-contract (stx-transfer? payout-amount tx-sender teacher)))
    
    ;; Update contract balance
    (var-set contract-balance (- current-balance payout-amount))
    
    (ok true)
  )
)

;; Function 2: Register teacher and fund contract
(define-public (register-teacher-and-fund (teacher principal) (funding-amount uint))
  (begin
    ;; Only owner can register teachers and fund contract
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (> funding-amount u0) err-invalid-amount)
    
    ;; Register teacher
    (map-set teachers teacher true)
    
    ;; Fund the contract
    (try! (stx-transfer? funding-amount tx-sender (as-contract tx-sender)))
    (var-set contract-balance (+ (var-get contract-balance) funding-amount))
    
    (ok true)
  )
)

;; Read-only functions for querying data
(define-read-only (is-teacher (teacher principal))
  (default-to false (map-get? teachers teacher)))

(define-read-only (get-teacher-earnings (teacher principal))
  (default-to u0 (map-get? teacher-earnings teacher)))

(define-read-only (get-contract-balance)
  (var-get contract-balance))

(define-read-only (is-student-completed (teacher principal) (student principal))
  (is-some (map-get? student-completions {teacher: teacher, student: student})))

(define-read-only (get-payout-rate)
  (var-get payout-per-student))