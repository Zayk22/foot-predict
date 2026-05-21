import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import AuthModal from '@/components/AuthModal';
import "./globals.css";

export const metadata: Metadata = {
  title: "FootPredict — Premium Football Analytics",
  description: "AI-powered football predictions, live scores, league standings, and team comparisons",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-surface-50 dark:bg-surface-950 text-surface-900 dark:text-surface-100 antialiased transition-colors duration-300">
        <ThemeProvider>
          <AuthProvider>
            <AuthModal />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}