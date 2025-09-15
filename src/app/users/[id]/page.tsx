'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  BookOpen, 
  GraduationCap,
  Edit,
  Save,
  X,
  Trash2,
  UserCheck,
  UserX,
  Clock,
  MapPin
} from 'lucide-react';
import Link from 'next/link';
import { getInitials } from "@/lib/utils";
import { usersApi } from "@/lib/api";
import { stat } from 'fs';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'lecturer' | 'student';
  status: 'active' | 'inactive' | 'suspended';
  department?: string;
  studentId?: string;
  employeeId?: string;
  enrolledCourses?: number;
  createdCourses?: number;
  lastLogin?: string;
  createdAt: string;
  avatar?: string;
  phone?: string;
  address?: string;
  bio?: string;
}



const editUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'lecturer', 'student']),
  status: z.enum(['active', 'inactive', 'suspended']),
  department: z.string().optional(),
  studentId: z.string().optional(),
  employeeId: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().optional()
});

type EditUserForm = z.infer<typeof editUserSchema>;

export default function UserDetailPage() {
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'lecturer', label: 'Lecturer' },
    { value: 'student', label: 'Student' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' }
  ]

  const departmentOptions= [
    { value: 'Computer Science', label: 'Computer Science' },
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'Physics', label: 'Physics' },
    { value: 'Chemistry', label: 'Chemistry' },
    { value: 'Biology', label: 'Biology' },
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Business', label: 'Business' },
    { value: 'Psychology', label: 'Psychology' }
  ]

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<EditUserForm>({
    resolver: zodResolver(editUserSchema)
  });

  const watchedRole = watch('role');

  // Redirect if user is not admin
  useEffect(() => {
    if (currentUser?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [currentUser, router]);

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        const response = await usersApi.getById(userId);
        const user = response.data;
        setUserData(user);
        reset(user);
      } catch (error) {
        console.error('Error loading user:', error);
        router.push('/users');
      } finally {
        setIsLoading(false);
      }
    };

    if (userId && currentUser?.role === 'admin') {
      loadUserData();
    }
  }, [userId, reset, router, currentUser]);

  const onSubmit = async (data: EditUserForm) => {
    setActionLoading(true);
    try {
      const response = await usersApi.update(userId, data);
      const updatedUser = response.data;
      
      // Update local state
      setUserData(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    setActionLoading(true);
    try {
      await usersApi.delete(userId);
      router.push('/users');
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: 'active' | 'inactive' | 'suspended') => {
    setActionLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (userData) {
        setUserData({ ...userData, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'lecturer': return 'warning';
      case 'student': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'secondary';
      case 'suspended': return 'destructive';
      default: return 'secondary';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="h-4 w-4" />;
      case 'lecturer': return <BookOpen className="h-4 w-4" />;
      case 'student': return <GraduationCap className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <UserCheck className="h-4 w-4" />;
      case 'inactive': return <UserX className="h-4 w-4" />;
      case 'suspended': return <UserX className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (currentUser?.role !== 'admin') {
    return null;
  }

  if (isLoading || !userData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/users">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {userData.name}
            </h1>
            <p className="text-gray-600 mt-1">User Details & Management</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit User
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">
                    {getInitials(userData.name)}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {userData.name}
                </h2>

                <div className="flex items-center justify-center gap-2 mb-4">
                  <Badge
                    variant={getRoleColor(userData.role) as any}
                    className="flex items-center gap-1"
                  >
                    {getRoleIcon(userData.role)}
                    {userData.role}
                  </Badge>
                  <Badge
                    variant={getStatusColor(userData.status) as any}
                    className="flex items-center gap-1"
                  >
                    {getStatusIcon(userData.status)}
                    {userData.status}
                  </Badge>
                </div>

                {userData.bio && (
                  <p className="text-sm text-gray-600 mb-4">{userData.bio}</p>
                )}

                {/* Quick Actions */}
                <div className="space-y-2">
                  {userData.status === "active" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleStatusChange("suspended")}
                      disabled={actionLoading}
                    >
                      Suspend User
                    </Button>
                  )}

                  {userData.status === "suspended" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleStatusChange("active")}
                      disabled={actionLoading}
                    >
                      Activate User
                    </Button>
                  )}

                  {userData.id !== currentUser.id && (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full"
                      onClick={() => setShowDeleteModal(true)}
                      disabled={actionLoading}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete User
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Activity Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-400">
                {userData.role === "student" && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Enrolled Courses
                    </span>
                    <span className="font-medium">
                      {userData.enrolledCourses || 0}
                    </span>
                  </div>
                )}

                {userData.role === "lecturer" && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Created Courses
                    </span>
                    <span className="font-medium">
                      {userData.createdCourses || 0}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Login</span>
                  <span className="font-medium text-sm">
                    {userData.lastLogin
                      ? formatDate(userData.lastLogin)
                      : "Never"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Member Since</span>
                  <span className="font-medium text-sm">
                    {new Date(userData.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Details Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>User Information</CardTitle>
                  <CardDescription>
                    {isEditing
                      ? "Edit user details below"
                      : "View user information"}
                  </CardDescription>
                </div>

                {isEditing && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      reset(userData);
                    }}
                    disabled={actionLoading}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <Input
                        {...register("name")}
                        error={errors.name?.message}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <Input
                        {...register("email")}
                        type="email"
                        error={errors.email?.message}
                      />
                    </div>
                  </div>

                  {/* Role and Status */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Role
                      </label>
                      <Select
                        options={roleOptions}
                        {...register("role")}
                        error={errors.role?.message}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Status
                      </label>
                      <Select
                        options={statusOptions}
                        {...register("status")}
                        error={errors.status?.message}
                      />
                    </div>
                  </div>

                  {/* Role-specific fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Department
                      </label>
                      <Select
                        options={departmentOptions}
                        {...register("department")}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        {watchedRole === "student"
                          ? "Student ID"
                          : "Employee ID"}
                      </label>
                      <Input
                        {...register(
                          watchedRole === "student" ? "studentId" : "employeeId"
                        )}
                        placeholder={`Enter ${
                          watchedRole === "student" ? "student" : "employee"
                        } ID`}
                      />
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Phone
                      </label>
                      <Input
                        {...register("phone")}
                        placeholder="Enter phone number"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Address
                      </label>
                      <Input
                        {...register("address")}
                        placeholder="Enter address"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Bio
                    </label>
                    <textarea
                      {...register("bio")}
                      className="w-full placeholder:text-gray-400 text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="Enter bio"
                    />
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end gap-3 pt-6 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        reset(userData);
                      }}
                      disabled={actionLoading}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={actionLoading}>
                      <Save className="h-4 w-4 mr-2" />
                      {actionLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  {/* View Mode */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Email
                        </label>
                        <div className="flex items-center gap-2 mt-1">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">
                            {userData.email}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Department
                        </label>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">
                            {userData.department || "Not specified"}
                          </span>
                        </div>
                      </div>

                      {userData.phone && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Phone
                          </label>
                          <div className="text-gray-900 mt-1">
                            {userData.phone}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          {userData.role === "student"
                            ? "Student ID"
                            : "Employee ID"}
                        </label>
                        <div className="text-gray-900 mt-1">
                          {userData.studentId ||
                            userData.employeeId ||
                            "Not specified"}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Created
                        </label>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">
                            {formatDate(userData.createdAt)}
                          </span>
                        </div>
                      </div>

                      {userData.address && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Address
                          </label>
                          <div className="text-gray-900 mt-1">
                            {userData.address}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete User"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete &apos;{userData.name}&apos;? This action
            cannot be undone and will remove all associated data.
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
              onClick={handleDeleteUser}
              disabled={actionLoading}
            >
              {actionLoading ? "Deleting..." : "Delete User"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}