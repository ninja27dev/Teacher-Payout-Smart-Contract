import { create } from 'zustand';

export interface Teacher {
  id: string;
  name: string;
  address: string;
  subject: string;
  registeredDate: string;
  totalEarnings: string;
  studentsCompleted: number;
  completionRate: number;
  status: 'active' | 'inactive';
  balance: string;
}

export interface Student {
  id: string;
  name: string;
  address: string;
  enrolledCourses: Array<{
    teacher: string;
    course: string;
    status: 'completed' | 'in-progress';
    completedDate: string | null;
  }>;
  totalCompletions: number;
  joinDate: string;
}

export interface Payout {
  id: string;
  teacher: string;
  teacherAddress: string;
  student: string;
  studentAddress: string;
  course: string;
  amount: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
  txHash: string | null;
}

interface AppState {
  // Wallet state
  isWalletConnected: boolean;
  walletAddress: string | null;
  
  // Data
  teachers: Teacher[];
  students: Student[];
  payouts: Payout[];
  
  // UI state
  isLoading: boolean;
  
  // Actions
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  
  // Teacher actions
  registerTeacher: (teacher: Omit<Teacher, 'id' | 'registeredDate' | 'totalEarnings' | 'studentsCompleted' | 'completionRate' | 'status'>) => void;
  addFundsToTeacher: (teacherId: string, amount: string) => void;
  
  // Student actions
  recordCompletion: (teacherAddress: string, studentAddress: string, courseName: string) => void;
  
  // Utility
  getTeacherByAddress: (address: string) => Teacher | undefined;
  getStudentByAddress: (address: string) => Student | undefined;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  isWalletConnected: false,
  walletAddress: null,
  isLoading: false,
  
  // Mock initial data
  teachers: [
    {
      id: '1',
      name: "Dr. Sarah Smith",
      address: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
      subject: "Mathematics",
      registeredDate: "2024-01-15",
      totalEarnings: "4.5",
      studentsCompleted: 45,
      completionRate: 89,
      status: "active",
      balance: "10.0"
    },
    {
      id: '2',
      name: "Prof. Michael Davis",
      address: "ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK0QH",
      subject: "Computer Science",
      registeredDate: "2024-02-01",
      totalEarnings: "3.8",
      studentsCompleted: 38,
      completionRate: 92,
      status: "active",
      balance: "8.5"
    },
    {
      id: '3',
      name: "Dr. Elena Martinez",
      address: "ST3NBRSFKX28FQ2ZJ1MAKX58HKHSDGNV5N7R21XCP",
      subject: "Physics",
      registeredDate: "2024-01-20",
      totalEarnings: "3.2",
      studentsCompleted: 32,
      completionRate: 85,
      status: "active",
      balance: "6.8"
    }
  ],
  
  students: [
    {
      id: '1',
      name: "Alice Johnson",
      address: "ST1STUDENT1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJS",
      enrolledCourses: [
        { teacher: "Dr. Sarah Smith", course: "Advanced Mathematics", status: "completed", completedDate: "2024-01-20" },
        { teacher: "Prof. Michael Davis", course: "Computer Science", status: "in-progress", completedDate: null }
      ],
      totalCompletions: 3,
      joinDate: "2024-01-10"
    },
    {
      id: '2',
      name: "Bob Wilson",
      address: "ST2STUDENT2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4C",
      enrolledCourses: [
        { teacher: "Prof. Michael Davis", course: "Programming Fundamentals", status: "completed", completedDate: "2024-01-25" },
        { teacher: "Dr. Elena Martinez", course: "Physics 101", status: "in-progress", completedDate: null }
      ],
      totalCompletions: 2,
      joinDate: "2024-01-15"
    }
  ],
  
  payouts: [
    {
      id: '1',
      teacher: "Dr. Sarah Smith",
      teacherAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
      student: "Alice Johnson",
      studentAddress: "ST1STUDENT1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJS",
      course: "Advanced Mathematics",
      amount: "0.1",
      status: "completed",
      timestamp: new Date().toISOString(),
      txHash: "0x1234567890abcdef1234567890abcdef12345678"
    }
  ],
  
  // Actions
  connectWallet: async () => {
    set({ isLoading: true });
    
    // Simulate wallet connection
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    set({
      isWalletConnected: true,
      walletAddress: "ST1MOCKWALLET123456789ABCDEFGHIJKLMNOPQRST",
      isLoading: false
    });
  },
  
  disconnectWallet: () => {
    set({
      isWalletConnected: false,
      walletAddress: null
    });
  },
  
  registerTeacher: (teacherData) => {
    const newTeacher: Teacher = {
      ...teacherData,
      id: Date.now().toString(),
      registeredDate: new Date().toISOString().split('T')[0],
      totalEarnings: "0.0",
      studentsCompleted: 0,
      completionRate: 0,
      status: 'active'
    };
    
    set(state => ({
      teachers: [...state.teachers, newTeacher]
    }));
  },
  
  addFundsToTeacher: (teacherId, amount) => {
    set(state => ({
      teachers: state.teachers.map(teacher => 
        teacher.id === teacherId 
          ? { ...teacher, balance: (parseFloat(teacher.balance) + parseFloat(amount)).toString() }
          : teacher
      )
    }));
  },
  
  recordCompletion: (teacherAddress, studentAddress, courseName) => {
    const state = get();
    const teacher = state.teachers.find(t => t.address === teacherAddress);
    const payoutAmount = "0.1";
    
    if (!teacher) return;
    
    // Create new payout
    const newPayout: Payout = {
      id: Date.now().toString(),
      teacher: teacher.name,
      teacherAddress,
      student: state.students.find(s => s.address === studentAddress)?.name || "Unknown Student",
      studentAddress,
      course: courseName,
      amount: payoutAmount,
      status: "completed",
      timestamp: new Date().toISOString(),
      txHash: `0x${Math.random().toString(16).substr(2, 40)}`
    };
    
    // Update teacher stats
    const updatedTeacher = {
      ...teacher,
      totalEarnings: (parseFloat(teacher.totalEarnings) + parseFloat(payoutAmount)).toString(),
      studentsCompleted: teacher.studentsCompleted + 1,
      balance: (parseFloat(teacher.balance) - parseFloat(payoutAmount)).toString()
    };
    
    updatedTeacher.completionRate = Math.round((updatedTeacher.studentsCompleted / (updatedTeacher.studentsCompleted + 5)) * 100);
    
    // Update student course status
    const updatedStudents = state.students.map(student => {
      if (student.address === studentAddress) {
        const updatedCourses = student.enrolledCourses.map(course => 
          course.course === courseName && course.teacher === teacher.name
            ? { ...course, status: 'completed' as const, completedDate: new Date().toISOString().split('T')[0] }
            : course
        );
        
        // If course doesn't exist, add it as completed
        const courseExists = student.enrolledCourses.some(course => 
          course.course === courseName && course.teacher === teacher.name
        );
        
        if (!courseExists) {
          updatedCourses.push({
            teacher: teacher.name,
            course: courseName,
            status: 'completed',
            completedDate: new Date().toISOString().split('T')[0]
          });
        }
        
        return {
          ...student,
          enrolledCourses: updatedCourses,
          totalCompletions: student.totalCompletions + 1
        };
      }
      return student;
    });
    
    set({
      teachers: state.teachers.map(t => t.id === teacher.id ? updatedTeacher : t),
      students: updatedStudents,
      payouts: [newPayout, ...state.payouts]
    });
  },
  
  getTeacherByAddress: (address) => {
    return get().teachers.find(teacher => teacher.address === address);
  },
  
  getStudentByAddress: (address) => {
    return get().students.find(student => student.address === address);
  }
}));