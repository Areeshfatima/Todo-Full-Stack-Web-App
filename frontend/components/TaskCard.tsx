import { Task } from '../types';
import { Button } from './ui/Button';
import { Trash2, Edit3 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (id: number | string) => void;
  onComplete?: (id: number | string, completed: boolean) => void;
}

export const TaskCard = ({ task, onEdit, onDelete, onComplete }: TaskCardProps) => {
  const handleCompleteChange = () => {
    if (onComplete) {
      onComplete(task.id.toString(), !task.completed);
    }
  };

  return (
    <div
      role="article"
      aria-label={`Task: ${task.title}`}
      className={`bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden transition-all duration-300 ease-in-out p-4 mb-3 hover:shadow-card-hover transition-shadow duration-300 cursor-pointer border-l-4 border-primary-500 ${task.completed ? 'opacity-70' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleCompleteChange}
            className="mt-1 h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            aria-label={`Mark task "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
          />
          <div className="flex-1 min-w-0">
            <h3
              className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}
              id={`task-title-${task.id}`}
            >
              {task.title}
            </h3>
            {task.description && (
              <p
                className={`mt-1 text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-500'}`}
                id={`task-description-${task.id}`}
              >
                {task.description}
              </p>
            )}
            <p className="mt-2 text-xs text-gray-400" id={`task-created-${task.id}`}>
              Created: {new Date(task.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit && onEdit(task)}
            aria-label="Edit task"
            className="p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded"
          >
            <Edit3 size={16} aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete && onDelete(task.id.toString())}
            aria-label="Delete task"
            className="p-2 text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
          >
            <Trash2 size={16} aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
};