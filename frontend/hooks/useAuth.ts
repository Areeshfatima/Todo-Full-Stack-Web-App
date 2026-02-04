// frontend/hooks/useAuth.ts
// Authentication state management hook

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '../lib/better-auth-client';
import { authApi } from '../lib/api';

export const useAuth = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);

  // Function to refresh user data
  const refreshUser = async () => {
    try {
      // Use the API client instead of direct fetch
      const userData = await authApi.getUser();
      setUser(userData);
      setIsAuthenticated(true);
      setLoading(false);
    } catch (error) {
      console.error('Error refreshing user:', error);
      authClient.clearToken();
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check authentication status on mount
    const token = authClient.getToken();

    if (token) {
      refreshUser();
    } else {
      setLoading(false);
    }

    // Listen for auth-expired event to redirect to login
    const handleAuthExpired = () => {
      setIsAuthenticated(false);
      setUser(null);
      router.push('/login');
    };

    window.addEventListener('auth-expired', handleAuthExpired);

    return () => {
      window.removeEventListener('auth-expired', handleAuthExpired);
    };
  }, [router]);

  const login = async (token: string, userData: any) => {
    authClient.setToken(token);
    setIsAuthenticated(true);
    setUser(userData);
    setLoading(false);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      authClient.clearToken();
      setIsAuthenticated(false);
      setUser(null);
      router.push('/login');
    }
  };

  const signup = async (token: string, userData: any) => {
    authClient.setToken(token);
    setIsAuthenticated(true);
    setUser(userData);
    setLoading(false);
  };

  return {
    isAuthenticated,
    loading,
    user,
    login,
    logout,
    signup,
  };
};