
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Loader } from 'lucide-react';

interface GlobalLoadingModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  progress?: number;
}

export const GlobalLoadingModal: React.FC<GlobalLoadingModalProps> = ({
  isOpen,
  title,
  description,
  progress = 0
}) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent 
        className="max-w-md border-0 bg-transparent shadow-none"
        hideCloseButton
      >
        <div className="fixed inset-0 bg-blue-600/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 shadow-2xl flex flex-col items-center space-y-6 max-w-sm mx-4">
            <div className="relative">
              <Loader className="h-12 w-12 text-blue-600 animate-spin" />
            </div>
            
            <div className="text-center space-y-2 w-full">
              <h3 className="text-lg font-semibold text-gray-900">
                {title}
              </h3>
              {description && (
                <p className="text-sm text-gray-600">
                  {description}
                </p>
              )}
              
              {progress > 0 && (
                <div className="w-full space-y-2 mt-4">
                  <Progress value={progress} className="w-full" />
                  <p className="text-xs text-gray-500" style={{ opacity: progress / 100 }}>
                    {progress}% concluído
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
