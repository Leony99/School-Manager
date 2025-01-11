'use client'

import Head from 'next/head';
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import { ToastContainer } from "react-toastify";

import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

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
        <body className={`${inter.className} overflow-x-hidden`}>
          {children}
          <ToastContainer position="bottom-right" theme="dark" />
        </body>
      </html>
    </ClerkProvider>
  );
}
