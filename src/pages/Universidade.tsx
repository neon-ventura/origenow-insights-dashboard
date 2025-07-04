
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Play, Clock, Users, Loader2 } from 'lucide-react';
import { useVideos } from '@/hooks/useVideos';

const Universidade = () => {
  const { data: videoAulas = [], isLoading, error } = useVideos();

  const calcularDuracaoTotal = () => {
    if (!videoAulas.length) return '0min';
    
    // Converte durações para minutos e soma
    const totalMinutos = videoAulas.reduce((total, aula) => {
      const duracao = aula.duracao.replace(/[^\d]/g, ''); // Remove tudo que não é número
      return total + parseInt(duracao || '0');
    }, 0);
    
    return `${totalMinutos}min`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando vídeos...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground">Erro ao carregar os vídeos</p>
          <p className="text-sm text-muted-foreground mt-2">Tente novamente mais tarde</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center space-x-3 mb-8">
        <div className="bg-blue-600 p-3 rounded-lg">
          <Play className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Universidade OrigeNow</h1>
          <p className="text-muted-foreground">Aprenda tudo sobre vendas na Amazon com nossos especialistas</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5 text-blue-600" />
                Vídeo Aulas
              </CardTitle>
              <CardDescription>
                Acesse nosso conteúdo exclusivo e aprenda com os melhores do mercado
              </CardDescription>
            </CardHeader>
            <CardContent>
              {videoAulas.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhum vídeo disponível no momento</p>
                </div>
              ) : (
                <Accordion type="single" collapsible className="w-full" defaultValue={videoAulas[0]?.id}>
                  {videoAulas.map((aula) => (
                    <AccordionItem key={aula.id} value={aula.id}>
                      <AccordionTrigger className="text-left hover:no-underline">
                        <div className="flex items-center justify-between w-full mr-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-lg">
                              <Play className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{aula.titulo}</h3>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {aula.duracao}
                                </span>
                                <span className={`px-2 py-1 rounded text-xs ${
                                  aula.nivel === 'Iniciante' ? 'bg-green-100 text-green-700' :
                                  aula.nivel === 'Intermediário' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {aula.nivel}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-4">
                        <div className="space-y-4">
                          <div className="aspect-video rounded-lg overflow-hidden bg-slate-100">
                            <iframe
                              width="100%"
                              height="100%"
                              src={`https://www.youtube.com/embed/${aula.videoId}`}
                              title={aula.titulo}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full h-full"
                            ></iframe>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-lg">
                            <h4 className="font-medium mb-2">Sobre esta aula:</h4>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                              {aula.descricao}
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 h-fit">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Estatísticas do Curso
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total de Aulas</span>
                <span className="font-semibold">{videoAulas.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Duração Total</span>
                <span className="font-semibold">{calcularDuracaoTotal()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Nível</span>
                <span className="font-semibold">Todos os níveis</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Certificado</span>
                <span className="font-semibold text-green-600">Incluído</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Próximas Aulas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="bg-blue-600 p-2 rounded">
                    <Play className="h-3 w-3 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Análise de Concorrência</p>
                    <p className="text-xs text-muted-foreground">Em breve</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="bg-blue-600 p-2 rounded">
                    <Play className="h-3 w-3 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Gestão de Estoque</p>
                    <p className="text-xs text-muted-foreground">Em breve</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Universidade;
