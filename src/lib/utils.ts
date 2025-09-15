import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function getInitials(name: string) {
  return name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getGradeColor(grade: number) {
  if (grade >= 90) return "text-green-600";
  if (grade >= 80) return "text-blue-600";
  if (grade >= 70) return "text-yellow-600";
  if (grade >= 60) return "text-orange-600";
  return "text-red-600";
}

export function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "active":
    case "approved":
    case "completed":
      return "text-green-600 bg-green-100";
    case "pending":
    case "in_progress":
      return "text-yellow-600 bg-yellow-100";
    case "inactive":
    case "rejected":
    case "cancelled":
      return "text-red-600 bg-red-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
}