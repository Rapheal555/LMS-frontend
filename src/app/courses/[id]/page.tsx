'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { 
  ArrowLeft, 
  BookOpen, 
  Users, 
  Clock, 
  Calendar, 
  User, 
  Edit, 
  Trash2,
  UserPlus,
  FileText,
  Target
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorId: string;
  enrolledStudents: number;
  maxStudents: number;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  status: 'Active' | 'Draft' | 'Archived';
  prerequisites?: string;
  learningObjectives: string;
  createdAt: string;
  updatedAt: string;
}

interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  status: 'upcoming' | 'active' | 'overdue' | 'completed';
}

// Mock data
const mockCourse: Course = {
  id: '1',
  title: 'Introduction to Computer Science',
  description: 'Learn the fundamentals of computer science including algorithms, data structures, and programming concepts. This comprehensive course covers essential topics that form the foundation of computer science education.',
  instructor: 'Dr. Sarah Johnson',
  instructorId: 'instructor-1',
  enrolledStudents: 45,
  maxStudents: 50,
  duration: '12 weeks',
  level: 'Beginner',
  category: 'Computer Science',
  status: 'Active',
  prerequisites: 'Basic mathematics knowledge and logical thinking skills',
  learningObjectives: `By the end of this beginner level course on Introduction to Computer Science, students will be able to:

• Understand the fundamental concepts and principles of computer science
• Apply theoretical knowledge to practical, real-world scenarios
• Demonstrate proficiency in basic programming concepts
• Analyze and solve simple algorithmic problems
• Collaborate effectively on team-based programming projects
• Present findings and solutions in a clear, professional manner

This 12 weeks course is designed to provide comprehensive coverage of essential topics while encouraging critical thinking and hands-on learning experiences.`,
  createdAt: '2024-01-15',
  updatedAt: '2024-01-20'
};

const mockAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Basic Algorithm Implementation',
    dueDate: '2024-03-15',
    status: 'active'
  },
  {
    id: '2',
    title: 'Data Structures Quiz',
    dueDate: '2024-03-22',
    status: 'upcoming'
  },
  {
    id: '3',
    title: 'Final Project Proposal',
    dueDate: '2024-04-01',
    status: 'upcoming'
  }
];

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    // Simulate API call
    const fetchCourse = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCourse(mockCourse);
        setAssignments(mockAssignments);
        // Simulate enrollment check
        setIsEnrolled(user?.role === 'student' && Math.random() > 0.5);
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [params.id, user]);

  const handleEnroll = async () => {
    setActionLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsEnrolled(true);
      setCourse(prev => prev ? { ...prev, enrolledStudents: prev.enrolledStudents + 1 } : null);
    } catch (error) {
      console.error('Error enrolling:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnenroll = async () => {
    setActionLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsEnrolled(false);
      setCourse(prev => prev ? { ...prev, enrolledStudents: prev.enrolledStudents - 1 } : null);
    } catch (error) {
      console.error('Error unenrolling:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCourse = async () => {
    setActionLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      router.push('/courses');
    } catch (error) {
      console.error('Error deleting course:', error);
    } finally {
      setActionLoading(false);
      setShowDeleteModal(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'success';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Draft': return 'warning';
      case 'Archived': return 'secondary';
      default: return 'secondary';
    }
  };

  const getAssignmentStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'active': return 'warning';
      case 'overdue': return 'destructive';
      case 'upcoming': return 'secondary';
      default: return 'secondary';
    }
  };

  const canEdit = user?.role === 'admin' || (user?.role === 'lecturer' && course?.instructorId === user.id);
  const canEnroll = user?.role === 'student' && course?.status === 'Active' && course.enrolledStudents < course.maxStudents;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h2>
          <p className="text-gray-600 mb-4">The course you're looking for doesn't exist.</p>
          <Link href="/courses">
            <Button>Back to Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/courses">
          <Button variant="secondary" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
        </Link>
      </div>

      {/* Course Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {course.title}
                </h1>
                <Badge variant={getLevelColor(course.level) as any}>
                  {course.level}
                </Badge>
                {(user?.role === "admin" || user?.role === "lecturer") && (
                  <Badge variant={getStatusColor(course.status) as any}>
                    {course.status}
                  </Badge>
                )}
              </div>
              <p className="text-gray-600 mb-4">{course.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <User className="h-4 w-4 mr-2" />
                  {course.instructor}
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  {course.enrolledStudents}/{course.maxStudents} students
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  {course.duration}
                </div>
                <div className="flex items-center text-gray-600">
                  <BookOpen className="h-4 w-4 mr-2" />
                  {course.category}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {canEdit && (
                <div className="flex gap-2">
                  {/* <Link href={`/courses/${course.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </Link> */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              )}

              {user?.role === "student" && (
                <div>
                  {!isEnrolled && canEnroll && (
                    <Button onClick={handleEnroll} disabled={actionLoading}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      {actionLoading ? "Enrolling..." : "Enroll Now"}
                    </Button>
                  )}
                  {isEnrolled && (
                    <Button
                      variant="outline"
                      onClick={handleUnenroll}
                      disabled={actionLoading}
                    >
                      {actionLoading ? "Processing..." : "Unenroll"}
                    </Button>
                  )}
                  {!canEnroll && !isEnrolled && (
                    <Button disabled>
                      {course.enrolledStudents >= course.maxStudents
                        ? "Course Full"
                        : "Enrollment Closed"}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Learning Objectives */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Learning Objectives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-line text-gray-700">
                {course.learningObjectives}
              </div>
            </CardContent>
          </Card>

          {/* Prerequisites */}
          {course.prerequisites && (
            <Card>
              <CardHeader>
                <CardTitle>Prerequisites</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{course.prerequisites}</p>
              </CardContent>
            </Card>
          )}

          {/* Assignments (for enrolled students and instructors) */}
          {(isEnrolled || canEdit) && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Assignments
                  </CardTitle>
                  {/* {canEdit && (
                    <Link href={`/courses/${course.id}/assignments/create`}>
                      <Button size="sm">Add Assignment</Button>
                    </Link>
                  )} */}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-gray-400">
                  {assignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{assignment.title}</h4>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          Due:{" "}
                          {new Date(assignment.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge
                        variant={
                          getAssignmentStatusColor(assignment.status) as any
                        }
                      >
                        {assignment.status}
                      </Badge>
                    </div>
                  ))}
                  {assignments.length === 0 && (
                    <p className="text-gray-500 text-center py-4">
                      No assignments yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Course Info */}
          <Card>
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-400">
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Created
                </span>
                <p className="text-sm">
                  {new Date(course.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Last Updated
                </span>
                <p className="text-sm">
                  {new Date(course.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Enrollment
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-sm">
                    {course.enrolledStudents} / {course.maxStudents}
                  </span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${
                          (course.enrolledStudents / course.maxStudents) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          {isEnrolled && (
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href={`/courses/${course.id}/materials`}>
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Course Materials
                  </Button>
                </Link>
                <Link href={`/courses/${course.id}/assignments`}>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    View Assignments
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Course"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete "{course.title}"? This action cannot
            be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCourse}
              disabled={actionLoading}
            >
              {actionLoading ? "Deleting..." : "Delete Course"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}