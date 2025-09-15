'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { assignmentsApi, coursesApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { 
  ArrowLeft, 
  FileText, 
  Calendar, 
  Clock, 
  BookOpen,
  Upload,
  Plus,
  X,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

interface Course {
  id: string;
  title: string;
  code: string;
}

const assignmentTypes = ['homework', 'project', 'quiz', 'exam', 'lab'] as const;

const createAssignmentSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  courseId: z.string().min(1, 'Please select a course'),
  type: z.enum(assignmentTypes, {
    message: 'Please select an assignment type'
  }),
  totalPoints: z.number().min(1, 'Total points must be at least 1').max(1000, 'Total points cannot exceed 1000'),
  dueDate: z.string().min(1, 'Due date is required'),
  dueTime: z.string().min(1, 'Due time is required'),
  instructions: z.string().optional(),
  allowLateSubmissions: z.boolean(),
  latePenalty: z.number().min(0).max(100).optional(),
  maxAttempts: z.number().min(1).max(10).optional(),
  showGradesAfterDue: z.boolean(),
  requireFileUpload: z.boolean(),
  allowedFileTypes: z.string().optional(),
  maxFileSize: z.number().min(1).max(100).optional()
});

type CreateAssignmentForm = z.infer<typeof createAssignmentSchema>;

export default function CreateAssignmentPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingWithAI, setIsGeneratingWithAI] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset
  } = useForm<CreateAssignmentForm>({
    resolver: zodResolver(createAssignmentSchema),
    defaultValues: {
      type: 'homework',
      totalPoints: 100,
      allowLateSubmissions: true,
      latePenalty: 10,
      maxAttempts: 1,
      showGradesAfterDue: false,
      requireFileUpload: false,
      maxFileSize: 10
    }
  });

  const watchRequireFileUpload = watch('requireFileUpload');
  const watchAllowLateSubmissions = watch('allowLateSubmissions');
  const watchCourseId = watch('courseId');
  const watchType = watch('type');

  // Redirect if user is not lecturer or admin
  useEffect(() => {
    if (user?.role !== 'lecturer' && user?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, router]);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoadingCourses(true);
        const response = await coursesApi.getAll();
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setIsLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  const onSubmit = async (data: CreateAssignmentForm) => {
    setIsLoading(true);
    try {
      // Transform data to match backend DTO structure
      const assignmentData = {
        title: data.title,
        description: data.description,
        type: data.type,
        courseId: data.courseId,
        notes: data.instructions || undefined
      };
      
      // Create assignment via API
      const response = await assignmentsApi.create(assignmentData);
      console.log('Assignment created successfully:', response.data);
      
      // Redirect to assignments page on success
      router.push('/assignments');
    } catch (error) {
      console.error('Error creating assignment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateWithAI = async () => {
    if (!watchCourseId || !watchType) {
      alert('Please select a course and assignment type first.');
      return;
    }

    setIsGeneratingWithAI(true);
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const selectedCourse = courses.find(c => c.id === watchCourseId);
      const aiGeneratedContent = {
        title: `${watchType.charAt(0).toUpperCase() + watchType.slice(1)}: ${selectedCourse?.title} - Week 1`,
        description: `This ${watchType} focuses on fundamental concepts in ${selectedCourse?.title}. Students will demonstrate their understanding through practical application and theoretical analysis.`,
        instructions: `Instructions for ${watchType}:\n\n1. Read the assigned materials thoroughly\n2. Complete all required sections\n3. Provide detailed explanations for your answers\n4. Submit before the due date\n\nGrading Criteria:\n- Accuracy and completeness (40%)\n- Quality of explanations (30%)\n- Proper formatting and presentation (20%)\n- Timeliness of submission (10%)`
      };
      
      setValue('title', aiGeneratedContent.title);
      setValue('description', aiGeneratedContent.description);
      setValue('instructions', aiGeneratedContent.instructions);
    } catch (error) {
      console.error('Error generating with AI:', error);
    } finally {
      setIsGeneratingWithAI(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'homework': return 'bg-blue-100 text-blue-800';
      case 'project': return 'bg-purple-100 text-purple-800';
      case 'quiz': return 'bg-green-100 text-green-800';
      case 'exam': return 'bg-red-100 text-red-800';
      case 'lab': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const assignmentTypesOptions = [
    { value: 'homework', label: 'Homework' },
    { value: 'project', label: 'Project' },
    { value: 'quiz', label: 'Quiz' },
    { value: 'exam', label: 'Exam' },
    { value: 'lab', label: 'Lab Assignment' }
  ]

  if (user?.role !== 'lecturer' && user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
              Create Assignment
            </h1>
            <p className="text-gray-600 mt-1">
              Create a new assignment for your course
            </p>
          </div>
        </div>

        <Button
          onClick={generateWithAI}
          disabled={isGeneratingWithAI || !watchCourseId || !watchType}
          variant="outline"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          {isGeneratingWithAI ? "Generating..." : "Generate with AI"}
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Assignment Details
            </CardTitle>
            <CardDescription>
              Provide basic information about the assignment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Course *
                </label>
                <Select
                  options={[
                    { value: "", label: isLoadingCourses ? "Loading courses..." : "Select a Course" },
                    ...courses.map((c) => ({
                      value: c.id,
                      label: c.code + " - " + c.title,
                    })),
                  ]}
                  {...register("courseId")}
                  error={errors.courseId?.message}
                  disabled={isLoadingCourses}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Assignment Type *
                </label>
                <Select
                  options={assignmentTypesOptions}
                  {...register("type")}
                  error={errors.type?.message}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Assignment Title *
              </label>
              <Input
                {...register("title")}
                placeholder="Enter assignment title"
                error={errors.title?.message}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                {...register("description")}
                className="w-full placeholder:text-gray-400 text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Provide a brief description of the assignment"
              />
              {errors.description && (
                <p className="text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Detailed Instructions
              </label>
              <textarea
                {...register("instructions")}
                className="w-full placeholder:text-gray-400 text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={6}
                placeholder="Provide detailed instructions, grading criteria, and requirements..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Due Date and Grading */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Due Date & Grading
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Due Date *
                </label>
                <Input
                  {...register("dueDate")}
                  type="date"
                  error={errors.dueDate?.message}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Due Time *
                </label>
                <Input
                  {...register("dueTime")}
                  type="time"
                  error={errors.dueTime?.message}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Total Points *
                </label>
                <Input
                  {...register("totalPoints", { valueAsNumber: true })}
                  type="number"
                  min="1"
                  max="1000"
                  placeholder="100"
                  error={errors.totalPoints?.message}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    {...register("allowLateSubmissions")}
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Allow Late Submissions
                  </label>
                </div>

                {watchAllowLateSubmissions && (
                  <div className="ml-6 space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Late Penalty (% per day)
                    </label>
                    <Input
                      {...register("latePenalty", { valueAsNumber: true })}
                      type="number"
                      min="0"
                      max="100"
                      placeholder="10"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Maximum Attempts
                  </label>
                  <Input
                    {...register("maxAttempts", { valueAsNumber: true })}
                    type="number"
                    min="1"
                    max="10"
                    placeholder="1"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    {...register("showGradesAfterDue")}
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Show Grades After Due Date
                  </label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* File Upload Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              File Upload Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                {...register("requireFileUpload")}
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label className="text-sm font-medium text-gray-700">
                Require File Upload
              </label>
            </div>

            {watchRequireFileUpload && (
              <div className="ml-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Allowed File Types
                  </label>
                  <Input
                    {...register("allowedFileTypes")}
                    placeholder="pdf,doc,docx,txt"
                  />
                  <p className="text-xs text-gray-500">
                    Comma-separated file extensions (e.g., pdf,doc,docx)
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Max File Size (MB)
                  </label>
                  <Input
                    {...register("maxFileSize", { valueAsNumber: true })}
                    type="number"
                    min="1"
                    max="100"
                    placeholder="10"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Attachments */}
        <Card>
          <CardHeader>
            <CardTitle>Assignment Attachments</CardTitle>
            <CardDescription>
              Upload files that students will need for this assignment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Upload assignment files
              </p>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button type="button" variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Choose Files
                </Button>
              </label>
            </div>

            {attachments.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">
                  Attached Files:
                </h4>
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded"
                  >
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeAttachment(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end gap-3">
          <Link href="/assignments">
            <Button type="button" variant="outline" disabled={isLoading}>
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating Assignment..." : "Create Assignment"}
          </Button>
        </div>
      </form>
    </div>
  );
}