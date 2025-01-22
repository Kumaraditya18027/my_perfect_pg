"use client";
import Navbar from "@/components/MainNavbar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Loading from "@/components/Loading";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  //check authentication state and redirect to page accordingly
  useEffect(() => {
    console.log("Is authenticated", isAuthenticated);
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return <Loading />; // Show nothing while redirecting
  }

  return (
    <>
      <div className="mb-16">
        <Navbar />
      </div>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        {children}
      </div>
    </>
  );
}
