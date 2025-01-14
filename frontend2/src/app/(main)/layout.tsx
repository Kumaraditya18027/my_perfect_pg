import Navbar from "@/components/MainNavbar";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
