'use client';

import React from 'react';
import { AuthProvider } from '@/contexts/auth';
import { ThemeProvider } from '@/contexts/theme';

interface ClientWrapperProps {
  children: React.ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}