'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { coursesApi, enrollmentsApi, assignmentsApi, aiApi } from '@/lib/api';
import {
  BookOpen,
  Users,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
} from 'lucide-react';

interface DashboardStats {
  admin: {
    totalUsers: number;
    totalCourses: number;
    activeEnrollments: number;
    pendingApprovals: number;
  };
  lecturer: {
    myCourses: number;
    totalStudents: number;
    pendingAssignments: number;
    upcomingDeadlines: number;
  };
  student: {
    enrolledCourses: number;
    completedAssignments: number;
    pendingAssignments: number;
    upcomingDeadlines: number;
  };
}

interface Activity {
  id: string;
  action: string;
  user?: string;
  student?: string;
  course?: string;
  grade?: string;
  time: string;
}

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    activeEnrollments: 0,
    pendingApprovals: 0,
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setError(null);
        const [coursesResponse, enrollmentsResponse] = await Promise.all([
           coursesApi.getAll(),
           enrollmentsApi.getAll(),
         ]);

        setStats({
          totalUsers: 1250, // This would come from a users API
          totalCourses: coursesResponse.data.length,
          activeEnrollments: enrollmentsResponse.data.filter(e => e.status === 'ACTIVE').length,
          pendingApprovals: enrollmentsResponse.data.filter(e => e.status === 'PENDING').length,
        });

        // Mock recent activities - in real app, this would come from an activity log API
        setActivities([
          { id: '1', action: 'New user registered', user: 'John Doe', time: '2 hours ago' },
          { id: '2', action: 'Course created', user: 'Dr. Smith', time: '4 hours ago' },
          { id: '3', action: 'Assignment submitted', user: 'Jane Wilson', time: '6 hours ago' },
        ]);
      } catch (error) {
        console.error('Error fetching admin data:', error);
        setError('Failed to load dashboard data. Please try refreshing the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) {
     return (
       <div className="flex items-center justify-center min-h-[400px]">
         <div className="flex flex-col items-center space-y-4">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
           <p className="text-gray-600">Loading dashboard...</p>
         </div>
       </div>
     );
   }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4 text-center">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <div>
            <p className="text-gray-900 font-medium">Something went wrong</p>
            <p className="text-gray-600 text-sm mt-1">{error}</p>
          </div>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
            <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
            <p className="text-xs text-gray-500">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Courses</CardTitle>
            <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalCourses}</div>
            <p className="text-xs text-gray-500">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +3 new this month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Enrollments</CardTitle>
            <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.activeEnrollments}</div>
            <p className="text-xs text-gray-500">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Approvals</CardTitle>
            <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.pendingApprovals}</div>
            <p className="text-xs text-gray-500">
              Requires attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="shadow-sm border-0 bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-blue-600" />
            Recent Activity
          </CardTitle>
          <CardDescription>Latest system activities and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-3 h-3 bg-blue-600 rounded-full" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500 truncate">by {activity.user}</p>
                </div>
                <div className="text-xs text-gray-500 shrink-0">{activity.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function LecturerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    myCourses: 0,
    totalStudents: 0,
    pendingAssignments: 0,
    upcomingDeadlines: 0,
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLecturerData = async () => {
      try {
        setError(null);
        const [coursesResponse, assignmentsResponse, enrollmentsResponse] = await Promise.all([
            coursesApi.getMyCourses(),
            assignmentsApi.getByLecturer(),
            enrollmentsApi.getMyCourseEnrollments(),
          ]);

        const myCourses = coursesResponse.data;
        const myAssignments = assignmentsResponse.data.filter(a => 
          myCourses.some(c => c.id === a.courseId)
        );
        const myEnrollments = enrollmentsResponse.data.filter(e => 
          myCourses.some(c => c.id === e.courseId)
        );

        setStats({
          myCourses: myCourses.length,
          totalStudents: myEnrollments.length,
          pendingAssignments: myAssignments.filter(a => a.status === 'PENDING').length,
          upcomingDeadlines: myAssignments.filter(a => {
            const deadline = new Date(a.dueDate);
            const now = new Date();
            const diffTime = deadline.getTime() - now.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= 7 && diffDays > 0;
          }).length,
        });

        // Mock recent activities - in real app, this would come from an activity log API
        setActivities([
          { id: '1', action: 'Assignment submitted', student: 'Alice Johnson', course: 'Web Development', time: '1 hour ago' },
          { id: '2', action: 'New enrollment', student: 'Bob Smith', course: 'React Fundamentals', time: '3 hours ago' },
          { id: '3', action: 'Question posted', student: 'Carol Davis', course: 'JavaScript Basics', time: '5 hours ago' },
        ]);
      } catch (error) {
        console.error('Error fetching lecturer data:', error);
        setError('Failed to load dashboard data. Please try refreshing the page.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchLecturerData();
    }
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4 text-center">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <div>
            <p className="text-gray-900 font-medium">Something went wrong</p>
            <p className="text-gray-600 text-sm mt-1">{error}</p>
          </div>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4 text-center">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <div>
            <p className="text-gray-900 font-medium">Something went wrong</p>
            <p className="text-gray-600 text-sm mt-1">{error}</p>
          </div>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">My Courses</CardTitle>
            <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.myCourses}</div>
            <Button variant="link" className="p-0 h-auto text-xs">
              <Plus className="h-3 w-3 mr-1" />
              Create new course
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Students</CardTitle>
            <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalStudents}</div>
            <p className="text-xs text-gray-500">
              Across all courses
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Assignments</CardTitle>
            <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.pendingAssignments}</div>
            <p className="text-xs text-gray-500">
              Need grading
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Upcoming Deadlines</CardTitle>
            <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.upcomingDeadlines}</div>
            <p className="text-xs text-gray-500">
              Next 7 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="shadow-sm border-0 bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-green-600" />
            Recent Activity
          </CardTitle>
          <CardDescription>Latest updates from your courses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-3 h-3 bg-green-600 rounded-full" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {activity.student} - {activity.course}
                  </p>
                </div>
                <div className="text-xs text-gray-500 shrink-0">{activity.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    completedAssignments: 0,
    pendingAssignments: 0,
    upcomingDeadlines: 0,
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setError(null);
        const [enrollmentsResponse, assignmentsResponse] = await Promise.all([
           enrollmentsApi.getMy(),
           assignmentsApi.getMy(),
         ]);

        const myEnrollments = enrollmentsResponse.data;
        const myAssignments = assignmentsResponse.data.filter(a => 
          myEnrollments.some(e => e.courseId === a.courseId)
        );

        setStats({
          enrolledCourses: myEnrollments.length,
          completedAssignments: myAssignments.filter(a => a.status === 'COMPLETED').length,
          pendingAssignments: myAssignments.filter(a => a.status === 'PENDING').length,
          upcomingDeadlines: myAssignments.filter(a => {
            const deadline = new Date(a.dueDate);
            const now = new Date();
            const diffTime = deadline.getTime() - now.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= 7 && diffDays > 0;
          }).length,
        });

        // Mock recent activities - in real app, this would come from an activity log API
        setActivities([
          { id: '1', action: 'Assignment graded', course: 'Web Development', grade: 'A-', time: '2 hours ago' },
          { id: '2', action: 'New material uploaded', course: 'React Fundamentals', time: '1 day ago' },
          { id: '3', action: 'Deadline reminder', course: 'JavaScript Basics', time: '2 days ago' },
        ]);
      } catch (error) {
        console.error('Error fetching student data:', error);
        setError('Failed to load dashboard data. Please try refreshing the page.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchStudentData();
    }
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4 text-center">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <div>
            <p className="text-gray-900 font-medium">Something went wrong</p>
            <p className="text-gray-600 text-sm mt-1">{error}</p>
          </div>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Enrolled Courses</CardTitle>
            <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.enrolledCourses}</div>
            <Button variant="link" className="p-0 h-auto text-xs">
              Browse more courses
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Completed Assignments</CardTitle>
            <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.completedAssignments}</div>
            <p className="text-xs text-gray-500">
              Great progress!
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Assignments</CardTitle>
            <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.pendingAssignments}</div>
            <p className="text-xs text-gray-500">
              Due soon
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Upcoming Deadlines</CardTitle>
            <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.upcomingDeadlines}</div>
            <p className="text-xs text-gray-500">
              Next 7 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="shadow-sm border-0 bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
            Recent Activity
          </CardTitle>
          <CardDescription>Your latest course updates and grades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-3 h-3 bg-purple-600 rounded-full" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {activity.course}
                    {activity.grade && (
                      <Badge variant="success" className="ml-2">
                        {activity.grade}
                      </Badge>
                    )}
                  </p>
                </div>
                <div className="text-xs text-gray-500 shrink-0">{activity.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();

  console.log('User role:', user?.role);

  const getDashboardContent = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'lecturer':
        return <LecturerDashboard />;
      case 'student':
        return <StudentDashboard />;
      default:
        return <div>Loading...</div>;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening in your {user?.role?.toLowerCase()} dashboard.
        </p>
      </div>

      {getDashboardContent()}
    </div>
  );
}