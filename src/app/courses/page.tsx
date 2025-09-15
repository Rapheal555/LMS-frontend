"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
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
  instructor: string;
  enrolledStudents: number;
  maxStudents: number;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  status: "Active" | "Draft" | "Archived";
  createdAt: string;
}

// Mock data
const mockCourses: Course[] = [
  {
    id: "1",
    title: "Introduction to Computer Science",
    description:
      "Learn the fundamentals of computer science including algorithms, data structures, and programming concepts.",
    instructor: "Dr. Sarah Johnson",
    enrolledStudents: 45,
    maxStudents: 50,
    duration: "12 weeks",
    level: "Beginner",
    category: "Computer Science",
    status: "Active",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Advanced Web Development",
    description:
      "Master modern web development with React, Node.js, and cloud deployment strategies.",
    instructor: "Prof. Michael Chen",
    enrolledStudents: 32,
    maxStudents: 40,
    duration: "16 weeks",
    level: "Advanced",
    category: "Web Development",
    status: "Active",
    createdAt: "2024-02-01",
  },
  {
    id: "3",
    title: "Data Science Fundamentals",
    description:
      "Explore data analysis, machine learning, and statistical modeling using Python.",
    instructor: "Dr. Emily Rodriguez",
    enrolledStudents: 28,
    maxStudents: 35,
    duration: "14 weeks",
    level: "Intermediate",
    category: "Data Science",
    status: "Active",
    createdAt: "2024-01-20",
  },
  {
    id: "4",
    title: "Mobile App Development",
    description:
      "Build native mobile applications for iOS and Android platforms.",
    instructor: "Prof. David Kim",
    enrolledStudents: 0,
    maxStudents: 30,
    duration: "10 weeks",
    level: "Intermediate",
    category: "Mobile Development",
    status: "Draft",
    createdAt: "2024-02-10",
  },
];

export default function CoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(mockCourses);
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    let filtered = courses;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Level filter
    if (levelFilter !== "all") {
      filtered = filtered.filter((course) => course.level === levelFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((course) => course.status === statusFilter);
    }

    setFilteredCourses(filtered);
  }, [courses, searchTerm, levelFilter, statusFilter]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "success";
      case "Intermediate":
        return "warning";
      case "Advanced":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "success";
      case "Draft":
        return "warning";
      case "Archived":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const levelOptions = [
    { value: "all", label: "All Levels" },
    { value: "Beginner", label: "Beginner" },
    { value: "Intermediate", label: "Intermediate" },
    { value: "Advanced", label: "Advanced" },
  ];

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "Active", label: "Active" },
    { value: "Draft", label: "Draft" },
    { value: "Archived", label: "Archived" },
  ];

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              options={levelOptions}
              onChange={(e) => setLevelFilter(e.target.value)}
            />

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
                  <Badge variant={getLevelColor(course.level) as any}>
                    {course.level}
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
                  {course.instructor}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  {course.enrolledStudents}/{course.maxStudents} students
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  {course.duration}
                </div>
                <div className="pt-2">
                  <Link href={`/courses/${course.id}`}>
                    <Button className="w-full" variant="outline">
                      View Details
                    </Button>
                  </Link>
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
              {searchTerm || levelFilter !== "all" || statusFilter !== "all"
                ? "Try adjusting your filters to see more courses."
                : "No courses are available at the moment."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
