'use client';

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import NotificationCenter from '../../components/NotificationCenter';
import { Send, Bell, Users, BookOpen, GraduationCap } from 'lucide-react';
import { Select } from '@/components/ui/Select';

const NotificationsDemoPage = () => {
  const { user, token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedRole, setSelectedRole] = useState<'admin' | 'lecturer' | 'student' | ''>('');

  const roleOptions = [
    { value: '', label: 'All Users' },
    { value: 'admin', label: 'Admins Only' },
    { value: 'lecturer', label: 'Lecturers Only' },
    { value: 'student', label: 'Students Only' },
  ];

  const sendTestNotification = async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/test`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('Test notification sent successfully!');
      } else {
        alert('Failed to send test notification');
      }
    } catch (error) {
      console.error('Error sending test notification:', error);
      alert('Error sending test notification');
    } finally {
      setIsLoading(false);
    }
  };

  const sendSystemMessage = async () => {
    if (!token || !message.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/system`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.trim(),
          targetRole: selectedRole || undefined,
        }),
      });

      if (response.ok) {
        alert('System message sent successfully!');
        setMessage('');
        setSelectedRole('');
      } else {
        alert('Failed to send system message');
      }
    } catch (error) {
      console.error('Error sending system message:', error);
      alert('Error sending system message');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h1>
          <p className="text-gray-600">Please log in to access the notifications demo.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Notification Center */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Bell className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">
                Real-time Notifications Demo
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user.firstName} {user.lastName} ({user.role})
              </span>
              <NotificationCenter />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Demo Controls */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Send className="w-5 h-5 mr-2 text-blue-600" />
              Notification Controls
            </h2>

            {/* Test Notification */}
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-800 mb-3">
                Test Notification
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Send a test notification to yourself to verify the system is
                working.
              </p>
              <button
                onClick={sendTestNotification}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Bell className="w-4 h-4 mr-2" />
                )}
                Send Test Notification
              </button>
            </div>

            {/* System Message (Admin only) */}
            {user.role === "admin" && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-md font-medium text-gray-800 mb-3">
                  System Message
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Send a system-wide message or target specific user roles.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Role (optional)
                    </label>
                    <Select
                      value={selectedRole}
                      options={roleOptions}
                      onChange={(e) =>
                        setSelectedRole(
                          e.target.value as
                            | "admin"
                            | "lecturer"
                            | "student"
                            | ""
                        )
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Enter your system message..."
                      rows={3}
                      className="w-full placeholder:text-gray-400 text-gray-700 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <button
                    onClick={sendSystemMessage}
                    disabled={isLoading || !message.trim()}
                    className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    Send System Message
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Information Panel */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-green-600" />
              Notification Types
            </h2>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">📝</span>
                <div>
                  <h3 className="font-medium text-gray-800">
                    Assignment Notifications
                  </h3>
                  <p className="text-sm text-gray-600">
                    Triggered when new assignments are posted or updated.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="text-2xl">📤</span>
                <div>
                  <h3 className="font-medium text-gray-800">
                    Submission Notifications
                  </h3>
                  <p className="text-sm text-gray-600">
                    Sent to lecturers when students submit assignments.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="text-2xl">📊</span>
                <div>
                  <h3 className="font-medium text-gray-800">
                    Grade Notifications
                  </h3>
                  <p className="text-sm text-gray-600">
                    Notify students when their assignments are graded.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="text-2xl">🎓</span>
                <div>
                  <h3 className="font-medium text-gray-800">
                    Enrollment Updates
                  </h3>
                  <p className="text-sm text-gray-600">
                    Course enrollment status changes and updates.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="text-2xl">📚</span>
                <div>
                  <h3 className="font-medium text-gray-800">
                    Course Notifications
                  </h3>
                  <p className="text-sm text-gray-600">
                    General course-related announcements and updates.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="text-2xl">🔔</span>
                <div>
                  <h3 className="font-medium text-gray-800">System Messages</h3>
                  <p className="text-sm text-gray-600">
                    Important system announcements and maintenance notices.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">
                Real-time Features
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• WebSocket connection for instant notifications</li>
                <li>• Browser notifications (if permission granted)</li>
                <li>• Real-time unread count updates</li>
                <li>• Connection status indicator</li>
                <li>• Role-based notification targeting</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            How to Test
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">For All Users:</h3>
              <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                <li>
                  Click &ldquo;Send Test Notification&ldquo; to receive a test
                  message
                </li>
                <li>Check the notification bell icon for unread count</li>
                <li>Click the bell to open the notification center</li>
                <li>Click on unread notifications to mark them as read</li>
              </ol>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-2">For Admins:</h3>
              <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                <li>Use the system message form to send notifications</li>
                <li>Target specific roles or send to all users</li>
                <li>Test real-time delivery across multiple browser tabs</li>
                <li>Monitor connection status indicator</li>
              </ol>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotificationsDemoPage;