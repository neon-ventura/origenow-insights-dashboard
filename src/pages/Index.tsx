
import React, { useState } from 'react';
import { DraggableSidebar } from '@/components/DraggableSidebar';
import { Header } from '@/components/Header';
import { ShoppingCart, TrendingUp, Package, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ComposedChart, Line, Bar, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

const Index = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const performanceData = [
    { month: 'Jan', receita: 12000, vendas: 45, meta: 15000 },
    { month: 'Fev', receita: 13500, vendas: 52, meta: 15000 },
    { month: 'Mar', receita: 14200, vendas: 48, meta: 15000 },
    { month: 'Abr', receita: 15800, vendas: 67, meta: 15000 },
    { month: 'Mai', receita: 17200, vendas: 78, meta: 15000 },
    { month: 'Jun', receita: 16800, vendas: 71, meta: 15000 },
    { month: 'Jul', receita: 18600, vendas: 85, meta: 15000 },
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
        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-lg">
          <p className="font-medium text-gray-900 mb-3">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm mb-1">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600 min-w-0 flex-1">{entry.name}:</span>
              <span className="font-medium text-gray-900">
                {entry.name === 'receita' || entry.name === 'meta'
                  ? `R$ ${entry.value.toLocaleString()}` 
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
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 max-w-7xl mx-auto w-full">
          {/* Header Section */}
          <div className="mb-6 lg:mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600">Visão geral do seu negócio</p>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between mb-3 lg:mb-4">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <ShoppingCart className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
                  </div>
                  <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600 hover:bg-gray-100">
                    +12,5%
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs lg:text-sm text-gray-500">Vendas Totais</p>
                  <p className="text-lg lg:text-2xl font-bold text-gray-900">R$ 108,6K</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between mb-3 lg:mb-4">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
                  </div>
                  <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600 hover:bg-gray-100">
                    Médio
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs lg:text-sm text-gray-500">Ticket Médio</p>
                  <p className="text-lg lg:text-2xl font-bold text-gray-900">R$ 725,9</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between mb-3 lg:mb-4">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <Package className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
                  </div>
                  <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600 hover:bg-gray-100">
                    Alto
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs lg:text-sm text-gray-500">Produtos Ativos</p>
                  <p className="text-lg lg:text-2xl font-bold text-gray-900">845</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between mb-3 lg:mb-4">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <Users className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
                  </div>
                  <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600 hover:bg-gray-100">
                    +8%
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs lg:text-sm text-gray-500">Clientes</p>
                  <p className="text-lg lg:text-2xl font-bold text-gray-900">1,247</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            {/* Performance Chart */}
            <div className="xl:col-span-2">
              <Card className="border-0 shadow-sm bg-white">
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg lg:text-xl font-bold text-gray-900">
                        Performance
                      </CardTitle>
                      <p className="text-sm text-gray-500 mt-1">Receita e vendas dos últimos meses</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg lg:text-xl font-bold text-gray-900">R$ 108,6K</p>
                      <p className="text-sm text-gray-600 font-medium flex items-center justify-end gap-1">
                        <TrendingUp className="w-4 h-4" />
                        +54%
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-64 lg:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <defs>
                          <linearGradient id="receitaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="month" 
                          stroke="#9ca3af" 
                          fontSize={12}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis 
                          yAxisId="left"
                          stroke="#9ca3af" 
                          fontSize={12}
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(value) => `R$ ${(value/1000).toFixed(0)}k`}
                        />
                        <YAxis 
                          yAxisId="right"
                          orientation="right"
                          stroke="#9ca3af" 
                          fontSize={12}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                          yAxisId="left"
                          type="monotone"
                          dataKey="receita"
                          fill="url(#receitaGradient)"
                          stroke="none"
                          name="Receita"
                        />
                        <Bar 
                          yAxisId="left"
                          dataKey="receita" 
                          fill="#2563eb"
                          radius={[4, 4, 0, 0]}
                          name="Receita"
                          opacity={0.8}
                        />
                        <Line 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="vendas" 
                          stroke="#2563eb" 
                          strokeWidth={3}
                          dot={{ fill: '#2563eb', strokeWidth: 2, r: 5 }}
                          name="Vendas"
                        />
                        <Line 
                          yAxisId="left"
                          type="monotone" 
                          dataKey="meta" 
                          stroke="#2563eb" 
                          strokeWidth={2}
                          strokeDasharray="8 8"
                          dot={false}
                          name="Meta"
                          opacity={0.6}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex items-center justify-center mt-4 lg:mt-6 gap-4 lg:gap-8">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      <span className="text-xs lg:text-sm text-gray-600">Receita</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-1 bg-blue-600 rounded-full"></div>
                      <span className="text-xs lg:text-sm text-gray-600">Vendas</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-1 bg-blue-600 opacity-60 rounded-full border-dashed border border-blue-600"></div>
                      <span className="text-xs lg:text-sm text-gray-600">Meta</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Products */}
            <div>
              <Card className="border-0 shadow-sm bg-white h-fit">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg lg:text-xl font-bold text-gray-900">
                    Top Produtos
                  </CardTitle>
                  <p className="text-sm text-gray-500">Produtos mais vendidos</p>
                </CardHeader>
                <CardContent className="pt-0 space-y-3 lg:space-y-4">
                  {topProducts.map((product) => (
                    <div key={product.rank} className="group">
                      <div className="flex items-center space-x-3 lg:space-x-4 p-3 lg:p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex-shrink-0 w-6 h-6 lg:w-8 lg:h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-xs lg:text-sm font-semibold text-gray-700">{product.rank}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs lg:text-sm font-medium text-gray-900 truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs lg:text-sm font-semibold text-gray-900">{product.units}</p>
                          <Badge className="text-xs bg-gray-100 text-gray-600 border-0 hover:bg-gray-100">
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
