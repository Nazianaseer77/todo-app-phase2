import "./globals.css";
import React from 'react';
import type { Metadata } from 'next';
import ClientWrapper from './components/ClientWrapper';

export const metadata: Metadata = {
  title: 'Todo App',
  description: 'Manage your tasks efficiently',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="">
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}