import { useState, useEffect } from 'react';
import { Badge } from './ui/badge';
import { Button, ButtonProps } from '@/components/ui/button';
import { Trash2, Edit3, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export interface TodoCardProps {
  task: {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    createdAt: string;
  };
  onEdit: (task: any) => void;
  onDelete: (id: string | number) => void;
  onComplete: (id: string | number, completed: boolean) => void;
}

export const TodoCard: React.FC<TodoCardProps> = (
  {
    task,
    onEdit,
    onDelete,
    onComplete
  }
) => {
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
    }
  };

  const handleCompleteToggle = () => {
    onComplete(task.id, !task.completed);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group"
    >
      <div className="p-6">
        {/* Status Indicator */}
        <div className="absolute -top-3 left-4 bg-white flex items-center justify-center w-8 h-8 rounded-full shadow-lg">
          {task.completed ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-yellow-500" />
          )}
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">{task.title}</h3>
            {task.description && (
              <p className="text-gray-600 text-sm line-clamp-2">{task.description}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(task)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Edit3 className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-red-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          {/* Status Badge */}
          <div className="flex items-center space-x-2">
            {task.completed ? (
              <Badge variant="secondary">Completed</Badge>
            ) : (
              <Badge variant="outline">Pending</Badge>
            )}

            {/* Created Date */}
            <span className="text-xs text-gray-500">{new Date(task.createdAt).toLocaleDateString()}</span>
          </div>

          {/* Complete Toggle */}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCompleteToggle}
            className="text-sm px-3 py-1"
          >
            {task.completed ? (
              <span className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Mark Incomplete</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1">
                <XCircle className="h-4 w-4 text-yellow-500" />
                <span>Mark Complete</span>
              </span>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};