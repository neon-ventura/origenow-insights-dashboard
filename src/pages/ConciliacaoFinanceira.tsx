
import { Construction } from 'lucide-react';
import { DraggableSidebar } from "@/components/DraggableSidebar";
import { Header } from "@/components/Header";
import { useState } from "react";

const ConciliacaoFinanceira = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DraggableSidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={toggleSidebar} 
      />
      
      <div 
        className="flex-1 transition-all duration-300"
        style={{ 
          marginLeft: sidebarCollapsed ? '89px' : '281px' 
        }}
      >
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6" style={{ marginLeft: '15px' }}>
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2" style={{ fontSize: '28px' }}>
              Conciliação Financeira
            </h1>
            <p className="text-gray-600" style={{ fontSize: '18px' }}>
              Página em desenvolvimento
            </p>
          </div>

          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md mx-4">
              <div className="mb-6">
                <Construction className="h-24 w-24 text-orange-500 mx-auto mb-4" />
              </div>
              
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Página em Desenvolvimento
              </h1>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                A funcionalidade de <strong>Conciliação Financeira</strong> está sendo desenvolvida e estará disponível em breve.
              </p>
              
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                <p className="text-blue-700 text-sm">
                  Estamos trabalhando para trazer as melhores ferramentas de conciliação financeira para você!
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ConciliacaoFinanceira;
