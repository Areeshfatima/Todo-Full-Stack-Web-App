'use client';

import { useRouter } from 'next/navigation';
import { Button } from './ui/Button';
import { useAuth } from '../hooks/useAuth';

export default function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">Todo Mastery</h1>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/profile')}
                  className="hidden md:flex items-center space-x-2 hover:bg-gray-50 rounded-full p-2 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                    {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-700 font-medium">Hi, {user.name || user.email.split('@')[0]}</span>
                </button>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => router.push('/profile')}
                    className="text-sm font-medium"
                  >
                    Profile
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="text-sm font-medium"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}