"use client";
import Navbar from "@/components/MainNavbar";
import ProtectedRoute from "@/components/ProtectedRoute";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute userType="Student">
      <div className="mb-16">
        <Navbar />
      </div>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        {children}
      </div>
    </ProtectedRoute>
  );
}
