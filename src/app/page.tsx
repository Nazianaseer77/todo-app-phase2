'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/auth';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect authenticated users to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-gray-300 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome to Todo App
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isAuthenticated
            ? `Hi ${user?.name || user?.email}! You are logged in.`
            : 'Sign in to manage your todos'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-4">
            {!isAuthenticated ? (
              <>
                <div>
                  <Link href="/login">
                    <div className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
                      Sign in
                    </div>
                  </Link>
                </div>
                <div>
                  <Link href="/register">
                    <div className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-purple-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
                      Create account
                    </div>
                  </Link>
                </div>
              </>
            ) : (
              <div>
                <Link href="/dashboard">
                  <div className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 cursor-pointer">
                    Go to Dashboard
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;