import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAppStore } from "@/store/useAppStore";
import { 
  Users, 
  Search, 
  CheckCircle, 
  Calendar,
  User,
  GraduationCap,
  Award
} from "lucide-react";

export default function Students() {
  const { students, teachers, recordCompletion } = useAppStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [completion, setCompletion] = useState({
    teacherAddress: "",
    studentAddress: "",
    courseName: ""
  });
  const [isCompletionDialogOpen, setIsCompletionDialogOpen] = useState(false);
  const { toast } = useToast();

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRecordCompletion = () => {
    if (!completion.teacherAddress || !completion.studentAddress || !completion.courseName) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const teacher = teachers.find(t => t.address === completion.teacherAddress);
    if (!teacher) {
      toast({
        title: "Error",
        description: "Teacher not found",
        variant: "destructive"
      });
      return;
    }

    if (parseFloat(teacher.balance) < 0.1) {
      toast({
        title: "Insufficient Funds",
        description: "Teacher does not have enough balance for payout. Please add funds first.",
        variant: "destructive"
      });
      return;
    }

    recordCompletion(completion.teacherAddress, completion.studentAddress, completion.courseName);

    toast({
      title: "Completion Recorded",
      description: `Student completion recorded successfully. Teacher payout of 0.1 STX has been processed.`,
    });

    setCompletion({
      teacherAddress: "",
      studentAddress: "",
      courseName: ""
    });
    setIsCompletionDialogOpen(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-muted-foreground">Track student enrollments and record course completions</p>
        </div>
        
        <Dialog open={isCompletionDialogOpen} onOpenChange={setIsCompletionDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="success" className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Record Completion
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Record Student Completion</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="teacher-select">Teacher</Label>
                <Select value={completion.teacherAddress} onValueChange={(value) => setCompletion({...completion, teacherAddress: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher.address} value={teacher.address}>
                        {teacher.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="student-address">Student Address</Label>
                <Input
                  id="student-address"
                  placeholder="ST1STUDENT1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJS"
                  value={completion.studentAddress}
                  onChange={(e) => setCompletion({...completion, studentAddress: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="course-name">Course Name</Label>
                <Input
                  id="course-name"
                  placeholder="e.g., Advanced Mathematics, Physics 101"
                  value={completion.courseName}
                  onChange={(e) => setCompletion({...completion, courseName: e.target.value})}
                />
              </div>
              <Button onClick={handleRecordCompletion} className="w-full" variant="success">
                Record Completion & Pay Teacher
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search students by name or address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Students Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="hover:shadow-card transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-medium">
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{student.name}</CardTitle>
                    <p className="text-sm text-muted-foreground font-mono">
                      {student.address.slice(0, 20)}...
                    </p>
                  </div>
                </div>
                <Badge variant="default" className="gap-1">
                  <Award className="h-3 w-3" />
                  {student.totalCompletions}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Joined {new Date(student.joinDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <span>{student.enrolledCourses.length} courses</span>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Course Enrollments</h4>
                <div className="space-y-2">
                  {student.enrolledCourses.map((course, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg border border-border/50">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{course.course}</p>
                        <p className="text-xs text-muted-foreground">by {course.teacher}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={course.status === 'completed' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {course.status === 'completed' ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <User className="h-3 w-3 mr-1" />
                          )}
                          {course.status}
                        </Badge>
                        {course.completedDate && (
                          <span className="text-xs text-muted-foreground">
                            {new Date(course.completedDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View History
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="success" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => {
                        setCompletion(prev => ({ ...prev, studentAddress: student.address }));
                      }}
                    >
                      Record Completion
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Record Completion for {student.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="teacher-select">Teacher</Label>
                        <Select value={completion.teacherAddress} onValueChange={(value) => setCompletion({...completion, teacherAddress: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select teacher" />
                          </SelectTrigger>
                          <SelectContent>
                            {teachers.map((teacher) => (
                              <SelectItem key={teacher.address} value={teacher.address}>
                                {teacher.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="student-address">Student Address</Label>
                        <Input
                          id="student-address"
                          value={student.address}
                          readOnly
                          className="bg-muted"
                        />
                      </div>
                      <div>
                        <Label htmlFor="course-name">Course Name</Label>
                        <Input
                          id="course-name"
                          placeholder="e.g., Advanced Mathematics, Physics 101"
                          value={completion.courseName}
                          onChange={(e) => setCompletion({...completion, courseName: e.target.value, studentAddress: student.address})}
                        />
                      </div>
                      <Button onClick={handleRecordCompletion} className="w-full" variant="success">
                        Record Completion & Pay Teacher
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <Card className="p-12 text-center">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No students found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? "Try adjusting your search terms" : "Students will appear here once they enroll in courses"}
          </p>
        </Card>
      )}
      </div>
    </Layout>
  );
}