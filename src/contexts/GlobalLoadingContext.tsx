
import React, { createContext, useContext, useState } from 'react';
import { GlobalLoadingModal } from '@/components/GlobalLoadingModal';

interface GlobalLoadingContextType {
  isLoading: boolean;
  title: string;
  description?: string;
  progress: number;
  showLoading: (title: string, description?: string, progress?: number) => void;
  hideLoading: () => void;
  updateProgress: (progress: number) => void;
}

const GlobalLoadingContext = createContext<GlobalLoadingContextType | undefined>(undefined);

export const useGlobalLoading = () => {
  const context = useContext(GlobalLoadingContext);
  if (!context) {
    throw new Error('useGlobalLoading must be used within a GlobalLoadingProvider');
  }
  return context;
};

export const GlobalLoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState<string | undefined>();
  const [progress, setProgress] = useState(0);

  const showLoading = (newTitle: string, newDescription?: string, newProgress: number = 0) => {
    setTitle(newTitle);
    setDescription(newDescription);
    setProgress(newProgress);
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
    setTitle('');
    setDescription(undefined);
    setProgress(0);
  };

  const updateProgress = (newProgress: number) => {
    setProgress(newProgress);
  };

  const value: GlobalLoadingContextType = {
    isLoading,
    title,
    description,
    progress,
    showLoading,
    hideLoading,
    updateProgress,
  };

  return (
    <GlobalLoadingContext.Provider value={value}>
      {children}
      <GlobalLoadingModal
        isOpen={isLoading}
        title={title}
        description={description}
        progress={progress}
      />
    </GlobalLoadingContext.Provider>
  );
};
