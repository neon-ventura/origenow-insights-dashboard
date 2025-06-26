
import React, { useState } from 'react';
import { DraggableSidebar } from '@/components/DraggableSidebar';
import { Header } from '@/components/Header';
import { MetricCard } from '@/components/MetricCard';
import { ShoppingCart, TrendingUp, Package, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Index = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const revenueData = [
    { month: 'Jan', receita: 12000, tendencia: 11500 },
    { month: 'Fev', receita: 13500, tendencia: 13000 },
    { month: 'Mar', receita: 14200, tendencia: 14500 },
    { month: 'Abr', receita: 15800, tendencia: 15200 },
    { month: 'Mai', receita: 17200, tendencia: 16800 },
    { month: 'Jun', receita: 16800, tendencia: 17500 },
    { month: 'Jul', receita: 18600, tendencia: 18200 },
  ];

  const topProducts = [
    { rank: 1, name: 'Ventilador De Teto Spirit 202', sku: '#10000', units: 120, change: '+5%' },
    { rank: 2, name: 'Ventilador Torre Spirit Maxxtmos', sku: '#10001', units: 87, change: '+6%' },
    { rank: 3, name: 'Ventilador De Teto Spirit Neevo2', sku: '#10002', units: 65, change: '+7%' },
  ];

  const stockItems = [
    { name: 'Ventilador De Teto Spirit 202', status: 'Em estoque', units: 87, level: 'Alto' },
    { name: 'Ventilador Torre Spirit Maxxtmos', status: 'Em estoque', units: 65, level: 'Alto' },
  ];

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
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
                <p className="text-gray-600">Visão geral dos indicadores do seu negócio.</p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Atualizado há 5 minutos</span>
              </div>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <ShoppingCart className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Vendas Totais (R$)</p>
                  <p className="text-2xl font-bold text-gray-900">1250</p>
                  <p className="text-sm text-green-600">+12,5% últimos 30 dias</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Ticket Médio (R$)</p>
                  <p className="text-2xl font-bold text-gray-900">725,9</p>
                  <p className="text-sm text-gray-500">por venda</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Itens em Estoque</p>
                  <p className="text-2xl font-bold text-gray-900">845 <span className="text-sm font-normal text-gray-500">SKUs</span></p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Estoque Baixo</p>
                  <p className="text-2xl font-bold text-gray-900">32 <span className="text-sm font-normal text-gray-500">SKUs</span></p>
                  <p className="text-sm text-gray-500">precisa de reposição</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Revenue Chart */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">Receita</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">Visão geral da receita mensal</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">R$ 108.600,00</p>
                      <p className="text-sm text-green-600">+54% ↗</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" stroke="#666" fontSize={12} />
                        <YAxis stroke="#666" fontSize={12} />
                        <Bar dataKey="receita" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        <Line type="monotone" dataKey="tendencia" stroke="#10b981" strokeWidth={2} dot={false} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex items-center justify-center mt-4 space-x-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      <span className="text-sm text-gray-600">Receita</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span className="text-sm text-gray-600">Tendência</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Products */}
            <div>
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-gray-900">Produtos Mais Vendidos</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-4">
                  {topProducts.map((product) => (
                    <div key={product.rank} className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-yellow-700">{product.rank}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                        <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">{product.units} un</p>
                        <p className="text-xs text-green-600">{product.change}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Stock Section */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">Estoque</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                {stockItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-1 h-8 bg-blue-500 rounded"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.status}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{item.units} un</p>
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 hover:bg-green-100">
                        {item.level}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Information Section */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">Informações</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-medium text-blue-600 mb-2">Anye Parts</h3>
                    <p className="text-sm text-gray-600 mb-3">Sistema de gestão para autopeças</p>
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline" className="text-xs">v1.2.0</Badge>
                      <Badge className="text-xs bg-green-100 text-green-700 hover:bg-green-100">Estável</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
