'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select, SelectItem } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Mail,
  Calendar,
  UserCheck,
  UserX,
  GraduationCap,
  BookOpen,
  AlertCircle,
  Loader2,
  Filter,
  Download,
  RefreshCw,
} from 'lucide-react';
import { getInitials } from '@/lib/utils';
import { usersApi } from '@/lib/api';

interface Student {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student';
  isActive: boolean;
  createdAt: string;
  studentId?: string;
  department?: string;
  enrolledCourses?: number;
  completedAssignments?: number;
}

export default function StudentsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Redirect if user doesn't have permission
  useEffect(() => {
    if (user && user.role !== 'admin' && user.role !== 'lecturer') {
      router.push('/dashboard');
    }
  }, [user, router]);

  // Fetch students data
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await usersApi.getStudents();
      setStudents(response.data);
      setFilteredStudents(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'lecturer')) {
      fetchStudents();
    }
  }, [user]);

  // Filter students based on search and filters
  useEffect(() => {
    let filtered = students;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (student) =>
          student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.studentId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((student) => {
        if (statusFilter === 'active') return student.isActive;
        if (statusFilter === 'inactive') return !student.isActive;
        return true;
      });
    }

    // Department filter
    if (departmentFilter !== 'all') {
      filtered = filtered.filter(
        (student) => student.department === departmentFilter
      );
    }

    setFilteredStudents(filtered);
  }, [students, searchTerm, statusFilter, departmentFilter]);

  // Handle student activation/deactivation
  const handleToggleStatus = async (student: Student) => {
    try {
      setActionLoading(student.id);
      if (student.isActive) {
        await usersApi.deactivate(student.id);
      } else {
        await usersApi.activate(student.id);
      }
      await fetchStudents();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update student status');
    } finally {
      setActionLoading(null);
    }
  };

  // Handle student deletion
  const handleDelete = async () => {
    if (!selectedStudent) return;

    try {
      setActionLoading(selectedStudent.id);
      await usersApi.delete(selectedStudent.id);
      await fetchStudents();
      setShowDeleteModal(false);
      setSelectedStudent(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete student');
    } finally {
      setActionLoading(null);
    }
  };

  // Get unique departments for filter
  const departments = Array.from(
    new Set(students.map((s) => s.department).filter(Boolean))
  );

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  const departmentOptions = [
    { value: 'all', label: 'All Departments' },
    ...departments.map((dept) => ({ value: dept!, label: dept! })),
  ];

  if (!user || (user.role !== 'admin' && user.role !== 'lecturer')) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600 mt-1">
            {user.role === 'admin'
              ? 'Manage all students in the system'
              : 'View and manage students in your courses'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={fetchStudents}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {user.role === 'admin' && (
            <Link href="/users/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Student
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setError(null)}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                ×
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Students
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, email, or student ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Status
              </label>
              <Select
                options={statusOptions}
                value={statusFilter}
                onChange={(value) => setStatusFilter(value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Department
              </label>
              <Select
                options={departmentOptions}
                value={departmentFilter}
                onChange={(value) => setDepartmentFilter(value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{students.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Students</p>
                <p className="text-2xl font-bold text-green-600">
                  {students.filter((s) => s.isActive).length}
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inactive Students</p>
                <p className="text-2xl font-bold text-red-600">
                  {students.filter((s) => !s.isActive).length}
                </p>
              </div>
              <UserX className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Filtered Results</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredStudents.length}
                </p>
              </div>
              <Filter className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Students List
          </CardTitle>
          <CardDescription>
            {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading students...</span>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No students found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== 'all' || departmentFilter !== 'all'
                  ? 'Try adjusting your filters to see more results.'
                  : 'No students have been added to the system yet.'}
              </p>
              {user.role === 'admin' && (
                <Link href="/users/create">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Student
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Student</th>
                    <th className="text-left py-3 px-4">Student ID</th>
                    <th className="text-left py-3 px-4">Department</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Joined</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {getInitials(`${student.firstName} ${student.lastName}`)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {student.firstName} {student.lastName}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {student.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-900">
                          {student.studentId || 'N/A'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-900">
                          {student.department || 'N/A'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          variant={student.isActive ? 'success' : 'destructive'}
                        >
                          {student.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="h-3 w-3" />
                          {new Date(student.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedStudent(student);
                              setShowDetailsModal(true);
                            }}
                          >
                            View
                          </Button>
                          {user.role === 'admin' && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleStatus(student)}
                                disabled={actionLoading === student.id}
                              >
                                {actionLoading === student.id ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : student.isActive ? (
                                  <UserX className="h-3 w-3" />
                                ) : (
                                  <UserCheck className="h-3 w-3" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedStudent(student);
                                  setShowDeleteModal(true);
                                }}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Student Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedStudent(null);
        }}
        title="Student Details"
      >
        {selectedStudent && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-lg font-medium text-blue-600">
                  {getInitials(`${selectedStudent.firstName} ${selectedStudent.lastName}`)}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedStudent.firstName} {selectedStudent.lastName}
                </h3>
                <p className="text-gray-600">{selectedStudent.email}</p>
                <Badge
                  variant={selectedStudent.isActive ? 'success' : 'destructive'}
                  className="mt-1"
                >
                  {selectedStudent.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Student ID</label>
                <p className="text-sm text-gray-900">{selectedStudent.studentId || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Department</label>
                <p className="text-sm text-gray-900">{selectedStudent.department || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Joined Date</label>
                <p className="text-sm text-gray-900">
                  {new Date(selectedStudent.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Role</label>
                <p className="text-sm text-gray-900 capitalize">{selectedStudent.role}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedStudent(null);
                }}
              >
                Close
              </Button>
              {user.role === 'admin' && (
                <Link href={`/users/${selectedStudent.id}/edit`}>
                  <Button>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Student
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedStudent(null);
        }}
        title="Delete Student"
      >
        {selectedStudent && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-medium text-red-800">
                  Are you sure you want to delete this student?
                </p>
                <p className="text-sm text-red-600">
                  This action cannot be undone. All student data, enrollments, and submissions will be permanently removed.
                </p>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">
                {selectedStudent.firstName} {selectedStudent.lastName}
              </p>
              <p className="text-sm text-gray-600">{selectedStudent.email}</p>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedStudent(null);
                }}
                disabled={actionLoading === selectedStudent.id}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={actionLoading === selectedStudent.id}
              >
                {actionLoading === selectedStudent.id ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Student
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}