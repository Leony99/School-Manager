'use client'

import { usePathname, redirect } from 'next/navigation';
import Head from 'next/head';
import { ClerkProvider } from '@clerk/nextjs';
import { role } from '@/lib/data';
import { Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <Head>
          <title>School Manager</title>
          <meta name="description" content="Next.js School Management System" />
        </Head>
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
