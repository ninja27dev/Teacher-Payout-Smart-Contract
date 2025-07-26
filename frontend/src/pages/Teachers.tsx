import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAppStore } from "@/store/useAppStore";
import { 
  GraduationCap, 
  Search, 
  Plus, 
  DollarSign, 
  Users, 
  TrendingUp,
  Wallet
} from "lucide-react";

export default function Teachers() {
  const { teachers, registerTeacher, addFundsToTeacher } = useAppStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [newTeacher, setNewTeacher] = useState({
    name: "",
    address: "",
    subject: "",
    balance: ""
  });
  const [fundingAmount, setFundingAmount] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [isFundingDialogOpen, setIsFundingDialogOpen] = useState(false);
  const { toast } = useToast();

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRegisterTeacher = () => {
    if (!newTeacher.name || !newTeacher.address || !newTeacher.subject || !newTeacher.balance) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    registerTeacher({
      name: newTeacher.name,
      address: newTeacher.address,
      subject: newTeacher.subject,
      balance: newTeacher.balance
    });

    toast({
      title: "Teacher Registered",
      description: `${newTeacher.name} has been successfully registered and funded with ${newTeacher.balance} STX`,
    });

    setNewTeacher({
      name: "",
      address: "",
      subject: "",
      balance: ""
    });
    setIsRegisterDialogOpen(false);
  };

  const handleAddFunds = () => {
    if (!selectedTeacherId || !fundingAmount) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    const teacher = teachers.find(t => t.id === selectedTeacherId);
    if (!teacher) return;

    addFundsToTeacher(selectedTeacherId, fundingAmount);

    toast({
      title: "Funds Added",
      description: `Added ${fundingAmount} STX to ${teacher.name}'s balance`,
    });

    setFundingAmount("");
    setSelectedTeacherId(null);
    setIsFundingDialogOpen(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Teachers</h1>
          <p className="text-muted-foreground">Manage registered teachers and their performance</p>
        </div>
        
        <Dialog open={isRegisterDialogOpen} onOpenChange={setIsRegisterDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default" className="gap-2">
              <Plus className="h-4 w-4" />
              Register Teacher
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Register New Teacher</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="teacher-name">Teacher Name</Label>
                <Input
                  id="teacher-name"
                  placeholder="Enter teacher's full name"
                  value={newTeacher.name}
                  onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="teacher-address">Stacks Address</Label>
                <Input
                  id="teacher-address"
                  placeholder="ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"
                  value={newTeacher.address}
                  onChange={(e) => setNewTeacher({...newTeacher, address: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="teacher-subject">Subject</Label>
                <Input
                  id="teacher-subject"
                  placeholder="e.g., Mathematics, Physics, Computer Science"
                  value={newTeacher.subject}
                  onChange={(e) => setNewTeacher({...newTeacher, subject: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="initial-balance">Initial Balance (STX)</Label>
                <Input
                  id="initial-balance"
                  type="number"
                  placeholder="10.0"
                  value={newTeacher.balance}
                  onChange={(e) => setNewTeacher({...newTeacher, balance: e.target.value})}
                />
              </div>
              <Button onClick={handleRegisterTeacher} className="w-full">
                Register & Fund Teacher
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search teachers by name or subject..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Teachers Grid */}
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTeachers.map((teacher) => (
          <Card key={teacher.id} className="hover:shadow-card transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-medium">
                    {teacher.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{teacher.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{teacher.subject}</p>
                  </div>
                </div>
                <Badge variant={teacher.status === 'active' ? 'default' : 'secondary'}>
                  {teacher.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-success" />
                  <div>
                    <p className="text-sm font-medium">{teacher.totalEarnings} STX</p>
                    <p className="text-xs text-muted-foreground">Total Earned</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{teacher.studentsCompleted}</p>
                    <p className="text-xs text-muted-foreground">Completions</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Balance</span>
                    <span className="text-sm text-primary">{teacher.balance} STX</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-gradient-primary h-2 rounded-full transition-all duration-300" 
                      style={{width: `${Math.min((parseFloat(teacher.balance) / 20) * 100, 100)}%`}}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-success" />
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Completion Rate</span>
                    <span className="text-sm text-success">{teacher.completionRate}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-gradient-success h-2 rounded-full transition-all duration-300" 
                      style={{width: `${teacher.completionRate}%`}}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-border/50">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Wallet className="h-3 w-3" />
                  <span className="font-mono">{teacher.address.slice(0, 20)}...</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Registered: {new Date(teacher.registeredDate).toLocaleDateString()}
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View Details
                </Button>
                <Dialog open={isFundingDialogOpen && selectedTeacherId === teacher.id} 
                        onOpenChange={(open) => {
                          setIsFundingDialogOpen(open);
                          if (open) setSelectedTeacherId(teacher.id);
                          else setSelectedTeacherId(null);
                        }}>
                  <DialogTrigger asChild>
                    <Button variant="success" size="sm" className="flex-1">
                      Add Funds
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add Funds to {teacher.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Current Balance</Label>
                        <div className="text-lg font-medium text-success">{teacher.balance} STX</div>
                      </div>
                      <div>
                        <Label htmlFor="funding-amount">Amount to Add (STX)</Label>
                        <Input
                          id="funding-amount"
                          type="number"
                          placeholder="5.0"
                          value={fundingAmount}
                          onChange={(e) => setFundingAmount(e.target.value)}
                        />
                      </div>
                      <Button onClick={handleAddFunds} className="w-full" variant="success">
                        Add Funds
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTeachers.length === 0 && (
        <Card className="p-12 text-center">
          <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No teachers found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? "Try adjusting your search terms" : "Register your first teacher to get started"}
          </p>
          <Dialog open={isRegisterDialogOpen} onOpenChange={setIsRegisterDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default">
                <Plus className="h-4 w-4 mr-2" />
                Register First Teacher
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Register New Teacher</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="teacher-name">Teacher Name</Label>
                  <Input
                    id="teacher-name"
                    placeholder="Enter teacher's full name"
                    value={newTeacher.name}
                    onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="teacher-address">Stacks Address</Label>
                  <Input
                    id="teacher-address"
                    placeholder="ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"
                    value={newTeacher.address}
                    onChange={(e) => setNewTeacher({...newTeacher, address: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="teacher-subject">Subject</Label>
                  <Input
                    id="teacher-subject"
                    placeholder="e.g., Mathematics, Physics, Computer Science"
                    value={newTeacher.subject}
                    onChange={(e) => setNewTeacher({...newTeacher, subject: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="initial-balance">Initial Balance (STX)</Label>
                  <Input
                    id="initial-balance"
                    type="number"
                    placeholder="10.0"
                    value={newTeacher.balance}
                    onChange={(e) => setNewTeacher({...newTeacher, balance: e.target.value})}
                  />
                </div>
                <Button onClick={handleRegisterTeacher} className="w-full">
                  Register & Fund Teacher
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </Card>
      )}
      </div>
    </Layout>
  );
}