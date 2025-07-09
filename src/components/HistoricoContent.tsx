
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Package, RefreshCw, Search, Clock, CheckCircle, XCircle, Trash2, Upload } from 'lucide-react';
import { useUserContext } from '@/contexts/UserContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { apiClient } from '@/utils/apiClient';
import { ENDPOINTS } from '@/config/endpoints';
import { LoadingSplash } from '@/components/LoadingSplash';

interface JobHistoryItem {
  job_id: string;
  user_name: string;
  type: 'ofertas' | 'price_stock' | 'verification' | 'delete_skus';
  status: 'completed' | 'processing' | 'failed';
  progress: number;
  start_time: string;
  end_time: string | null;
  error: string | null;
  total_items: number | null;
  processed_items: number | null;
  created_at: string;
}

export const HistoricoContent = () => {
  const { selectedUser } = useUserContext();
  const { currentUser } = useAuth();
  const [jobHistory, setJobHistory] = useState<JobHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);

  const fetchJobHistory = async () => {
    if (!currentUser?.user) return;

    setLoading(true);
    try {
      const data = await apiClient.get<JobHistoryItem[]>(
        ENDPOINTS.JOBS.USER_JOBS(currentUser.user)
      );
      setJobHistory(data);
    } catch (error) {
      console.error('Error fetching job history:', error);
      toast({
        title: "Erro ao carregar histórico",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobHistory();
  }, [currentUser]);

  const getJobTypeName = (type: string) => {
    switch (type) {
      case 'ofertas': return 'Publicação de Ofertas';
      case 'price_stock': return 'Atualização de Estoque';
      case 'verification': return 'Verificação de GTIN';
      case 'delete_skus': return 'Exclusão de Anúncios';
      default: return type;
    }
  };

  const getJobTypeIcon = (type: string) => {
    switch (type) {
      case 'ofertas': return Upload; // Ícone do menu lateral para "Publicar Anúncios"
      case 'price_stock': return RefreshCw; // Ícone do menu lateral para "Atualização de Estoque"
      case 'verification': return Search; // Ícone do menu lateral para "Verificar GTIN"
      case 'delete_skus': return Trash2; // Ícone do menu lateral para "Deletar Anúncios"
      default: return Package;
    }
  };

  const getDownloadEndpoint = (type: string, jobId: string) => {
    switch (type) {
      case 'ofertas': return ENDPOINTS.DOWNLOADS.OFFERS(jobId);
      case 'price_stock': return ENDPOINTS.DOWNLOADS.PRICE_STOCK(jobId);
      case 'verification': return ENDPOINTS.DOWNLOADS.GTIN_VERIFICATION(jobId);
      case 'delete_skus': return ENDPOINTS.DOWNLOADS.DELETE_OFFERS(jobId);
      default: return '';
    }
  };

  const downloadJob = async (job: JobHistoryItem) => {
    if (job.status !== 'completed') return;

    setDownloading(job.job_id);
    try {
      const downloadEndpoint = getDownloadEndpoint(job.type, job.job_id);
      const filename = `${getJobTypeName(job.type)}_${job.job_id}.xlsx`;
      
      await apiClient.download(downloadEndpoint, filename);

      toast({
        title: "Download realizado!",
        description: "O arquivo foi baixado com sucesso.",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Erro no download",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setDownloading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Concluído</Badge>;
      case 'processing':
        return <Badge variant="default" className="bg-blue-100 text-blue-800"><Clock className="w-3 h-3 mr-1" />Processando</Badge>;
      case 'failed':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Falhou</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!currentUser) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Processamentos</CardTitle>
          <CardDescription>
            Faça login para visualizar o histórico
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500">Por favor, faça login primeiro</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Processamentos</CardTitle>
        <CardDescription>
          Histórico de jobs executados para {currentUser?.nickname || currentUser?.user}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Carregando histórico...</p>
          </div>
        ) : jobHistory.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhum histórico encontrado</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="h-12 px-4">Tipo</TableHead>
                  <TableHead className="h-12 px-4">Status</TableHead>
                  <TableHead className="h-12 px-4">Progresso</TableHead>
                  <TableHead className="h-12 px-4">Início</TableHead>
                  <TableHead className="h-12 px-4">Fim</TableHead>
                  <TableHead className="h-12 px-4">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobHistory.map((job) => {
                  const Icon = getJobTypeIcon(job.type);
                  return (
                    <TableRow key={job.job_id}>
                      <TableCell className="p-4">
                        <div className="flex items-center space-x-2">
                          <Icon className="w-4 h-4" />
                          <span className="font-medium">{getJobTypeName(job.type)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="p-4">
                        {getStatusBadge(job.status)}
                      </TableCell>
                      <TableCell className="p-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${job.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{job.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="p-4">
                        {formatDate(job.start_time)}
                      </TableCell>
                      <TableCell className="p-4">
                        {job.end_time ? formatDate(job.end_time) : '-'}
                      </TableCell>
                      <TableCell className="p-4">
                        {job.status === 'completed' && (
                          <Button
                            size="sm"
                            onClick={() => downloadJob(job)}
                            disabled={downloading === job.job_id}
                            className="flex items-center space-x-1"
                          >
                            <Download className="w-3 h-3" />
                            <span>{downloading === job.job_id ? 'Baixando...' : 'Download'}</span>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
