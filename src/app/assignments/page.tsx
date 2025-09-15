"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { assignmentsApi } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  FileText,
  Calendar,
  Clock,
  Plus,
  Search,
  BookOpen,
  User,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";

interface Assignment {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseName: string;
  instructor: string;
  dueDate: string;
  maxPoints: number;
  status: "upcoming" | "active" | "overdue" | "completed";
  submissionStatus?: "not_submitted" | "submitted" | "graded";
  grade?: number;
  submittedAt?: string;
  createdAt: string;
}



export default function AssignmentsPage() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [filteredAssignments, setFilteredAssignments] =
    useState<Assignment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch assignments from API
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await assignmentsApi.getAll();
        setAssignments(response.data);
      } catch (err) {
        console.error('Error fetching assignments:', err);
        setError('Failed to load assignments. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  // Filter assignments
  useEffect(() => {
    let filtered = assignments;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (assignment) =>
          assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          assignment.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          assignment.courseName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (assignment) => assignment.status === statusFilter
      );
    }

    // Course filter
    if (courseFilter !== "all") {
      filtered = filtered.filter(
        (assignment) => assignment.courseId === courseFilter
      );
    }

    setFilteredAssignments(filtered);
  }, [assignments, searchTerm, statusFilter, courseFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "active":
        return "warning";
      case "overdue":
        return "destructive";
      case "upcoming":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getSubmissionStatusColor = (status: string) => {
    switch (status) {
      case "graded":
        return "success";
      case "submitted":
        return "warning";
      case "not_submitted":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "active":
        return <Clock className="h-4 w-4" />;
      case "overdue":
        return <XCircle className="h-4 w-4" />;
      case "upcoming":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "upcoming", label: "Upcoming" },
    { value: "active", label: "Active" },
    { value: "overdue", label: "Overdue" },
    { value: "completed", label: "Completed" },
  ];

  const uniqueCourses = Array.from(
    new Set(assignments.map((a) => ({ id: a.courseId, name: a.courseName })))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
          <p className="text-gray-600 mt-1">
            {user?.role === "student"
              ? "Track your assignments and submissions"
              : user?.role === "lecturer"
              ? "Manage course assignments and grades"
              : "Overview of all assignments in the system"}
          </p>
        </div>
        {(user?.role === "admin" || user?.role === "lecturer") && (
          <Link href="/assignments/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Assignment
            </Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />

            <Select
              options={[
                { value: "all", label: "All Courses" },
                ...uniqueCourses.map((c) => ({ value: c.id, label: c.name })),
              ]}
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading assignments...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-8 text-red-600">
              <XCircle className="h-8 w-8 mr-3" />
              <div>
                <p className="font-medium">Error loading assignments</p>
                <p className="text-sm text-gray-600 mt-1">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredAssignments.length === 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mb-4" />
              <p className="text-lg font-medium">No assignments found</p>
              <p className="text-sm text-center mt-1">
                {assignments.length === 0
                  ? "No assignments have been created yet."
                  : "No assignments match your current filters."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assignments List */}
      {!isLoading && !error && filteredAssignments.length > 0 && (
        <div className="space-y-4">
          {filteredAssignments.map((assignment) => {
          const daysUntilDue = getDaysUntilDue(assignment.dueDate);

          return (
            <Card
              key={assignment.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(assignment.status)}
                      <h3 className="text-xl font-semibold text-gray-900">
                        {assignment.title}
                      </h3>
                      <Badge variant={getStatusColor(assignment.status) as any}>
                        {assignment.status}
                      </Badge>
                      {user?.role === "student" &&
                        assignment.submissionStatus && (
                          <Badge
                            variant={
                              getSubmissionStatusColor(
                                assignment.submissionStatus
                              ) as any
                            }
                          >
                            {assignment.submissionStatus.replace("_", " ")}
                          </Badge>
                        )}
                    </div>

                    <p className="text-gray-600 mb-3">
                      {assignment.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <BookOpen className="h-4 w-4 mr-2" />
                        {assignment.courseName}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <User className="h-4 w-4 mr-2" />
                        {assignment.instructor}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        Due: {formatDate(assignment.dueDate)}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FileText className="h-4 w-4 mr-2" />
                        {assignment.maxPoints} points
                      </div>
                    </div>

                    {/* Due date warning */}
                    {assignment.status === "active" &&
                      daysUntilDue <= 3 &&
                      daysUntilDue > 0 && (
                        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                          <p className="text-sm text-yellow-800">
                            ⚠️ Due in {daysUntilDue} day
                            {daysUntilDue !== 1 ? "s" : ""}
                          </p>
                        </div>
                      )}

                    {/* Grade display for students */}
                    {user?.role === "student" &&
                      assignment.grade !== undefined && (
                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-green-800">
                              Grade:
                            </span>
                            <span className="text-lg font-bold text-green-800">
                              {assignment.grade}/{assignment.maxPoints} (
                              {Math.round(
                                (assignment.grade / assignment.maxPoints) * 100
                              )}
                              %)
                            </span>
                          </div>
                          {assignment.submittedAt && (
                            <p className="text-xs text-green-600 mt-1">
                              Submitted: {formatDate(assignment.submittedAt)}
                            </p>
                          )}
                        </div>
                      )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Link href={`/assignments/${assignment.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>

                    {user?.role === "student" &&
                      assignment.status === "active" &&
                      assignment.submissionStatus === "not_submitted" && (
                        <Link
                          href={`#`}
                          //  href={`/assignments/${assignment.id}/submit`}
                        >
                          <Button size="sm">Submit</Button>
                        </Link>
                      )}

                    {(user?.role === "admin" || user?.role === "lecturer") && (
                      <div className="flex flex-col gap-2">
                        <Link
                          href={`#`}
                          // href={`/assignments/${assignment.id}/edit`}
                        >
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </Link>
                        <Link
                          href={`#`}
                          // href={`/assignments/${assignment.id}/submissions`}
                        >
                          <Button variant="outline" size="sm">
                            Submissions
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        </div>
      )}
    </div>
  );
}
