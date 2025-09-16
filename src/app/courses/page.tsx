"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { coursesApi } from "@/lib/api";
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
import { BookOpen, Users, Clock, Plus, Search } from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  courseCode: string;
  credits: number;
  semester: string;
  year: number;
  maxStudents: number;
  syllabus?: string;
  syllabusUrl?: string;
  syllabusFileName?: string;
  isActive: boolean;
  status: "draft" | "active" | "completed" | "archived";
  createdAt: string;
  updatedAt: string;
  lecturer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  lecturerId: string;
  enrollments?: any[];
  assignments?: any[];
}

export default function CoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activatingCourse, setActivatingCourse] = useState<string | null>(null);

  // Fetch courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let response;
        if (user?.role === 'admin') {
          response = await coursesApi.getAll();
        } else if (user?.role === 'lecturer') {
          response = await coursesApi.getMyCourses();
        } else {
          response = await coursesApi.getActive();
        }
        
        setCourses(response.data);
        setFilteredCourses(response.data);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCourses();
    }
  }, [user]);

  // Filter courses based on search and status
  useEffect(() => {
    let filtered = courses;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          `${course.lecturer.firstName} ${course.lecturer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((course) => course.status === statusFilter);
    }

    setFilteredCourses(filtered);
  }, [courses, searchTerm, statusFilter]);

  const handleActivateCourse = async (courseId: string) => {
    setActivatingCourse(courseId);
    try {
      await coursesApi.activate(courseId);
      // Refresh courses list
      const response = await coursesApi.getAll();
      setCourses(response.data);
      setFilteredCourses(response.data);
    } catch (error) {
      console.error('Error activating course:', error);
      setError('Failed to activate course. Please try again.');
    } finally {
      setActivatingCourse(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "draft":
        return "warning";
      case "completed":
        return "secondary";
      case "archived":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "draft", label: "Draft" },
    { value: "completed", label: "Completed" },
    { value: "archived", label: "Archived" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
          <p className="text-gray-600 mt-1">
            {user?.role === "admin"
              ? "Manage all courses in the system"
              : user?.role === "lecturer"
              ? "Manage your courses"
              : "Browse and enroll in available courses"}
          </p>
        </div>
        {(user?.role === "admin" || user?.role === "lecturer") && (
          <Link href="/courses/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {(user?.role === "admin" || user?.role === "lecturer") && (
              <Select
                options={statusOptions}
                onChange={(e) => setStatusFilter(e.target.value)}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {course.description}
                  </CardDescription>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <Badge variant="secondary">
                    {course.courseCode}
                  </Badge>
                  {(user?.role === "admin" || user?.role === "lecturer") && (
                    <Badge variant={getStatusColor(course.status) as any}>
                      {course.status}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <BookOpen className="h-4 w-4 mr-2" />
                  {course.lecturer.firstName} {course.lecturer.lastName}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  {course.enrollments?.length || 0}/{course.maxStudents} students
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  {course.credits} credits • {course.semester} {course.year}
                </div>
                <div className="pt-2 space-y-2">
                  <Link href={`/courses/${course.id}`}>
                    <Button className="w-full" variant="outline">
                      View Details
                    </Button>
                  </Link>
                  {user?.role === "admin" && course.status === "draft" && (
                    <Button
                      className="w-full"
                      variant="default"
                      size="sm"
                      onClick={() => handleActivateCourse(course.id)}
                      disabled={activatingCourse === course.id}
                    >
                      {activatingCourse === course.id ? "Activating..." : "Activate Course"}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No courses found
            </h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your filters to see more courses."
                : "No courses are available at the moment."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
