import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSplashProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  overlay?: boolean;
}

export const LoadingSplash = ({ 
  message = "Carregando dados...", 
  size = 'md',
  overlay = false 
}: LoadingSplashProps) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const containerClasses = overlay 
    ? "fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center"
    : "flex items-center justify-center min-h-[400px] w-full";

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600`} />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-900">{message}</p>
          <p className="text-xs text-gray-500 mt-1">Aguarde alguns instantes</p>
        </div>
      </div>
    </div>
  );
};