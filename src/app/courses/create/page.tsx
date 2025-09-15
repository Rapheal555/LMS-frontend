'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ArrowLeft, Save, Sparkles } from 'lucide-react';
import Link from 'next/link';

const statusTypes = ['Draft', 'Active'] as const;
const levelTypes = ['Beginner', 'Intermediate', 'Advanced'] as const;

const courseSchema = z.object({
  title: z
    .string()
    .min(1, "Course title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  category: z.string().min(1, "Category is required"),
  level: z.enum(levelTypes, {
    message: "Level is required",
  }),
  duration: z.string().min(1, "Duration is required"),
  maxStudents: z
    .number()
    .min(1, "Maximum students must be at least 1")
    .max(200, "Maximum students cannot exceed 200"),
  prerequisites: z.string().optional(),
  learningObjectives: z
    .string()
    .min(10, "Learning objectives must be at least 10 characters"),
  status: z.enum(statusTypes, {
    message: "Status is required",
  }),
});

type CourseFormData = z.infer<typeof courseSchema>;

const categories = [
  'Computer Science',
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Machine Learning',
  'Cybersecurity',
  'Database Management',
  'Software Engineering',
  'UI/UX Design',
  'Project Management'
];

const categoriesOptions = categories.map(category => ({
  value: category,
  label: category
}));

const levelOptions = [
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' }
];

const statusOptions = [
  { value: 'Draft', label: 'Draft - Save for later editing' },
  { value: 'Active', label: 'Active - Publish immediately' }
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
      status: 'Draft',
      maxStudents: 30
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Course created:', data);
      
      // Redirect to courses page
      router.push('/courses');
    } catch (error) {
      console.error('Error creating course:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSyllabus = async () => {
    const title = watch('title');
    const level = watch('level');
    const duration = watch('duration');
    
    if (!title || !level || !duration) {
      alert('Please fill in the course title, level, and duration first.');
      return;
    }

    setIsGeneratingSyllabus(true);
    try {
      // Simulate AI syllabus generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const generatedObjectives = `By the end of this ${level.toLowerCase()} level course on ${title}, students will be able to:

• Understand the fundamental concepts and principles of ${title.toLowerCase()}
• Apply theoretical knowledge to practical, real-world scenarios
• Demonstrate proficiency in key skills and techniques
• Analyze and solve complex problems within the subject domain
• Collaborate effectively on team-based projects
• Present findings and solutions in a clear, professional manner

This ${duration} course is designed to provide comprehensive coverage of essential topics while encouraging critical thinking and hands-on learning experiences.`;
      
      setValue('learningObjectives', generatedObjectives);
    } catch (error) {
      console.error('Error generating syllabus:', error);
    } finally {
      setIsGeneratingSyllabus(false);
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
                <Select
                  label="Category"
                  options={categoriesOptions}
                  error={errors.category?.message}
                  {...register("category")}
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Select
                  label="Level"
                  options={levelOptions}
                  error={errors.level?.message}
                  {...register("level")}
                />
                  
              </div>
              <div>
                <Input
                  label="Duration"
                  placeholder="e.g., 12 weeks"
                  error={errors.duration?.message}
                  {...register("duration")}
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
          </CardContent>
        </Card>

        {/* Course Content */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Course Content</CardTitle>
                <CardDescription>
                  Define the learning objectives and prerequisites
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={generateSyllabus}
                disabled={isGeneratingSyllabus}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {isGeneratingSyllabus ? "Generating..." : "AI Generate"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Learning Objectives
              </label>
              <textarea
                className="w-full placeholder:text-gray-400 text-gray-700 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={8}
                placeholder="Describe what students will learn and be able to do after completing this course..."
                {...register("learningObjectives")}
              />
              {errors.learningObjectives && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.learningObjectives.message}
                </p>
              )}
            </div>

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
            </div>
          </CardContent>
        </Card>

        {/* Publication Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Publication Settings</CardTitle>
            <CardDescription>Choose how to publish your course</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <Select
                label="Status"
                options={statusOptions} 
                error={errors.status?.message}
                {...register("status")}
              />
                
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