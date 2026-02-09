'use client';

import { useState, useEffect } from 'react';
import { DashboardSkeleton } from '../../components/SkeletonLoader';
import Header from '../../components/Header';
import ProtectedRoute from '../../components/ProtectedRoute';
import { Task } from '../../types';
import { FloatingAddButton } from '../../components/FloatingAddButton';
import { TaskCard } from '../../components/TaskCard';
import { EmptyState } from '../../components/EmptyState';
import { taskApi } from '../../lib/api';
import { useToast, Toast } from '../../hooks/useToast';
import { TaskFormModal } from '../../components/TaskFormModal';
import { ToastProvider } from '../../components/ToastProvider';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
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
    const fetchTasks = async () => {
      // Check if user is authenticated by verifying token exists
      const token = typeof window !== 'undefined' ? localStorage.getItem('better-auth-token') : null;
      if (!token) {
        showToast({
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
          message: errorMessage,
          type: 'error',
          duration: 5000
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleCreateTask = async (taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    // Check if user is authenticated by verifying token exists
    const token = typeof window !== 'undefined' ? localStorage.getItem('better-auth-token') : null;
    if (!token) {
      showToast({
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
        message: 'Task created successfully!',
        type: 'success',
        duration: 3000
      });
      setShowTaskModal(false);
    } catch (error: any) {
      console.error('Error creating task:', error);
      const errorMessage = error.message || 'Failed to create task';
      showToast({
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
      setTasks(prev => prev.map(t => t.id.toString() === editingTask.id.toString() ? response.task : t));
      showToast({
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
        message: errorMessage,
        type: 'error',
        duration: 5000
      });
    }
  };

  const handleDeleteTask = async (id: string | number) => {
    // Check if user is authenticated by verifying token exists
    const token = typeof window !== 'undefined' ? localStorage.getItem('better-auth-token') : null;
    if (!token) {
      showToast({
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
        setTasks(prev => prev.filter(task => task.id.toString() !== id.toString()));
        showToast({
          message: 'Task deleted successfully!',
          type: 'success',
          duration: 3000
        });
      } catch (error: any) {
        console.error('Error deleting task:', error);
        const errorMessage = error.message || 'Failed to delete task';
        showToast({
          message: errorMessage,
          type: 'error',
          duration: 5000
        });
      }
    }
  };

  const handleToggleComplete = async (id: string | number, completed: boolean) => {
    // Check if user is authenticated by verifying token exists
    const token = typeof window !== 'undefined' ? localStorage.getItem('better-auth-token') : null;
    if (!token) {
      showToast({
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
        task.id.toString() === id.toString() ? { ...task, completed, updatedAt: new Date().toISOString() } : task
      ));

      const response = await taskApi.toggleComplete(id.toString(), completed);
      // Update with server response to ensure consistency
      setTasks(prev => prev.map(task =>
        task.id.toString() === id.toString() ? response.task : task
      ));

      showToast({
        message: completed ? 'Task marked as complete!' : 'Task marked as incomplete!',
        type: 'success',
        duration: 3000
      });
    } catch (error: any) {
      // If API call fails, revert the optimistic update
      setTasks(prev => prev.map(task =>
        task.id.toString() === id.toString() ? { ...task, completed: !completed } : task
      ));

      console.error('Error updating task status:', error);
      const errorMessage = error.message || 'Failed to update task status';
      showToast({
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
      <ProtectedRoute>
        <DashboardSkeleton />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-gray-50 p-4">
        {/* Backdrop Blur */}
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />

        {/* Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto">
          {/* Background Card */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-purple-600 rounded-3xl blur-xl opacity-60" />

          {/* Dashboard Card */}
          <div className="relative bg-white/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-400 to-purple-400 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Todo Mastery</h1>
                    <p className="text-gray-600 text-lg">Manage your tasks efficiently</p>
                  </div>
                </div>
              </div>

              {/* User Profile */}
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-400 to-purple-400 rounded-full flex items-center justify-center text-white font-medium">
                  {/* User Initials or Avatar */}
                  <span className="text-sm">JD</span>
                </div>
                <div>
                  <p className="text-gray-900 font-medium">John Doe</p>
                  <p className="text-gray-600 text-sm">john.doe@email.com</p>
                </div>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Tasks</p>
                    <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-lg flex items-center justify-center text-white text-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">{
                      tasks.filter(task => task.completed).length
                    }</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-lg flex items-center justify-center text-white text-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">{
                      tasks.filter(task => !task.completed).length
                    }</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-pink-400 rounded-lg flex items-center justify-center text-white text-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
              <Button
                onClick={handleAddTask}
                className="bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                + Add Task
              </Button>
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
          </div>
        </div>

        <FloatingAddButton onClick={handleAddTask} />

        <TaskFormModal
          isOpen={showTaskModal}
          onClose={() => {
            setShowTaskModal(false);
            setEditingTask(null);
          }}
          onSave={(taskData) => {
            if (editingTask) {
              handleUpdateTask(taskData as Partial<Task>);
            } else {
              handleCreateTask(taskData as Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>);
            }
          }}
          task={editingTask}
        />
      </div>
    </ProtectedRoute>
  );
}