import { StatsCard } from "@/components/ui/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/store/useAppStore";
import { 
  GraduationCap, 
  Users, 
  DollarSign, 
  TrendingUp, 
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";

export function Dashboard() {
  const { teachers, students, payouts } = useAppStore();
  
  // Calculate real-time stats
  const totalEarnings = payouts
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + parseFloat(p.amount), 0);
  
  const pendingPayouts = payouts
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + parseFloat(p.amount), 0);
  
  const completedPayouts = payouts.filter(p => p.status === 'completed').length;
  const totalStudentEnrollments = students.reduce((sum, s) => sum + s.enrolledCourses.length, 0);
  const completionRate = totalStudentEnrollments > 0 
    ? Math.round((completedPayouts / totalStudentEnrollments) * 100) 
    : 0;
  
  const stats = [
    {
      title: "Active Teachers",
      value: teachers.filter(t => t.status === 'active').length.toString(),
      icon: <GraduationCap className="h-4 w-4" />,
      description: `${teachers.length} total registered`,
      variant: "default" as const
    },
    {
      title: "Total Students",
      value: students.length.toString(),
      icon: <Users className="h-4 w-4" />,
      description: `${totalStudentEnrollments} total enrollments`,
      variant: "success" as const
    },
    {
      title: "Total Payouts",
      value: `${totalEarnings.toFixed(1)} STX`,
      icon: <DollarSign className="h-4 w-4" />,
      description: pendingPayouts > 0 ? `${pendingPayouts.toFixed(1)} STX pending` : "All payments processed",
      variant: "default" as const
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      icon: <TrendingUp className="h-4 w-4" />,
      description: `${completedPayouts} completed courses`,
      variant: "success" as const
    }
  ];

  // Get recent completions from payouts
  const recentCompletions = payouts
    .slice(0, 5)
    .map(payout => ({
      student: payout.student,
      teacher: payout.teacher,
      course: payout.course,
      payout: `${payout.amount} STX`,
      status: payout.status,
      time: new Date(payout.timestamp).toLocaleString()
    }));

  // Get top teachers sorted by earnings
  const topTeachers = teachers
    .sort((a, b) => parseFloat(b.totalEarnings) - parseFloat(a.totalEarnings))
    .slice(0, 3)
    .map(teacher => ({
      name: teacher.name,
      completions: teacher.studentsCompleted,
      earnings: `${teacher.totalEarnings} STX`,
      rating: (4.5 + Math.random() * 0.5).toFixed(1) // Mock rating
    }));

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Completions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              Recent Completions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentCompletions.map((completion, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-accent/30 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{completion.student}</span>
                    <Badge variant={completion.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                      {completion.status === 'completed' ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <Clock className="h-3 w-3 mr-1" />
                      )}
                      {completion.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{completion.course}</p>
                  <p className="text-xs text-muted-foreground">Teacher: {completion.teacher}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm text-success">{completion.payout}</p>
                  <p className="text-xs text-muted-foreground">{completion.time}</p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              View All Completions
            </Button>
          </CardContent>
        </Card>

        {/* Top Performing Teachers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Top Performing Teachers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topTeachers.map((teacher, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-accent/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white font-medium text-sm">
                    {teacher.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{teacher.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {teacher.completions} completions • ⭐ {teacher.rating}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm text-success">{teacher.earnings}</p>
                  <Progress value={Math.min((teacher.completions / 50) * 100, 100)} className="w-16 h-2 mt-1" />
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              View All Teachers
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-warning" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="default" className="h-auto p-4 flex-col gap-2">
              <GraduationCap className="h-6 w-6" />
              Register Teacher
            </Button>
            <Button variant="success" className="h-auto p-4 flex-col gap-2">
              <CheckCircle className="h-6 w-6" />
              Record Completion
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col gap-2">
              <DollarSign className="h-6 w-6" />
              Process Payouts
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col gap-2">
              <TrendingUp className="h-6 w-6" />
              View Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}