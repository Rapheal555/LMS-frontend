"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { usersApi } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  ArrowLeft,
  User,
  Mail,
  Lock,
  Shield,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";

const createUserSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    role: z.enum(["admin", "lecturer", "student"], {
      required_error: "Please select a role",
    }),
    status: z.enum(["active", "inactive"], {
      required_error: "Please select a status",
    }),
    department: z.string().optional(),
    studentId: z.string().optional(),
    employeeId: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type CreateUserForm = z.infer<typeof createUserSchema>;

export default function CreateUserPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      status: "active",
    },
  });

  const watchedRole = watch("role");
  const roleOptions = [
    { value: "", label: "Select a role" },
    { value: "admin", label: "Admin" },
    { value: "student", label: "Student" },
    { value: "lecturer", label: "Lecturer" },
  ];
  const statusOptions = [
    { value: "", label: "Select status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  const departmentOptions = [
    { value: "", label: "Select department" },
    { value: "computer-science", label: "Computer Science" },
    { value: "mathematics", label: "Mathematics" },
    { value: "physics", label: "Physics" },
    { value: "chemistry", label: "Chemistry" },
    { value: "biology", label: "Biology" },
    { value: "engineering", label: "Engineering" },
    { value: "business", label: "Business" },
    { value: "psychology", label: "Psychology" },
  ];

  useEffect(() => {
    if (selectedRole === "admin" || selectedRole === "lecturer") {
      departmentOptions.push({
        value: "administration",
        label: "Administration",
      });
    }
  }, [selectedRole]);

  // Redirect if user is not admin
  useEffect(() => {
    if (user?.role !== "admin") {
      router.push("/dashboard");
    }
  }, [user, router]);

  useEffect(() => {
    setSelectedRole(watchedRole || "");
  }, [watchedRole]);

  const onSubmit = async (data: CreateUserForm) => {
    setIsLoading(true);
    try {
      // Transform data to match backend DTO
      const [firstName, ...lastNameParts] = data.name.split(' ');
      const lastName = lastNameParts.join(' ') || firstName;
      
      const createUserData = {
        email: data.email,
        password: data.password,
        firstName,
        lastName,
        role: data.role,
      };

      // Create user via API
      const response = await usersApi.create(createUserData);
      console.log("User created successfully:", response.data);

      // Redirect to users page on success
      router.push("/users");
    } catch (error) {
      console.error("Error creating user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-5 w-5" />;
      case "lecturer":
        return <BookOpen className="h-5 w-5" />;
      case "student":
        return <GraduationCap className="h-5 w-5" />;
      default:
        return <User className="h-5 w-5" />;
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case "admin":
        return "Full system access and user management";
      case "lecturer":
        return "Can create and manage courses and assignments";
      case "student":
        return "Can enroll in courses and submit assignments";
      default:
        return "";
    }
  };

  if (user?.role !== "admin") {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/users">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New User</h1>
          <p className="text-gray-600 mt-1">Add a new user to the system</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Information
          </CardTitle>
          <CardDescription>
            Fill in the details to create a new user account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Full Name *
                </label>
                <Input
                  {...register("name")}
                  placeholder="Enter full name"
                  error={errors.name?.message}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email Address *
                </label>
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="Enter email address"
                  error={errors.email?.message}
                />
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Password *
                </label>
                <Input
                  {...register("password")}
                  type="password"
                  placeholder="Enter password"
                  error={errors.password?.message}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Confirm Password *
                </label>
                <Input
                  {...register("confirmPassword")}
                  type="password"
                  placeholder="Confirm password"
                  error={errors.confirmPassword?.message}
                />
              </div>
            </div>

            {/* Role and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Role *
                </label>
                <Select
                  options={roleOptions}
                  {...register("role")}
                  error={errors.role?.message}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Status *
                </label>
                <Select
                  options={statusOptions}
                  {...register("status")}
                  error={errors.status?.message}
                />
              </div>
            </div>

            {/* Role-specific fields */}
            {selectedRole && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {getRoleIcon(selectedRole)}
                    <h3 className="font-medium text-blue-900 capitalize">
                      {selectedRole} Role
                    </h3>
                  </div>
                  <p className="text-sm text-blue-700">
                    {getRoleDescription(selectedRole)}
                  </p>
                </div>

                {selectedRole === "student" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Student ID
                      </label>
                      <Input
                        {...register("studentId")}
                        placeholder="Enter student ID"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Department
                      </label>
                      <Select
                        options={departmentOptions}
                        {...register("department")}
                      />
                    </div>
                  </div>
                )}

                {(selectedRole === "lecturer" || selectedRole === "admin") && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Employee ID
                      </label>
                      <Input
                        {...register("employeeId")}
                        placeholder="Enter employee ID"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Department
                      </label>
                      <Select
                        options={departmentOptions.concat({
                          value: "administration",
                          label: "Administration",
                        })}
                        {...register("department")}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Link href="/users">
                <Button type="button" variant="outline" disabled={isLoading}>
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating User..." : "Create User"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Help Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">User Role Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Admin</h4>
                <p className="text-sm text-gray-600">
                  Full system access including user management, course
                  oversight, and system configuration.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <BookOpen className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Lecturer</h4>
                <p className="text-sm text-gray-600">
                  Can create and manage courses, assignments, and view student
                  progress.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <GraduationCap className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Student</h4>
                <p className="text-sm text-gray-600">
                  Can enroll in courses, submit assignments, and view their
                  academic progress.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
