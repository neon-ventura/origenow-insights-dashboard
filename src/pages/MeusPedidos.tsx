
import React, { useState } from 'react';
import { DraggableSidebar } from '@/components/DraggableSidebar';
import { Header } from '@/components/Header';
import { Construction, Code, Wrench } from 'lucide-react';

const MeusPedidos = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DraggableSidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <div 
        className="flex-1 flex flex-col overflow-hidden transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? '64px' : '256px' }}
      >
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {/* Título da Página */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Meus Pedidos</h1>
              <p className="text-gray-600 text-lg">Esta funcionalidade está em desenvolvimento</p>
            </div>

            {/* Cartão de Desenvolvimento */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <div className="text-center">
                <div className="flex justify-center items-center mb-6">
                  <div className="bg-blue-100 p-4 rounded-full">
                    <Construction className="w-12 h-12 text-blue-600" />
                  </div>
                </div>
                
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Funcionalidade em Desenvolvimento
                </h2>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Nossa equipe está trabalhando para trazer uma experiência completa de 
                  gerenciamento de pedidos. Em breve você poderá visualizar, acompanhar 
                  e gerenciar todos os seus pedidos em um só lugar.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex items-center mb-3">
                      <Code className="w-6 h-6 text-blue-600 mr-2" />
                      <h3 className="font-semibold text-gray-900">Recursos Planejados</h3>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li>• Visualização de todos os pedidos</li>
                      <li>• Status de entrega em tempo real</li>
                      <li>• Histórico detalhado</li>
                      <li>• Filtros avançados</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex items-center mb-3">
                      <Wrench className="w-6 h-6 text-green-600 mr-2" />
                      <h3 className="font-semibold text-gray-900">Em Desenvolvimento</h3>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li>• Interface de usuário</li>
                      <li>• Integração com APIs</li>
                      <li>• Sistema de notificações</li>
                      <li>• Relatórios personalizados</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-blue-800 text-sm">
                    <strong>Previsão de lançamento:</strong> Estamos trabalhando para disponibilizar 
                    esta funcionalidade o mais breve possível. Acompanhe as atualizações!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MeusPedidos;
