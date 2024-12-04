'use client'

import { usePathname, redirect } from 'next/navigation';
import Head from 'next/head';
import { Inter } from "next/font/google";
import { role } from '@/lib/data';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  if (pathname === '/') {
    switch (role) {
      case 'admin':
        redirect('/admin');
      case 'parent':
        redirect('/parent');
      case 'student':
        redirect('/student');
      case 'teacher':
        redirect('/teacher');
      default:
        redirect('/login');
    }
  }

  return (
    <html lang="en">
      <Head>
        <title>School Manager</title>
        <meta name="description" content="Next.js School Management System" />
      </Head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
