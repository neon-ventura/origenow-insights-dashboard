
import { useFileUpload } from '@/hooks/useFileUpload';
import { useJobMonitoring } from '@/hooks/useJobMonitoring';

interface UseUploadWithJobsProps {
  endpoint: string;
  jobType: 'verification' | 'ofertas' | 'price_stock';
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export const useUploadWithJobs = ({ endpoint, jobType, onSuccess, onError }: UseUploadWithJobsProps) => {
  const { monitorGtinProgress, monitorEstoqueProgress, monitorOfertasProgress } = useJobMonitoring();
  
  const { uploadFile, isUploading, activeJobId } = useFileUpload({
    endpoint,
    jobType,
    onSuccess,
    onError,
    onJobCreated: (contextJobId: string, apiJobId: string) => {
      if (jobType === 'verification') {
        monitorGtinProgress(contextJobId, apiJobId);
      } else if (jobType === 'price_stock') {
        monitorEstoqueProgress(contextJobId, apiJobId);
      } else if (jobType === 'ofertas') {
        monitorOfertasProgress(contextJobId, apiJobId);
      }
    }
  });

  return {
    uploadFile,
    isUploading,
    activeJobId,
  };
};
