'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { 
  ArrowLeft, 
  FileText, 
  Calendar, 
  Clock, 
  Users, 
  Download,
  Upload,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Star,
  MessageSquare,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { getInitials } from '@/lib/utils';

interface Assignment {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  type: 'homework' | 'project' | 'quiz' | 'exam' | 'lab';
  totalPoints: number;
  dueDate: string;
  instructions?: string;
  allowLateSubmissions: boolean;
  latePenalty?: number;
  maxAttempts: number;
  showGradesAfterDue: boolean;
  requireFileUpload: boolean;
  allowedFileTypes?: string;
  maxFileSize?: number;
  createdBy: string;
  createdAt: string;
  attachments?: string[];
  submissions?: Submission[];
  status: 'draft' | 'published' | 'closed';
}

interface Submission {
  id: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  status: 'submitted' | 'graded' | 'late' | 'missing';
  grade?: number;
  feedback?: string;
  files?: string[];
  attempt: number;
}

// Mock assignment data
const mockAssignment: Assignment = {
  id: '1',
  title: 'Data Structures Implementation Project',
  description: 'Implement basic data structures including linked lists, stacks, and queues in your preferred programming language.',
  courseId: '2',
  courseName: 'Data Structures and Algorithms',
  courseCode: 'CS201',
  type: 'project',
  totalPoints: 100,
  dueDate: '2024-03-20T23:59:00',
  instructions: `# Project Instructions\n\n## Objective\nImplement the following data structures from scratch:\n\n1. **Linked List**\n   - Single linked list with basic operations\n   - Insert, delete, search, and display methods\n\n2. **Stack**\n   - Array-based or linked list-based implementation\n   - Push, pop, peek, and isEmpty methods\n\n3. **Queue**\n   - Circular queue implementation\n   - Enqueue, dequeue, front, and isEmpty methods\n\n## Requirements\n- Use any programming language (Python, Java, C++, etc.)\n- Include comprehensive test cases\n- Provide time complexity analysis\n- Submit well-documented code\n\n## Grading Criteria\n- Implementation correctness (40%)\n- Code quality and documentation (30%)\n- Test cases and analysis (20%)\n- Submission timeliness (10%)\n\n## Submission Format\n- Submit a ZIP file containing all source code\n- Include a README file with instructions\n- Provide a report with complexity analysis`,
  allowLateSubmissions: true,
  latePenalty: 10,
  maxAttempts: 2,
  showGradesAfterDue: false,
  requireFileUpload: true,
  allowedFileTypes: 'zip,rar,tar.gz',
  maxFileSize: 50,
  createdBy: '1',
  createdAt: '2024-03-01T10:00:00',
  attachments: ['project_template.zip', 'test_cases.txt'],
  status: 'published',
  submissions: [
    {
      id: '1',
      studentId: '3',
      studentName: 'John Smith',
      submittedAt: '2024-03-18T14:30:00',
      status: 'graded',
      grade: 85,
      feedback: 'Good implementation overall. The linked list and stack implementations are excellent. Queue implementation could be improved with better error handling.',
      files: ['john_smith_project.zip'],
      attempt: 1
    },
    {
      id: '2',
      studentId: '4',
      studentName: 'Emily Davis',
      submittedAt: '2024-03-19T20:15:00',
      status: 'submitted',
      files: ['emily_davis_project.zip'],
      attempt: 1
    },
    {
      id: '3',
      studentId: '6',
      studentName: 'Alex Thompson',
      submittedAt: '2024-03-21T10:30:00',
      status: 'late',
      files: ['alex_thompson_project.zip'],
      attempt: 1
    }
  ]
};

export default function AssignmentDetailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const assignmentId = params.id as string;
  
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'submissions' | 'analytics'>('overview');

  // Load assignment data
  useEffect(() => {
    const loadAssignment = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (assignmentId === '1') {
          setAssignment(mockAssignment);
        } else {
          router.push('/assignments');
        }
      } catch (error) {
        console.error('Error loading assignment:', error);
        router.push('/assignments');
      } finally {
        setIsLoading(false);
      }
    };

    if (assignmentId) {
      loadAssignment();
    }
  }, [assignmentId, router]);

  const handleDeleteAssignment = async () => {
    setActionLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      router.push('/assignments');
    } catch (error) {
      console.error('Error deleting assignment:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'homework': return 'secondary';
      case 'project': return 'warning';
      case 'quiz': return 'success';
      case 'exam': return 'destructive';
      case 'lab': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'success';
      case 'graded': return 'secondary';
      case 'late': return 'warning';
      case 'missing': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return <CheckCircle className="h-4 w-4" />;
      case 'graded': return <Star className="h-4 w-4" />;
      case 'late': return <AlertCircle className="h-4 w-4" />;
      case 'missing': return <XCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
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

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const canEdit = () => {
    return user?.role === 'admin' || 
           (user?.role === 'lecturer' && assignment?.createdBy === user.id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assignment...</p>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Assignment not found</h3>
        <p className="text-gray-600 mb-4">The assignment you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/assignments">
          <Button>Back to Assignments</Button>
        </Link>
      </div>
    );
  }

  const submissions = assignment?.submissions ?? [];
  const submittedCount = submissions.filter(
    (s) => s.status === 'submitted' || s.status === 'graded'
  ).length;
  const gradedCount = submissions.filter((s) => s.status === 'graded').length;
  const lateCount = submissions.filter((s) => s.status === 'late').length;
  const gradedSubmissions = submissions.filter(
    (s): s is Submission & { grade: number } => typeof s.grade === 'number'
  );
  const averageGrade =
    gradedSubmissions.length > 0
      ? gradedSubmissions.reduce((acc, s) => acc + s.grade, 0) /
        gradedSubmissions.length
      : 0;

  const submissionStats = {
    total: submissions.length || 0,
    submitted: submittedCount || 0,
    graded: gradedCount || 0,
    late: lateCount || 0,
    averageGrade: averageGrade || 0,
  };

  return (
    <div className="space-y-6 text-gray-400">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/assignments">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Assignments
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {assignment.title}
            </h1>
            <p className="text-gray-600 mt-1">
              {assignment.courseCode} - {assignment.courseName}
            </p>
          </div>
        </div>

        {canEdit() && (
          <div className="flex items-center gap-2">
            <Link href={`/assignments/${assignment.id}/edit`}>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteModal(true)}
              disabled={actionLoading}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Assignment Info Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <Badge
              variant={getTypeColor(assignment.type) as any}
              className="capitalize"
            >
              {assignment.type}
            </Badge>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>Due: {formatDate(assignment.dueDate)}</span>
              {isOverdue(assignment.dueDate) && (
                <Badge variant="destructive" className="ml-2">
                  Overdue
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Star className="h-4 w-4" />
              <span>{assignment.totalPoints} points</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>
                {submissionStats.submitted}/{submissionStats.total} submitted
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "overview"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Eye className="h-4 w-4 inline mr-2" />
            Overview
          </button>

          {(user?.role === "admin" || user?.role === "lecturer") && (
            <>
              <button
                onClick={() => setActiveTab("submissions")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "submissions"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <FileText className="h-4 w-4 inline mr-2" />
                Submissions ({submissionStats.submitted})
              </button>

              <button
                onClick={() => setActiveTab("analytics")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "analytics"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <BarChart3 className="h-4 w-4 inline mr-2" />
                Analytics
              </button>
            </>
          )}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {assignment.description}
                </p>
              </CardContent>
            </Card>

            {/* Instructions */}
            {assignment.instructions && (
              <Card>
                <CardHeader>
                  <CardTitle>Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                      {assignment.instructions}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Attachments */}
            {assignment.attachments && assignment.attachments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Assignment Files
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {assignment.attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium">{file}</span>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Assignment Details */}
            <Card>
              <CardHeader>
                <CardTitle>Assignment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Due Date
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">
                      {formatDate(assignment.dueDate)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Total Points
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">
                      {assignment.totalPoints} points
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Attempts Allowed
                  </label>
                  <div className="text-sm mt-1">{assignment.maxAttempts}</div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Late Submissions
                  </label>
                  <div className="text-sm mt-1">
                    {assignment.allowLateSubmissions
                      ? `Allowed (${assignment.latePenalty}% penalty per day)`
                      : "Not allowed"}
                  </div>
                </div>

                {assignment.requireFileUpload && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      File Upload
                    </label>
                    <div className="text-sm mt-1">
                      Required ({assignment.allowedFileTypes})
                      <br />
                      Max size: {assignment.maxFileSize}MB
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Student Submission (for students) */}
            {user?.role === "student" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Your Submission
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-4">
                      {isOverdue(assignment.dueDate) &&
                      !assignment.allowLateSubmissions
                        ? "Submission deadline has passed"
                        : "Submit your assignment"}
                    </p>
                    <Button
                      disabled={
                        isOverdue(assignment.dueDate) &&
                        !assignment.allowLateSubmissions
                      }
                      className="w-full"
                    >
                      {isOverdue(assignment.dueDate) &&
                      assignment.allowLateSubmissions
                        ? "Submit Late (Penalty Applied)"
                        : "Submit Assignment"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {activeTab === "submissions" &&
        (user?.role === "admin" || user?.role === "lecturer") && (
          <div className="space-y-6">
            {/* Submission Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {submissionStats.submitted}
                  </div>
                  <div className="text-sm text-gray-600">Submitted</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {submissionStats.graded}
                  </div>
                  <div className="text-sm text-gray-600">Graded</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {submissionStats.late}
                  </div>
                  <div className="text-sm text-gray-600">Late</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {submissionStats.averageGrade.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600">Avg Grade</div>
                </CardContent>
              </Card>
            </div>

            {/* Submissions List */}
            <Card>
              <CardHeader>
                <CardTitle>Student Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Student</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Submitted</th>
                        <th className="text-left py-3 px-4">Grade</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignment.submissions?.map((submission) => (
                        <tr
                          key={submission.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-blue-600">
                                  {getInitials(submission.studentName)}
                                </span>
                              </div>
                              <span className="font-medium">
                                {submission.studentName}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <Badge
                              variant={getStatusColor(submission.status) as any}
                              className="flex items-center gap-1 w-fit"
                            >
                              {getStatusIcon(submission.status)}
                              {submission.status}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm text-gray-600">
                              {formatDate(submission.submittedAt)}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            {submission.grade !== undefined ? (
                              <span className="font-medium">
                                {submission.grade}/{assignment.totalPoints}
                              </span>
                            ) : (
                              <span className="text-gray-400">Not graded</span>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedSubmission(submission);
                                setShowSubmissionModal(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

      {activeTab === "analytics" &&
        (user?.role === "admin" || user?.role === "lecturer") && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Assignment Analytics</CardTitle>
                <CardDescription>
                  Performance metrics and insights for this assignment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Analytics Coming Soon
                  </h3>
                  <p className="text-gray-600">
                    Detailed analytics including grade distribution, submission
                    patterns, and performance insights will be available here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Assignment"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete &ldquo;{assignment.title}&ldquo;?
            This action cannot be undone and will remove all submissions and
            grades.
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
              onClick={handleDeleteAssignment}
              disabled={actionLoading}
            >
              {actionLoading ? "Deleting..." : "Delete Assignment"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Submission Detail Modal */}
      <Modal
        isOpen={showSubmissionModal}
        onClose={() => setShowSubmissionModal(false)}
        title={`Submission by ${selectedSubmission?.studentName}`}
        size="lg"
      >
        {selectedSubmission && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Submitted
                </label>
                <div className="text-sm mt-1">
                  {formatDate(selectedSubmission.submittedAt)}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Status
                </label>
                <div className="mt-1">
                  <Badge
                    variant={getStatusColor(selectedSubmission.status) as any}
                  >
                    {selectedSubmission.status}
                  </Badge>
                </div>
              </div>
            </div>

            {selectedSubmission.files &&
              selectedSubmission.files.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Files
                  </label>
                  <div className="mt-2 space-y-2">
                    {selectedSubmission.files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <span className="text-sm">{file}</span>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {selectedSubmission.grade !== undefined && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Grade
                </label>
                <div className="text-lg font-bold mt-1">
                  {selectedSubmission.grade}/{assignment.totalPoints}
                </div>
              </div>
            )}

            {selectedSubmission.feedback && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Feedback
                </label>
                <div className="mt-1 p-3 bg-gray-50 rounded text-sm">
                  {selectedSubmission.feedback}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowSubmissionModal(false)}
              >
                Close
              </Button>
              {selectedSubmission.status !== "graded" && (
                <Button>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Grade Submission
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}