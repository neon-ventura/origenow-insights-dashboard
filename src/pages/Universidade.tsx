
import React from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Play, Clock, Users } from 'lucide-react';

const Universidade = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  const videoAulas = [
    {
      id: "1",
      titulo: "Introdução ao Amazon FBA",
      descricao: "Aprenda os conceitos básicos do Amazon FBA e como começar a vender na plataforma. Nesta aula você entenderá os primeiros passos para configurar sua conta e iniciar suas vendas.",
      videoId: "dQw4w9WgXcQ", // Substitua pelo ID real do vídeo
      duracao: "15 min",
      nivel: "Iniciante"
    },
    {
      id: "2", 
      titulo: "Pesquisa de Produtos Rentáveis",
      descricao: "Descubra como encontrar produtos com alto potencial de vendas e baixa concorrência. Estratégias avançadas de pesquisa de mercado e análise de dados para maximizar seus lucros.",
      videoId: "dQw4w9WgXcQ", // Substitua pelo ID real do vídeo
      duracao: "22 min",
      nivel: "Intermediário"
    },
    {
      id: "3",
      titulo: "Otimização de Listagens",
      descricao: "Aprenda a criar listagens que convertem mais vendas. Técnicas de SEO interno da Amazon, escolha de palavras-chave e criação de títulos e descrições persuasivas.",
      videoId: "dQw4w9WgXcQ", // Substitua pelo ID real do vídeo
      duracao: "18 min",
      nivel: "Intermediário"
    },
    {
      id: "4",
      titulo: "Estratégias de Publicidade Amazon PPC",
      descricao: "Domine as campanhas de publicidade da Amazon para aumentar a visibilidade dos seus produtos. Configuração de campanhas, otimização de custos e análise de performance.",
      videoId: "dQw4w9WgXcQ", // Substitua pelo ID real do vídeo
      duracao: "35 min",
      nivel: "Avançado"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex w-full">
      {/* Sidebar fixo */}
      <div className="fixed top-0 left-0 h-full z-40">
        <Sidebar 
          isCollapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
      </div>
      
      {/* Conteúdo principal com margem para o sidebar */}
      <div 
        className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}
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
                    <span className="font-semibold">1h 30min</span>
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
