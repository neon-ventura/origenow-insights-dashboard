
import React from 'react';
import { Header } from '@/components/Header';
import { DraggableSidebar } from '@/components/DraggableSidebar';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Construction, Clock } from 'lucide-react';

const ConciliacaoFinanceira = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DraggableSidebar isCollapsed={sidebarCollapsed} onToggle={handleSidebarToggle} />
      
      <div 
        className="transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? '88px' : '256px' }}
      >
        <Header />
        
        <main className="p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Conciliação Financeira
              </h1>
              <p className="text-gray-600">
                Ferramenta para conciliação e análise financeira
              </p>
            </div>

            <Card className="text-center py-12">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <Construction className="h-16 w-16 text-orange-500" />
                    <Clock className="h-6 w-6 text-blue-500 absolute -top-1 -right-1 bg-white rounded-full p-1" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-gray-800 mb-2">
                  Página em Desenvolvimento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-lg mb-4">
                  Estamos trabalhando para trazer a melhor experiência em conciliação financeira.
                </p>
                <p className="text-sm text-gray-500">
                  Esta funcionalidade estará disponível em breve. Fique atento às novidades!
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ConciliacaoFinanceira;
