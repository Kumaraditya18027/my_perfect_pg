// import { useState } from "react"
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute userType="Admin">
      <Sidebar type="admin" />
      <main className="pl-40 pr-10 py-20">{children}</main>
    </ProtectedRoute>
  );
}
