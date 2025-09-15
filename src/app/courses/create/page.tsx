'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { coursesApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ArrowLeft, Save, Sparkles } from 'lucide-react';
import Link from 'next/link';

// Form validation schema matching backend CreateCourseDto
const courseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description must be less than 1000 characters'),
  credits: z.number().min(1, 'Credits must be at least 1').max(6, 'Credits cannot exceed 6'),
  maxStudents: z.number().min(1, 'Must have at least 1 student').max(200, 'Cannot exceed 200 students'),
  courseCode: z.string().min(1, 'Course code is required').max(20, 'Course code must be less than 20 characters'),
  semester: z.string().min(1, 'Semester is required').max(20, 'Semester must be less than 20 characters'),
  year: z.number().min(2020, 'Year must be at least 2020').max(2030, 'Year cannot exceed 2030'),
  prerequisites: z.string().max(500, 'Prerequisites must be less than 500 characters').optional()
});

type CourseFormData = z.infer<typeof courseSchema>;

// Options for credits
const creditsOptions = [
  { value: '1', label: '1 Credit' },
  { value: '2', label: '2 Credits' },
  { value: '3', label: '3 Credits' },
  { value: '4', label: '4 Credits' },
  { value: '5', label: '5 Credits' },
  { value: '6', label: '6 Credits' }
];

// Options for semester
const semesterOptions = [
  { value: 'Fall', label: 'Fall' },
  { value: 'Spring', label: 'Spring' },
  { value: 'Summer', label: 'Summer' },
  { value: 'Winter', label: 'Winter' }
];

// Options for year
const yearOptions = [
  { value: '2024', label: '2024' },
  { value: '2025', label: '2025' },
  { value: '2026', label: '2026' },
  { value: '2027', label: '2027' },
  { value: '2028', label: '2028' }
];

export default function CreateCoursePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingSyllabus, setIsGeneratingSyllabus] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      credits: 3,
      maxStudents: 30,
      year: new Date().getFullYear()
    }
  });

  // Redirect if user doesn't have permission
  if (user?.role !== 'admin' && user?.role !== 'lecturer') {
    router.push('/dashboard');
    return null;
  }

  const onSubmit = async (data: CourseFormData) => {
    setIsLoading(true);
    try {
      // Create course via API
      const response = await coursesApi.create(data);
      console.log('Course created successfully:', response.data);
      
      // Redirect to courses page on success
      router.push('/courses');
    } catch (error) {
      console.error('Error creating course:', error);
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/courses">
          <Button variant="secondary" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Create New Course
          </h1>
          <p className="text-gray-600 mt-1">
            Design and publish a new course for students
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Provide the essential details about your course
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Course Title"
                  placeholder="e.g., Introduction to Web Development"
                  error={errors.title?.message}
                  {...register("title")}
                />
              </div>
              <div>
                <Input
                  label="Course Code"
                  placeholder="e.g., CS101"
                  error={errors.courseCode?.message}
                  {...register("courseCode")}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Description
              </label>
              <textarea
                className="w-full placeholder:text-gray-400 text-gray-700 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                placeholder="Provide a detailed description of what students will learn..."
                {...register("description")}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Select
                  label="Credits"
                  options={creditsOptions}
                  error={errors.credits?.message}
                  {...register("credits", { valueAsNumber: true })}
                />
              </div>
              <div>
                <Input
                  label="Max Students"
                  type="number"
                  min="1"
                  max="200"
                  error={errors.maxStudents?.message}
                  {...register("maxStudents", { valueAsNumber: true })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Select
                  label="Semester"
                  options={semesterOptions}
                  error={errors.semester?.message}
                  {...register("semester")}
                />
              </div>
              <div>
                <Select
                  label="Year"
                  options={yearOptions}
                  error={errors.year?.message}
                  {...register("year", { valueAsNumber: true })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Content */}
        <Card>
          <CardHeader>
            <CardTitle>Course Content</CardTitle>
            <CardDescription>
              Define the prerequisites for this course
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prerequisites (Optional)
              </label>
              <textarea
                className="w-full placeholder:text-gray-400 text-gray-700 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="List any prerequisites or recommended background knowledge..."
                {...register("prerequisites")}
              />
              {errors.prerequisites && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.prerequisites.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>



        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/courses")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Creating..." : "Create Course"}
          </Button>
        </div>
      </form>
    </div>
  );
}