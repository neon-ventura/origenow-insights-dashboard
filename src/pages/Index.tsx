
import React, { useState } from 'react';
import { DraggableSidebar } from '@/components/DraggableSidebar';
import { Header } from '@/components/Header';
import { ShoppingCart, TrendingUp, Package, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

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
    <div className="min-h-screen bg-slate-50 flex">
      <DraggableSidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <div 
        className="flex-1 flex flex-col overflow-hidden transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? '64px' : '256px' }}
      >
        <Header />
        
        <main className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-semibold text-slate-900 mb-2">Dashboard</h1>
                <p className="text-slate-600">Visão geral dos indicadores do seu negócio.</p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-500 bg-white px-3 py-2 rounded-lg border border-slate-200">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span>Atualizado há 5 minutos</span>
              </div>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-emerald-50 rounded-xl">
                    <ShoppingCart className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600">Vendas Totais</p>
                  <p className="text-2xl font-bold text-slate-900">R$ 1.250</p>
                  <p className="text-sm text-emerald-600 font-medium">+12,5% últimos 30 dias</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600">Ticket Médio</p>
                  <p className="text-2xl font-bold text-slate-900">R$ 725,9</p>
                  <p className="text-sm text-slate-500">por venda</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-violet-50 rounded-xl">
                    <Package className="w-6 h-6 text-violet-600" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600">Itens em Estoque</p>
                  <p className="text-2xl font-bold text-slate-900">845 <span className="text-sm font-normal text-slate-500">SKUs</span></p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-amber-50 rounded-xl">
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600">Estoque Baixo</p>
                  <p className="text-2xl font-bold text-slate-900">32 <span className="text-sm font-normal text-slate-500">SKUs</span></p>
                  <p className="text-sm text-slate-500">precisa de reposição</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Revenue Chart */}
            <div className="lg:col-span-2">
              <Card className="border border-slate-200 shadow-sm bg-white">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-semibold text-slate-900">Receita</CardTitle>
                      <p className="text-sm text-slate-600 mt-1">Visão geral da receita mensal</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-slate-900">R$ 108.600,00</p>
                      <p className="text-sm text-emerald-600 font-medium">+54% ↗</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <defs>
                          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity={1}/>
                            <stop offset="100%" stopColor="#6366f1" stopOpacity={0.3}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="month" 
                          stroke="#64748b" 
                          fontSize={12}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis 
                          stroke="#64748b" 
                          fontSize={12}
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(value) => `R$ ${(value/1000).toFixed(0)}k`}
                        />
                        <Bar 
                          dataKey="receita" 
                          fill="url(#barGradient)" 
                          radius={[4, 4, 0, 0]}
                          stroke="#6366f1"
                          strokeWidth={1}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="tendencia" 
                          stroke="#3b82f6" 
                          strokeWidth={3}
                          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                          connectNulls
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex items-center justify-center mt-6 space-x-8">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                      <span className="text-sm text-slate-600">Receita</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-slate-600">Tendência</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Products */}
            <div>
              <Card className="border border-slate-200 shadow-sm bg-white">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold text-slate-900">Produtos Mais Vendidos</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-4">
                  {topProducts.map((product) => (
                    <div key={product.rank} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-white">{product.rank}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{product.name}</p>
                        <p className="text-xs text-slate-500">SKU: {product.sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-900">{product.units} un</p>
                        <p className="text-xs text-emerald-600 font-medium">{product.change}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Stock Section - Now beside the chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2"></div>
            <div>
              <Card className="border border-slate-200 shadow-sm bg-white">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold text-slate-900">Estoque</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-4">
                  {stockItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="w-1 h-8 bg-indigo-500 rounded-full"></div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">{item.name}</p>
                            <p className="text-xs text-slate-500">{item.status}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-900">{item.units} un</p>
                        <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200">
                          {item.level}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
