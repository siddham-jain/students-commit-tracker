import React, { useContext, useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "./ui/use-toast";
import { LoaderContext } from "@/contexts/LoaderContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { GetAllAssignments, CreateAssignment } from "@/api/assignment";

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  totalScore: number;
}

interface Student {
  id: string;
  name: string;
  email: string;
}

interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  submissionDate: string;
  score: number | null;
}

const TeacherDashboard: React.FC = () => {
  const { loaderState, loaderDispatch } = useContext(LoaderContext);
  const { toast } = useToast();

  const [assignments, setAssignments] = useState<Assignment[]>([
    // {
    //   id: "1",
    //   title: "JavaScript Basics",
    //   description: "Introduction to JavaScript fundamentals",
    //   dueDate: "2024-08-15T23:59:59",
    //   totalScore: 100,
    // },
  ]);

  const [students, setStudents] = useState<Student[]>([
    // {
    //   id: "1",
    //   name: "Alice Johnson",
    //   email: "alice@example.com",
    // },
  ]);

  const [submissions, setSubmissions] = useState<Submission[]>([
    // {
    //   id: "1",
    //   assignmentId: "1",
    //   studentId: "1",
    //   submissionDate: "2024-08-14T14:30:00",
    //   score: 90,
    // },
  ]);

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    try {
      loaderDispatch({ type: "SHOW_LOADER" });
      (async () => {
        const data = await GetAllAssignments();
        setAssignments(data);
      })();
    } catch (err) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
        duration: 1500,
      });
    } finally {
      loaderDispatch({ type: "HIDE_LOADER" });
    }
  }, []);

  const CreateAssignmentDialog: React.FC = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [totalScore, setTotalScore] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = useCallback(
      async (event: React.FormEvent) => {
        event.preventDefault();
        try {
          // Simulate API call
          console.log(title, description, dueDate, totalScore);
          // Reset form fields and close dialog
          setIsOpen(false);
          setTitle("");
          setDescription("");
          setDueDate("");
          setTotalScore(0);
          toast({
            title: "Success",
            description: "Assignment created successfully",
          });
        } catch (error) {
          console.error(error);
          toast({
            title: "Error",
            description: "Failed to create assignment",
            variant: "destructive",
            duration: 1500,
          });
        }
      },
      [title, description, dueDate, totalScore, toast]
    );

    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button>Create Assignment</Button>
        </DialogTrigger>
        <DialogTitle hidden></DialogTitle>
        <DialogContent
          aria-labelledby="create-assignment-dialog-title"
          className="sm:max-w-[600px]"
        >
          <DialogHeader>
            <DialogTitle id="create-assignment-dialog-title">
              Create New Assignment
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 gap-4 items-center">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dueDate" className="text-right">
                  Due Date
                </Label>
                <Input
                  id="dueDate"
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="totalScore" className="text-right">
                  Total Score
                </Label>
                <Input
                  id="totalScore"
                  type="number"
                  value={totalScore}
                  onChange={(e) => setTotalScore(Number(e.target.value))}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button type="submit">Create Assignment</Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  const EditAssignmentDialog: React.FC<{ assignment: Assignment }> = ({
    assignment,
  }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Assignment</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-title" className="text-right">
              Title
            </Label>
            <Input
              id="edit-title"
              defaultValue={assignment.title}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-description" className="text-right">
              Description
            </Label>
            <Textarea
              id="edit-description"
              defaultValue={assignment.description}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-dueDate" className="text-right">
              Due Date
            </Label>
            <Input
              id="edit-dueDate"
              type="datetime-local"
              defaultValue={assignment.dueDate}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-totalScore" className="text-right">
              Total Score
            </Label>
            <Input
              id="edit-totalScore"
              type="number"
              defaultValue={assignment.totalScore}
              className="col-span-3"
            />
          </div>
        </div>
        <Button type="submit">Update Assignment</Button>
      </DialogContent>
    </Dialog>
  );

  const StudentDetailsDialog: React.FC<{ student: Student }> = ({
    student,
  }) => {
    const studentSubmissions = submissions.filter(
      (sub) => sub.studentId === student.id
    );
    const attemptedAssignments = studentSubmissions.length;
    const averageScore =
      studentSubmissions.reduce((acc, sub) => acc + (sub.score || 0), 0) /
      attemptedAssignments;

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="link">{student.name}</Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{student.name}'s Details</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Card>
              <CardHeader>
                <CardTitle>Student Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Assignments Attempted: {attemptedAssignments}</p>
                <p>Average Score: {averageScore.toFixed(2)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Assignment</TableHead>
                      <TableHead>Submission Date</TableHead>
                      <TableHead>Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentSubmissions.map((sub) => {
                      const assignment = assignments.find(
                        (a) => a.id === sub.assignmentId
                      );
                      return (
                        <TableRow key={sub.id}>
                          <TableCell>{assignment?.title}</TableCell>
                          <TableCell>
                            {new Date(sub.submissionDate).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {sub.score !== null ? sub.score : "Not graded"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="flex w-full flex-col bg-muted/40 mt-10 pt-4">
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Teacher Dashboard
          </h2>
          <CreateAssignmentDialog />
        </div>
        <Tabs defaultValue="assignments" className="space-y-4">
          <TabsList>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
          </TabsList>
          <TabsContent value="assignments">
            <Card>
              <CardHeader>
                <CardTitle>Assignments</CardTitle>
                <CardDescription>Manage your assignments here.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Total Score</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assignments.map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell>{assignment.title}</TableCell>
                        <TableCell>{assignment.description}</TableCell>
                        <TableCell>
                          {new Date(assignment.dueDate).toLocaleString()}
                        </TableCell>
                        <TableCell>{assignment.totalScore}</TableCell>
                        <TableCell>
                          <EditAssignmentDialog assignment={assignment} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>Students</CardTitle>
                <CardDescription>
                  View student details and submissions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>
                          <StudentDetailsDialog student={student} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default TeacherDashboard;