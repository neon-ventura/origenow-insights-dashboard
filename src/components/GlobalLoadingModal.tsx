
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import AnimatedLoader from './AnimatedLoader';

interface GlobalLoadingModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
}

export const GlobalLoadingModal: React.FC<GlobalLoadingModalProps> = ({
  isOpen,
  title,
  description
}) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent 
        className="max-w-md border-0 bg-transparent shadow-none"
        hideCloseButton
      >
        <div className="fixed inset-0 bg-blue-600/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 shadow-2xl flex flex-col items-center space-y-6 max-w-sm mx-4">
            <AnimatedLoader />
            
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {title}
              </h3>
              {description && (
                <p className="text-sm text-gray-600">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
