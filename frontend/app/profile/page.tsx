'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Header from '../../components/Header';
import { authApi } from '../../lib/api';
import { Button } from '../../components/ui/Button';

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const data = await authApi.getUser();
        setUserData(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch user data');
        console.error('Error fetching user data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white p-4">
        <Header />
        <div className="max-w-4xl mx-auto py-8">
          <div className="bg-white rounded-2xl shadow-elegant p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-700 text-lg">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user && !userData) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white p-4">
      <Header />

      <main className="max-w-4xl mx-auto py-8">
        <div className="bg-white rounded-2xl shadow-elegant overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 text-white">
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-indigo-100 mt-2">Manage your account information</p>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                    <p className="text-gray-800 font-medium">
                      {userData?.name || user?.name || 'Not provided'}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                    <p className="text-gray-800 font-medium break-all">
                      {userData?.email || user?.email}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Account ID</label>
                    <p className="text-gray-800 font-medium break-all">
                      {userData?.id || user?.id}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Member Since</label>
                    <p className="text-gray-800 font-medium">
                      {userData?.created_at
                        ? new Date(userData.created_at).toLocaleDateString()
                        : 'Unknown'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Security</h2>

                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-medium text-yellow-800">Password</h3>
                    <p className="text-yellow-700 text-sm mt-1">
                      Last changed: Recently
                    </p>
                    <Button
                      className="mt-3 bg-yellow-600 hover:bg-yellow-700 text-white"
                      onClick={() => alert('Password change functionality would go here')}
                    >
                      Change Password
                    </Button>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-medium text-blue-800">Logout</h3>
                    <p className="text-blue-700 text-sm mt-1">
                      Sign out of your current session
                    </p>
                    <Button
                      className="mt-3 bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={logout}
                    >
                      Log Out
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}