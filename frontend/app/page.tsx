'use client';

import { useState, useEffect } from 'react';
import { DashboardSkeleton } from '../components/SkeletonLoader';
import Header from '../components/Header';
import { Task } from '../types';
import { FloatingAddButton } from '../components/FloatingAddButton';
import { TaskCard } from '../components/TaskCard';
import { EmptyState } from '../components/EmptyState';
import { taskApi } from '../lib/api';
import { useToast, Toast } from '../hooks/useToast';
import { TaskFormModal } from '../components/TaskFormModal';
import { useAuth } from '../hooks/useAuth';
import { ToastProvider } from '../components/ToastProvider';

export default function DashboardPage() {
  const { loading: authLoading, isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const toastHook = useToast();
  const { toasts, removeToast } = toastHook;
  const showToast = (toast: Omit<Toast, 'id'>) => {
    if (toastHook.addToast && typeof toastHook.addToast === 'function') {
      toastHook.addToast(toast);
    }
  };

  // Fetch tasks from API
  useEffect(() => {
    if (isAuthenticated) {
      const fetchTasks = async () => {
        // Check if user is authenticated by verifying token exists
        const token = typeof window !== 'undefined' ? localStorage.getItem('better-auth-token') : null;
        if (!token) {
          showToast({
            id: Date.now().toString(),
            message: 'Authentication required. Please log in first.',
            type: 'error',
            duration: 5000
          });
          // Redirect to login page
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          setLoading(false);
          return;
        }

        try {
          const response = await taskApi.getAll();
          setTasks(response.tasks || []);
        } catch (error: any) {
          console.error('Error loading tasks:', error);
          const errorMessage = error.message || 'Failed to load tasks';
          showToast({
            id: Date.now().toString(),
            message: errorMessage,
            type: 'error',
            duration: 5000
          });
        } finally {
          setLoading(false);
        }
      };

      fetchTasks();
    }
  }, [isAuthenticated]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-700 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return null;
  }

  const handleCreateTask = async (taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    // Check if user is authenticated by verifying token exists
    const token = typeof window !== 'undefined' ? localStorage.getItem('better-auth-token') : null;
    if (!token) {
      showToast({
        id: Date.now().toString(),
        message: 'Authentication required. Please log in first.',
        type: 'error',
        duration: 5000
      });
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return;
    }

    try {
      const response = await taskApi.create(taskData);
      setTasks(prev => [...prev, response.task]);
      showToast({
        id: Date.now().toString(),
        message: 'Task created successfully!',
        type: 'success',
        duration: 3000
      });
      setShowTaskModal(false);
    } catch (error: any) {
      console.error('Error creating task:', error);
      const errorMessage = error.message || 'Failed to create task';
      showToast({
        id: Date.now().toString(),
        message: errorMessage,
        type: 'error',
        duration: 5000
      });
    }
  };

  const handleUpdateTask = async (taskData: Partial<Task>) => {
    // Check if user is authenticated by verifying token exists
    const token = typeof window !== 'undefined' ? localStorage.getItem('better-auth-token') : null;
    if (!token) {
      showToast({
        id: Date.now().toString(),
        message: 'Authentication required. Please log in first.',
        type: 'error',
        duration: 5000
      });
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return;
    }

    if (!editingTask) return;

    try {
      const response = await taskApi.update(editingTask.id.toString(), taskData);
      setTasks(prev => prev.map(t => t.id === editingTask.id ? response.task : t));
      showToast({
        id: Date.now().toString(),
        message: 'Task updated successfully!',
        type: 'success',
        duration: 3000
      });
      setShowTaskModal(false);
      setEditingTask(null);
    } catch (error: any) {
      console.error('Error updating task:', error);
      const errorMessage = error.message || 'Failed to update task';
      showToast({
        id: Date.now().toString(),
        message: errorMessage,
        type: 'error',
        duration: 5000
      });
    }
  };

  const handleDeleteTask = async (id: number | string) => {
    // Check if user is authenticated by verifying token exists
    const token = typeof window !== 'undefined' ? localStorage.getItem('better-auth-token') : null;
    if (!token) {
      showToast({
        id: Date.now().toString(),
        message: 'Authentication required. Please log in first.',
        type: 'error',
        duration: 5000
      });
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return;
    }

    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskApi.delete(id.toString());
        setTasks(prev => prev.filter(task => task.id !== id));
        showToast({
          id: Date.now().toString(),
          message: 'Task deleted successfully!',
          type: 'success',
          duration: 3000
        });
      } catch (error: any) {
        console.error('Error deleting task:', error);
        const errorMessage = error.message || 'Failed to delete task';
        showToast({
          id: Date.now().toString(),
          message: errorMessage,
          type: 'error',
          duration: 5000
        });
      }
    }
  };

  const handleToggleComplete = async (id: number | string, completed: boolean) => {
    // Check if user is authenticated by verifying token exists
    const token = typeof window !== 'undefined' ? localStorage.getItem('better-auth-token') : null;
    if (!token) {
      showToast({
        id: Date.now().toString(),
        message: 'Authentication required. Please log in first.',
        type: 'error',
        duration: 5000
      });
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return;
    }

    try {
      // Optimistic update
      setTasks(prev => prev.map(task =>
        task.id === id ? { ...task, completed, updatedAt: new Date().toISOString() } : task
      ));

      const response = await taskApi.toggleComplete(id.toString(), completed);
      // Update with server response to ensure consistency
      setTasks(prev => prev.map(task =>
        task.id === id ? response.task : task
      ));

      showToast({
        id: Date.now().toString(),
        message: completed ? 'Task marked as complete!' : 'Task marked as incomplete!',
        type: 'success',
        duration: 3000
      });
    } catch (error: any) {
      // If API call fails, revert the optimistic update
      setTasks(prev => prev.map(task =>
        task.id === id ? { ...task, completed: !completed } : task
      ));

      console.error('Error updating task status:', error);
      const errorMessage = error.message || 'Failed to update task status';
      showToast({
        id: Date.now().toString(),
        message: errorMessage,
        type: 'error',
        duration: 5000
      });
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setShowTaskModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white p-4">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <DashboardSkeleton />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white p-4">
      <Header />
      <ToastProvider toasts={toasts} onRemove={removeToast} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Hero Section */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 mb-8 text-white shadow-xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome Back!</h1>
          <p className="text-indigo-100 text-lg">Manage your tasks efficiently and stay productive.</p>
        </div>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
        </div>

        {tasks.length === 0 ? (
          <EmptyState onAddTaskClick={handleAddTask} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onComplete={handleToggleComplete}
              />
            ))}
          </div>
        )}
      </main>

      <FloatingAddButton onClick={handleAddTask} />

      <TaskFormModal
        isOpen={showTaskModal}
        onClose={() => {
          setShowTaskModal(false);
          setEditingTask(null);
        }}
        onSave={editingTask ? handleUpdateTask : handleCreateTask}
        task={editingTask}
      />
    </div>
  );
}