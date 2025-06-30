
import React, { useState } from 'react';
import { DraggableSidebar } from '@/components/DraggableSidebar';
import { Header } from '@/components/Header';
import { ShoppingCart, TrendingUp, Package, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ComposedChart, Bar, Line, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine, Tooltip } from 'recharts';

const Index = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const performanceData = [
    { month: 'Jan', receita: 12000, vendas: 45, crescimento: 8.5, meta: 15000, lucro: 3600 },
    { month: 'Fev', receita: 13500, vendas: 52, crescimento: 12.5, meta: 15000, lucro: 4050 },
    { month: 'Mar', receita: 14200, vendas: 48, crescimento: 5.2, meta: 15000, lucro: 4260 },
    { month: 'Abr', receita: 15800, vendas: 67, crescimento: 11.3, meta: 15000, lucro: 4740 },
    { month: 'Mai', receita: 17200, vendas: 78, crescimento: 8.9, meta: 15000, lucro: 5160 },
    { month: 'Jun', receita: 16800, vendas: 71, crescimento: -2.3, meta: 15000, lucro: 5040 },
    { month: 'Jul', receita: 18600, vendas: 85, crescimento: 10.7, meta: 15000, lucro: 5580 },
  ];

  const topProducts = [
    { rank: 1, name: 'Ventilador De Teto Spirit 202', sku: '#10000', units: 120, change: '+5%' },
    { rank: 2, name: 'Ventilador Torre Spirit Maxxtmos', sku: '#10001', units: 87, change: '+6%' },
    { rank: 3, name: 'Ventilador De Teto Spirit Neevo2', sku: '#10002', units: 65, change: '+7%' },
    { rank: 4, name: 'Ventilador Portátil Spirit Wind', sku: '#10003', units: 54, change: '+3%' },
    { rank: 5, name: 'Ventilador De Mesa Spirit Compact', sku: '#10004', units: 42, change: '+8%' },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl border border-slate-200/50 shadow-xl">
          <p className="font-semibold text-slate-800 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-slate-600">{entry.name}:</span>
              <span className="font-semibold text-slate-800">
                {entry.name === 'Receita' || entry.name === 'Meta' || entry.name === 'Lucro' 
                  ? `R$ ${entry.value.toLocaleString()}` 
                  : entry.name === 'Crescimento' 
                  ? `${entry.value}%` 
                  : entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex">
      <DraggableSidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <div 
        className="flex-1 flex flex-col overflow-hidden transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? '64px' : '256px' }}
      >
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {/* Header Section */}
          <div className="mb-6 lg:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-700 bg-clip-text text-transparent mb-2">
                  Dashboard Analítico
                </h1>
                <p className="text-slate-600">Performance em tempo real do seu negócio</p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-500 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200/50 shadow-sm">
                <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full animate-pulse"></div>
                <span>Sincronizado há 2 min</span>
              </div>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <Card className="relative overflow-hidden bg-gradient-to-br from-white to-emerald-50/50 border border-emerald-200/50 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardContent className="p-4 lg:p-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
                    <ShoppingCart className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                    +12,5%
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600">Vendas Totais</p>
                  <p className="text-2xl lg:text-3xl font-bold text-slate-900">R$ 108,6K</p>
                  <div className="w-full bg-emerald-100 rounded-full h-2">
                    <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full w-3/4 transition-all duration-1000"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden bg-gradient-to-br from-white to-blue-50/50 border border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardContent className="p-4 lg:p-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                    Médio
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600">Ticket Médio</p>
                  <p className="text-2xl lg:text-3xl font-bold text-slate-900">R$ 725,9</p>
                  <div className="w-full bg-blue-100 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full w-4/5 transition-all duration-1000"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden bg-gradient-to-br from-white to-violet-50/50 border border-violet-200/50 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-violet-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardContent className="p-4 lg:p-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl shadow-lg">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-xs font-semibold text-violet-600 bg-violet-100 px-2 py-1 rounded-full">
                    Alto
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600">Produtos Ativos</p>
                  <p className="text-2xl lg:text-3xl font-bold text-slate-900">845</p>
                  <div className="w-full bg-violet-100 rounded-full h-2">
                    <div className="bg-gradient-to-r from-violet-500 to-violet-600 h-2 rounded-full w-5/6 transition-all duration-1000"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden bg-gradient-to-br from-white to-amber-50/50 border border-amber-200/50 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-amber-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardContent className="p-4 lg:p-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-xs font-semibold text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
                    Atenção
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600">Conversão</p>
                  <p className="text-2xl lg:text-3xl font-bold text-slate-900">4,2%</p>
                  <div className="w-full bg-amber-100 rounded-full h-2">
                    <div className="bg-gradient-to-r from-amber-500 to-amber-600 h-2 rounded-full w-1/4 transition-all duration-1000"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            {/* Advanced Performance Chart */}
            <div className="xl:col-span-2">
              <Card className="bg-gradient-to-br from-white via-white to-slate-50/30 border border-slate-200/50 shadow-xl">
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                        Performance Multidimensional
                      </CardTitle>
                      <p className="text-sm text-slate-600 mt-1">Análise integrada de receita, vendas e crescimento</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl lg:text-2xl font-bold text-slate-900">R$ 108,6K</p>
                      <p className="text-sm text-emerald-600 font-semibold flex items-center justify-end gap-1">
                        <TrendingUp className="w-4 h-4" />
                        +54% ↗
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-80 lg:h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <defs>
                          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
                            <stop offset="50%" stopColor="#6366f1" stopOpacity={0.6}/>
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                          </linearGradient>
                          <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity={0.7}/>
                            <stop offset="100%" stopColor="#34d399" stopOpacity={0.2}/>
                          </linearGradient>
                          <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8}/>
                            <stop offset="100%" stopColor="#fbbf24" stopOpacity={0.3}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                        <XAxis 
                          dataKey="month" 
                          stroke="#64748b" 
                          fontSize={12}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis 
                          yAxisId="left"
                          stroke="#64748b" 
                          fontSize={12}
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(value) => `R$ ${(value/1000).toFixed(0)}k`}
                        />
                        <YAxis 
                          yAxisId="right"
                          orientation="right"
                          stroke="#64748b" 
                          fontSize={12}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <ReferenceLine y={15000} stroke="#ef4444" strokeDasharray="5 5" yAxisId="left" />
                        <Area 
                          yAxisId="left"
                          type="monotone" 
                          dataKey="lucro" 
                          fill="url(#profitGradient)" 
                          stroke="#10b981"
                          strokeWidth={2}
                          name="Lucro"
                        />
                        <Bar 
                          yAxisId="left"
                          dataKey="receita" 
                          fill="url(#revenueGradient)" 
                          radius={[6, 6, 0, 0]}
                          stroke="#3b82f6"
                          strokeWidth={1}
                          name="Receita"
                        />
                        <Line 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="vendas" 
                          stroke="#f59e0b" 
                          strokeWidth={3}
                          dot={{ fill: '#f59e0b', strokeWidth: 2, r: 6 }}
                          name="Vendas"
                        />
                        <Line 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="crescimento" 
                          stroke="#8b5cf6" 
                          strokeWidth={3}
                          strokeDasharray="5 5"
                          dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                          name="Crescimento"
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap items-center justify-center mt-6 gap-4 lg:gap-8">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                      <span className="text-sm text-slate-600">Receita</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-gradient-to-r from-emerald-500 to-green-400 rounded-full"></div>
                      <span className="text-sm text-slate-600">Lucro</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
                      <span className="text-sm text-slate-600">Vendas</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-violet-500 rounded-full"></div>
                      <span className="text-sm text-slate-600">Crescimento</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-1 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-slate-600">Meta</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Top Products */}
            <div>
              <Card className="bg-gradient-to-br from-white via-white to-indigo-50/30 border border-indigo-200/50 shadow-xl h-fit">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-indigo-900 to-indigo-700 bg-clip-text text-transparent">
                    Top Performers
                  </CardTitle>
                  <p className="text-sm text-slate-600">Produtos em destaque no período</p>
                </CardHeader>
                <CardContent className="pt-0 space-y-4">
                  {topProducts.map((product) => (
                    <div key={product.rank} className="group relative">
                      <div className="flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-white to-slate-50/50 hover:from-indigo-50/50 hover:to-purple-50/50 transition-all duration-300 border border-slate-100 hover:border-indigo-200/50 hover:shadow-lg">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-sm font-bold text-white">{product.rank}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-indigo-700 transition-colors">
                            {product.name}
                          </p>
                          <p className="text-xs text-slate-500">SKU: {product.sku}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-slate-900">{product.units}</p>
                          <Badge className="text-xs bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0 hover:from-emerald-600 hover:to-green-600">
                            {product.change}
                          </Badge>
                        </div>
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
