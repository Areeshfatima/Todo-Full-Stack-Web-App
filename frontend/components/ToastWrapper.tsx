'use client';

import { useToast } from '../hooks/useToast';
import { ToastProvider } from './ToastProvider';
import { ReactNode, useEffect } from 'react';

interface ToastWrapperProps {
  children: ReactNode;
}

export default function ToastWrapper({ children }: ToastWrapperProps) {
  const { toasts, removeToast } = useToast();

  return (
    <>
      {children}
      <ToastProvider toasts={toasts} onRemove={removeToast} />
    </>
  );
}