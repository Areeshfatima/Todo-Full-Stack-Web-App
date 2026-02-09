'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FloatingAddButtonProps {
  onClick?: () => void;
}

export const FloatingAddButton = ({ onClick }: FloatingAddButtonProps) => {
  return (
    <div className="fixed bottom-6 right-6 z-10">
      <Button
        variant="default"
        size="lg"
        onClick={onClick}
        className="rounded-full w-16 h-16 flex items-center justify-center shadow-xl hover:shadow-2xl transform hover:scale-110 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        aria-label="Add new task"
      >
        <Plus className="w-6 h-6" />
      </Button>
    </div>
  );
};