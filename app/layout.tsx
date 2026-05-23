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
      <body className="bg-white dark:bg-black text-gray-900 dark:text-gray-100 antialiased transition-colors duration-300">
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