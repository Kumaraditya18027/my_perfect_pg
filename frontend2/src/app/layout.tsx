// layout.tsx or app/layout.tsx (if using Next.js 13+)

import { AuthProvider } from "./(auth)/AuthContext";  // adjust relative path

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children} {/* Wrap the entire children with AuthProvider */}
        </AuthProvider>
      </body>
    </html>
  );
}
