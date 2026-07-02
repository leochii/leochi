"use client";

import { Toast } from "../components/Toast";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-black text-white">
      <Toast />
      {children}
    </main>
  );
}