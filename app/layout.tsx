import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import AuthModal from '@/components/AuthModal';
import "./globals.css";

export const metadata: Metadata = {
  title: "Football Prediction Dashboard",
  description: "Premium AI-powered football predictions and live stats",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-surface-50 dark:bg-surface-950 text-surface-900 dark:text-surface-100 antialiased">
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