import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { SocketProvider } from "@/providers/SocketProvider";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Instant Mechanic — Operations Dashboard",
  description:
    "Live vehicle service operations dashboard for monitoring bookings, mechanics, customers, and revenue.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased`}>
        <QueryProvider>
          <SocketProvider>
            <TooltipProvider>
              <DashboardLayout>{children}</DashboardLayout>
            </TooltipProvider>
          </SocketProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
