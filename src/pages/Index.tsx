import React, { useState } from 'react';
import { ShoppingCart, TrendingUp, Package, FileText, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ComposedChart, Line, Bar, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

const Index = () => {
  const [timeScale, setTimeScale] = useState<'monthly' | 'weekly' | 'daily'>('monthly');

  const monthlyData = [
    { period: 'Jan', receita: 12000, vendas: 45 },
    { period: 'Fev', receita: 13500, vendas: 52 },
    { period: 'Mar', receita: 14200, vendas: 48 },
    { period: 'Abr', receita: 15800, vendas: 67 },
    { period: 'Mai', receita: 17200, vendas: 78 },
    { period: 'Jun', receita: 16800, vendas: 71 },
    { period: 'Jul', receita: 18600, vendas: 85 },
  ];

  const weeklyData = [
    { period: 'Sem 1', receita: 4200, vendas: 15 },
    { period: 'Sem 2', receita: 4800, vendas: 18 },
    { period: 'Sem 3', receita: 3900, vendas: 12 },
    { period: 'Sem 4', receita: 5100, vendas: 21 },
    { period: 'Sem 5', receita: 4600, vendas: 17 },
    { period: 'Sem 6', receita: 5300, vendas: 23 },
    { period: 'Sem 7', receita: 4700, vendas: 19 },
  ];

  const dailyData = [
    { period: 'Seg', receita: 800, vendas: 3 },
    { period: 'Ter', receita: 950, vendas: 4 },
    { period: 'Qua', receita: 720, vendas: 2 },
    { period: 'Qui', receita: 1100, vendas: 5 },
    { period: 'Sex', receita: 1200, vendas: 6 },
    { period: 'Sáb', receita: 650, vendas: 2 },
    { period: 'Dom', receita: 580, vendas: 1 },
  ];

  const getChartData = () => {
    switch (timeScale) {
      case 'weekly':
        return weeklyData;
      case 'daily':
        return dailyData;
      default:
        return monthlyData;
    }
  };

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
    <>
      {/* Header Section */}
      <div className="mb-6 lg:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 text-lg">Visão geral do seu negócio</p>
          </div>
        </div>
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
                <FileText className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
              </div>
              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600 hover:bg-gray-100">
                +8%
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-xs lg:text-sm text-gray-500">Pedidos Totais</p>
              <p className="text-lg lg:text-2xl font-bold text-gray-900">1,247</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        {/* Performance Chart */}
        <div className="xl:col-span-2">
          <Card className="border-0 shadow-sm bg-white h-full">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg lg:text-xl font-bold text-gray-900">
                    Performance
                  </CardTitle>
                  <p className="text-sm text-gray-500 mt-1">Receita e vendas por período</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={timeScale === 'monthly' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTimeScale('monthly')}
                  >
                    Mensal
                  </Button>
                  <Button
                    variant={timeScale === 'weekly' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTimeScale('weekly')}
                  >
                    Semanal
                  </Button>
                  <Button
                    variant={timeScale === 'daily' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTimeScale('daily')}
                  >
                    Diário
                  </Button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg lg:text-xl font-bold text-gray-900">R$ 108,6K</p>
                <p className="text-sm text-gray-600 font-medium flex items-center justify-end gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +54%
                </p>
              </div>
            </CardHeader>
            <CardContent className="pt-0 flex-1">
              <div className="h-64 lg:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={getChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="receitaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="period" 
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
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Products */}
        <div>
          <Card className="border-0 shadow-sm bg-white h-full">
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
    </>
  );
};

export default Index;
