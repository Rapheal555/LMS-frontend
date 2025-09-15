"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Bell,
  Eye,
  Lock,
  Palette,
  Globe,
  Save,
  Camera,
  AlertTriangle,
  Check,
  X,
} from "lucide-react";
import { getInitials } from "@/lib/utils";

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  bio?: string;
  avatar?: string;
  role: "admin" | "lecturer" | "student";
  studentId?: string;
  employeeId?: string;
  department?: string;
  joinedAt: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  assignmentReminders: boolean;
  gradeNotifications: boolean;
  courseUpdates: boolean;
  systemAnnouncements: boolean;
}

interface PrivacySettings {
  profileVisibility: "public" | "private" | "contacts";
  showEmail: boolean;
  showPhone: boolean;
  allowMessages: boolean;
}

interface AppearanceSettings {
  theme: "light" | "dark" | "system";
  language: "en" | "es" | "fr" | "de";
  timezone: string;
  dateFormat: "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD";
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "profile" | "notifications" | "privacy" | "appearance" | "security"
  >("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Mock user profile data
  const [profile, setProfile] = useState<UserProfile>({
    id: user?.id || "1",
    firstName: user?.firstName || "John",
    lastName: user?.lastName || "Doe",
    email: user?.email || "john.doe@university.edu",
    phone: "+1 (555) 123-4567",
    address: "123 University Ave, College Town, ST 12345",
    dateOfBirth: "1995-06-15",
    bio: "Computer Science student passionate about software development and artificial intelligence.",
    role: user?.role || "student",
    studentId: user?.role === "student" ? "STU2024001" : undefined,
    employeeId: user?.role === "lecturer" ? "EMP2024001" : undefined,
    department: user?.role === "lecturer" ? "Computer Science" : undefined,
    joinedAt: "2024-01-15T00:00:00Z",
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    assignmentReminders: true,
    gradeNotifications: true,
    courseUpdates: true,
    systemAnnouncements: false,
  });

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: "contacts",
    showEmail: false,
    showPhone: false,
    allowMessages: true,
  });

  const [appearance, setAppearance] = useState<AppearanceSettings>({
    theme: "system",
    language: "en",
    timezone: "America/New_York",
    dateFormat: "MM/DD/YYYY",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccessMessage("Notification preferences updated!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error updating notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePrivacy = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccessMessage("Privacy settings updated!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error updating privacy settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAppearance = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccessMessage("Appearance settings updated!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error updating appearance:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordModal(false);
      setSuccessMessage("Password changed successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error changing password:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // In a real app, this would log out the user and redirect
      alert(
        "Account deletion initiated. You will be contacted for confirmation."
      );
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting account:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "lecturer":
        return "warning";
      case "student":
        return "secondary";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
          <Check className="h-5 w-5 text-green-600" />
          <span className="text-green-800">{successMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("profile")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "profile"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <User className="h-4 w-4 inline mr-2" />
            Profile
          </button>

          <button
            onClick={() => setActiveTab("notifications")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "notifications"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Bell className="h-4 w-4 inline mr-2" />
            Notifications
          </button>

          <button
            onClick={() => setActiveTab("privacy")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "privacy"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Eye className="h-4 w-4 inline mr-2" />
            Privacy
          </button>

          <button
            onClick={() => setActiveTab("appearance")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "appearance"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Palette className="h-4 w-4 inline mr-2" />
            Appearance
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "security"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Lock className="h-4 w-4 inline mr-2" />
            Security
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details and profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <Input
                      value={profile.firstName}
                      onChange={(e) =>
                        setProfile({ ...profile, firstName: e.target.value })
                      }
                      placeholder="Enter first name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <Input
                      value={profile.lastName}
                      onChange={(e) =>
                        setProfile({ ...profile, lastName: e.target.value })
                      }
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    value={profile.phone || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <Input
                    value={profile.address || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, address: e.target.value })
                    }
                    placeholder="Enter address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <Input
                    type="date"
                    value={profile.dateOfBirth || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, dateOfBirth: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    className="w-full placeholder:text-gray-400 text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    value={profile.bio || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, bio: e.target.value })
                    }
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {/* Role-specific fields */}
                {profile.role === "student" && profile.studentId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Student ID
                    </label>
                    <Input
                      value={profile.studentId}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                )}

                {profile.role === "lecturer" && (
                  <>
                    {profile.employeeId && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Employee ID
                        </label>
                        <Input
                          value={profile.employeeId}
                          disabled
                          className="bg-gray-50"
                        />
                      </div>
                    )}

                    {profile.department && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Department
                        </label>
                        <Input
                          value={profile.department}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              department: e.target.value,
                            })
                          }
                          placeholder="Enter department"
                        />
                      </div>
                    )}
                  </>
                )}

                <div className="flex justify-end pt-4">
                  <Button onClick={handleSaveProfile} disabled={isLoading}>
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Profile Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Avatar */}
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-xl font-bold text-blue-600">
                        {getInitials(
                          `${profile.firstName} ${profile.lastName}`
                        )}
                      </span>
                    </div>
                    <button className="absolute bottom-0 right-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700">
                      <Camera className="h-3 w-3" />
                    </button>
                  </div>
                  <h3 className="font-medium text-gray-900 mt-2">
                    {profile.firstName} {profile.lastName}
                  </h3>
                  <Badge
                    variant={getRoleColor(profile.role) as any}
                    className="mt-1 capitalize"
                  >
                    {profile.role}
                  </Badge>
                </div>

                {/* Quick Info */}
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{profile.email}</span>
                  </div>

                  {profile.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{profile.phone}</span>
                    </div>
                  )}

                  {profile.address && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{profile.address}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">
                      Joined {formatDate(profile.joinedAt)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "notifications" && (
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>
              Choose how you want to be notified about important updates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4 text-gray-400">
              <div className="flex items-center  justify-between">
                <div>
                  <h4 className="font-medium ">Email Notifications</h4>
                  <p className="text-sm text-gray-600">
                    Receive notifications via email
                  </p>
                </div>
                <button
                  onClick={() =>
                    setNotifications({
                      ...notifications,
                      emailNotifications: !notifications.emailNotifications,
                    })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.emailNotifications
                      ? "bg-blue-600"
                      : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.emailNotifications
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Push Notifications</h4>
                  <p className="text-sm text-gray-600">
                    Receive push notifications in your browser
                  </p>
                </div>
                <button
                  onClick={() =>
                    setNotifications({
                      ...notifications,
                      pushNotifications: !notifications.pushNotifications,
                    })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.pushNotifications
                      ? "bg-blue-600"
                      : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.pushNotifications
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Assignment Reminders</h4>
                  <p className="text-sm text-gray-600">
                    Get reminded about upcoming assignment deadlines
                  </p>
                </div>
                <button
                  onClick={() =>
                    setNotifications({
                      ...notifications,
                      assignmentReminders: !notifications.assignmentReminders,
                    })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.assignmentReminders
                      ? "bg-blue-600"
                      : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.assignmentReminders
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Grade Notifications</h4>
                  <p className="text-sm text-gray-600">
                    Be notified when grades are posted
                  </p>
                </div>
                <button
                  onClick={() =>
                    setNotifications({
                      ...notifications,
                      gradeNotifications: !notifications.gradeNotifications,
                    })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.gradeNotifications
                      ? "bg-blue-600"
                      : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.gradeNotifications
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Course Updates</h4>
                  <p className="text-sm text-gray-600">
                    Receive updates about course changes and announcements
                  </p>
                </div>
                <button
                  onClick={() =>
                    setNotifications({
                      ...notifications,
                      courseUpdates: !notifications.courseUpdates,
                    })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.courseUpdates ? "bg-blue-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.courseUpdates
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">System Announcements</h4>
                  <p className="text-sm text-gray-600">
                    Receive important system-wide announcements
                  </p>
                </div>
                <button
                  onClick={() =>
                    setNotifications({
                      ...notifications,
                      systemAnnouncements: !notifications.systemAnnouncements,
                    })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.systemAnnouncements
                      ? "bg-blue-600"
                      : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.systemAnnouncements
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button onClick={handleSaveNotifications} disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Saving..." : "Save Preferences"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "privacy" && (
        <Card>
          <CardHeader>
            <CardTitle>Privacy Settings</CardTitle>
            <CardDescription>
              Control who can see your information and how you can be contacted
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Visibility
              </label>
              <Select
                value={privacy.profileVisibility}
                onValueChange={(
                  value: any
                  //  "public" | "private" | "contacts"
                ) => setPrivacy({ ...privacy, profileVisibility: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">
                    Public - Anyone can see your profile
                  </SelectItem>
                  <SelectItem value="contacts">
                    Contacts Only - Only people in your courses
                  </SelectItem>
                  <SelectItem value="private">
                    Private - Only you can see your profile
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4 text-gray-400">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Show Email Address</h4>
                  <p className="text-sm text-gray-600">
                    Allow others to see your email address
                  </p>
                </div>
                <button
                  onClick={() =>
                    setPrivacy({ ...privacy, showEmail: !privacy.showEmail })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    privacy.showEmail ? "bg-blue-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      privacy.showEmail ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Show Phone Number</h4>
                  <p className="text-sm text-gray-600">
                    Allow others to see your phone number
                  </p>
                </div>
                <button
                  onClick={() =>
                    setPrivacy({ ...privacy, showPhone: !privacy.showPhone })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    privacy.showPhone ? "bg-blue-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      privacy.showPhone ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Allow Messages</h4>
                  <p className="text-sm text-gray-600">
                    Allow other users to send you messages
                  </p>
                </div>
                <button
                  onClick={() =>
                    setPrivacy({
                      ...privacy,
                      allowMessages: !privacy.allowMessages,
                    })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    privacy.allowMessages ? "bg-blue-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      privacy.allowMessages ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button onClick={handleSavePrivacy} disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "appearance" && (
        <Card>
          <CardHeader>
            <CardTitle>Appearance & Language</CardTitle>
            <CardDescription>
              Customize how the application looks and behaves
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Theme
                </label>
                <Select
                  value={appearance.theme}
                  onValueChange={(
                    value: any
                    // "light" | "dark" | "system"
                  ) => setAppearance({ ...appearance, theme: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <Select
                  value={appearance.language}
                  onValueChange={(
                    value: any
                    //  "en" | "es" | "fr" | "de"
                  ) => setAppearance({ ...appearance, language: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timezone
                </label>
                <Select
                  value={appearance.timezone}
                  onValueChange={(value: string) =>
                    setAppearance({ ...appearance, timezone: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">
                      Eastern Time (ET)
                    </SelectItem>
                    <SelectItem value="America/Chicago">
                      Central Time (CT)
                    </SelectItem>
                    <SelectItem value="America/Denver">
                      Mountain Time (MT)
                    </SelectItem>
                    <SelectItem value="America/Los_Angeles">
                      Pacific Time (PT)
                    </SelectItem>
                    <SelectItem value="Europe/London">London (GMT)</SelectItem>
                    <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                    <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Format
                </label>
                <Select
                  value={appearance.dateFormat}
                  onValueChange={(
                    value: any
                    //  "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD"
                  ) => setAppearance({ ...appearance, dateFormat: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (US)</SelectItem>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (EU)</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (ISO)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button onClick={handleSaveAppearance} disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "security" && (
        <div className="space-y-6">
          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Password & Security
              </CardTitle>
              <CardDescription>
                Manage your password and account security settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-400">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Password</h4>
                    <p className="text-sm text-gray-600">
                      Last changed 30 days ago
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowPasswordModal(true)}
                  >
                    Change Password
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Button variant="outline">Enable 2FA</Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Login Sessions</h4>
                    <p className="text-sm text-gray-600">
                      Manage your active login sessions
                    </p>
                  </div>
                  <Button variant="outline">View Sessions</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                  <div>
                    <h4 className="font-medium text-red-900">Delete Account</h4>
                    <p className="text-sm text-red-700">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Change Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Change Password"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <Input
              type="password"
              value={passwords.currentPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, currentPassword: e.target.value })
              }
              placeholder="Enter current password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <Input
              type="password"
              value={passwords.newPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, newPassword: e.target.value })
              }
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <Input
              type="password"
              value={passwords.confirmPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, confirmPassword: e.target.value })
              }
              placeholder="Confirm new password"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowPasswordModal(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleChangePassword}
              disabled={
                isLoading ||
                !passwords.currentPassword ||
                !passwords.newPassword ||
                !passwords.confirmPassword
              }
            >
              {isLoading ? "Changing..." : "Change Password"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-red-900">
                This action cannot be undone
              </h4>
              <p className="text-sm text-red-700 mt-1">
                Deleting your account will permanently remove all your data,
                including courses, assignments, and grades.
              </p>
            </div>
          </div>

          <p className="text-gray-600">
            Are you absolutely sure you want to delete your account? This will:
          </p>

          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li>Permanently delete your profile and personal information</li>
            <li>Remove you from all enrolled courses</li>
            <li>Delete all your assignments and submissions</li>
            <li>Remove all grades and academic records</li>
            <li>Cancel any active subscriptions or services</li>
          </ul>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete My Account"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
