import { Button } from './ui/Button';
import { Plus } from 'lucide-react';

interface EmptyStateProps {
  onAddTaskClick?: () => void;
}

export const EmptyState = ({ onAddTaskClick }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-8 relative">
        <div className="w-24 h-24 mx-auto flex items-center justify-center bg-gradient-to-r from-primary-100 to-purple-100 rounded-full">
          <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-r from-primary-200 to-purple-200 rounded-full">
            <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-primary-300 to-purple-300 rounded-full">
              <Plus className="text-primary-700" size={32} />
            </div>
          </div>
        </div>
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-1 shadow-lg border border-gray-100">
          <div className="bg-gradient-to-r from-primary-600 to-purple-600 w-10 h-10 rounded-full flex items-center justify-center">
            <Plus className="text-white" size={20} />
          </div>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mb-3">No tasks yet</h3>
      <p className="text-gray-600 max-w-md mb-8 text-lg">
        Get started by adding your first task. Start your productive journey and stay organized.
      </p>
      <Button
        variant="primary"
        onClick={onAddTaskClick}
        className="px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out"
      >
        <Plus size={20} className="mr-2" />
        Add Your First Task
      </Button>
    </div>
  );
};