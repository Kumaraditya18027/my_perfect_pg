// import { useState } from "react"
import Sidebar from "@/components/Sidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Sidebar />
      <main className="pl-40 pr-10 py-20">{children}</main>
    </>
  );
}
