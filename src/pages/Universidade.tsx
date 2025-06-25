
import React from 'react';
import { Header } from '@/components/Header';
import { DraggableSidebar } from '@/components/DraggableSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Play, Clock, Users } from 'lucide-react';

const Universidade = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  const videoAulas = [
    {
      id: "1",
      titulo: "Introdução ao Amazon Start",
      descricao: "Neste vídeo exclusivo da Origenow com o programa Amazon Start, você vai conhecer tudo sobre o Amazon Start, o programa ideal para quem quer começar a vender na Amazon com suporte, benefícios e as melhores estratégias desde o início.",
      videoId: "watch?v=oaA8Y8D827I&list=PLUmA7M3q06jqljKoFv8aCDAOGNUdzjU_i&index=3", // Substitua pelo ID real do vídeo
      duracao: "4 min",
      nivel: "Iniciante"
    },
    {
      id: "2", 
      titulo: "Taxas e Logistica",
      descricao: "Neste vídeo rápido da Origenow com o programa Amazon Start, você vai entender como funcionam as taxas e a logística na Amazon e como usá-las a seu favor para vender com mais eficiência e lucratividade.",
      videoId: "watch?v=6AUfdMGbH4U&list=PLUmA7M3q06jqljKoFv8aCDAOGNUdzjU_i&index=2", // Substitua pelo ID real do vídeo
      duracao: "15 min",
      nivel: "Iniciante"
    },
    {
      id: "3",
      titulo: "Como Criar Imagens de Anúncios que Vendem na Amazon",
      descricao: "Neste webinar exclusivo da Origenow em parceria com o programa Amazon Start, você vai descobrir as melhores práticas, estratégias e ferramentas para construir imagens que aumentam a conversão e destacam seus produtos.",
      videoId: "watch?v=DESyEdVHYxI&list=PLUmA7M3q06jqljKoFv8aCDAOGNUdzjU_i&index=1", // Substitua pelo ID real do vídeo
      duracao: "13 min",
      nivel: "Intermediário"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex w-full">
      <DraggableSidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <div 
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? '64px' : '256px' }}
      >
        <Header />
        
        <main className="p-6 space-y-6">
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
              <Card>
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
                  <Accordion type="single" collapsible className="w-full">
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
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
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
                    <span className="font-semibold">32min</span>
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
        </main>
      </div>
    </div>
  );
};

export default Universidade;
