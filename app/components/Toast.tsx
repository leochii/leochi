"use client";

import { useEffect, useState } from "react";

type ToastType = "success" | "error" | "info";

interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

let toastId = 0;
const listeners: Set<(toast: ToastMessage) => void> = new Set();

export function showToast(message: string, type: ToastType = "info") {
  const id = `toast-${toastId++}`;
  const toast: ToastMessage = { id, type, message };
  listeners.forEach((listener) => listener(toast));
}

export function Toast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleToast = (toast: ToastMessage) => {
      setToasts((prev) => [...prev, toast]);

      const timer = setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 4000);

      return () => clearTimeout(timer);
    };

    listeners.add(handleToast);
    return () => {
      listeners.delete(handleToast);
    };
  }, []);

  const getStyles = (type: ToastType) => {
    switch (type) {
      case "success":
        return "bg-green-600 text-white";
      case "error":
        return "bg-red-600 text-white";
      case "info":
        return "bg-blue-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const getIcon = (type: ToastType) => {
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      case "info":
        return "ℹ";
      default:
        return "•";
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${getStyles(toast.type)} px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-top fade-in duration-300`}
        >
          <span className="text-lg font-bold">{getIcon(toast.type)}</span>
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
      ))}
    </div>
  );
}
