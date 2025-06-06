
import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { MetricCard } from '@/components/MetricCard';
import { PerformanceChart } from '@/components/PerformanceChart';
import { CampaignTable } from '@/components/CampaignTable';
import { MousePointer, DollarSign, ShoppingBag, TrendingUp } from 'lucide-react';

const Index = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <div 
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}
      >
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          {/* Notice Banner */}
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-blue-800">
                  Você está usando nossa nova e expandida experiência multipaises.{' '}
                  <a href="#" className="text-blue-600 underline hover:text-blue-800">
                    Reverter para a exibição de um único país
                  </a>
                </p>
              </div>
              <div className="text-right">
                <a href="#" className="text-sm text-blue-600 underline hover:text-blue-800">
                  Saiba mais sobre a exibição multipaises
                </a>
                {' | '}
                <a href="#" className="text-sm text-blue-600 underline hover:text-blue-800">
                  Deixe seu feedback
                </a>
              </div>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Cliques"
              value="4.188"
              change={12.5}
              changeLabel="vs mês anterior"
              color="purple"
              icon={<MousePointer className="w-4 h-4" />}
            />
            <MetricCard
              title="Gastos"
              value="R$ 4.136,75"
              change={-8.2}
              changeLabel="vs mês anterior"
              color="green"
              icon={<DollarSign className="w-4 h-4" />}
            />
            <MetricCard
              title="Pedidos"
              value="90"
              change={15.7}
              changeLabel="vs mês anterior"
              color="purple"
              icon={<ShoppingBag className="w-4 h-4" />}
            />
            <MetricCard
              title="Vendas"
              value="R$ 9.383,08"
              change={22.1}
              changeLabel="vs mês anterior"
              color="blue"
              icon={<TrendingUp className="w-4 h-4" />}
            />
          </div>

          {/* Performance Chart */}
          <div className="mb-8">
            <PerformanceChart />
          </div>

          {/* Campaign Table */}
          <CampaignTable />
        </main>
      </div>
    </div>
  );
};

export default Index;
