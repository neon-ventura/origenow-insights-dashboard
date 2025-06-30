
import React, { useState } from 'react';
import { DraggableSidebar } from '@/components/DraggableSidebar';
import { Header } from '@/components/Header';
import { ShoppingCart, TrendingUp, Package, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

const Index = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const performanceData = [
    { month: 'Jan', receita: 12000, vendas: 45 },
    { month: 'Fev', receita: 13500, vendas: 52 },
    { month: 'Mar', receita: 14200, vendas: 48 },
    { month: 'Abr', receita: 15800, vendas: 67 },
    { month: 'Mai', receita: 17200, vendas: 78 },
    { month: 'Jun', receita: 16800, vendas: 71 },
    { month: 'Jul', receita: 18600, vendas: 85 },
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
        <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600">{entry.name}:</span>
              <span className="font-medium text-gray-900">
                {entry.name === 'receita' 
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
        
        <main className="flex-1 overflow-y-auto p-6 max-w-7xl mx-auto w-full">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600">Visão geral do seu negócio</p>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <ShoppingCart className="w-5 h-5 text-gray-700" />
                  </div>
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 hover:bg-green-100">
                    +12,5%
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Vendas Totais</p>
                  <p className="text-2xl font-bold text-gray-900">R$ 108,6K</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-gray-700" />
                  </div>
                  <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-100">
                    Médio
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Ticket Médio</p>
                  <p className="text-2xl font-bold text-gray-900">R$ 725,9</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Package className="w-5 h-5 text-gray-700" />
                  </div>
                  <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700 hover:bg-purple-100">
                    Alto
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Produtos Ativos</p>
                  <p className="text-2xl font-bold text-gray-900">845</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Users className="w-5 h-5 text-gray-700" />
                  </div>
                  <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700 hover:bg-orange-100">
                    +8%
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Clientes</p>
                  <p className="text-2xl font-bold text-gray-900">1,247</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Performance Chart */}
            <div className="xl:col-span-2">
              <Card className="border-0 shadow-sm bg-white">
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">
                        Performance
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">Receita e vendas dos últimos meses</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">R$ 108,6K</p>
                      <p className="text-sm text-green-600 font-medium flex items-center justify-end gap-1">
                        <TrendingUp className="w-4 h-4" />
                        +54%
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
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
                        <Line 
                          yAxisId="left"
                          type="monotone" 
                          dataKey="receita" 
                          stroke="#374151" 
                          strokeWidth={3}
                          dot={{ fill: '#374151', strokeWidth: 2, r: 5 }}
                          name="Receita"
                        />
                        <Line 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="vendas" 
                          stroke="#6b7280" 
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={{ fill: '#6b7280', strokeWidth: 2, r: 4 }}
                          name="Vendas"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex items-center justify-center mt-6 gap-8">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gray-700 rounded-full"></div>
                      <span className="text-sm text-gray-600">Receita</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-1 bg-gray-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Vendas</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Products */}
            <div>
              <Card className="border-0 shadow-sm bg-white h-fit">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-gray-900">
                    Top Produtos
                  </CardTitle>
                  <p className="text-sm text-gray-600">Produtos mais vendidos</p>
                </CardHeader>
                <CardContent className="pt-0 space-y-4">
                  {topProducts.map((product) => (
                    <div key={product.rank} className="group">
                      <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-gray-700">{product.rank}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">{product.units}</p>
                          <Badge className="text-xs bg-green-100 text-green-700 border-0 hover:bg-green-100">
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
