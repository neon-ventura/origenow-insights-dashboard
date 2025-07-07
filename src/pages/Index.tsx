
import React, { useState } from 'react';
import { ShoppingCart, TrendingUp, Package, FileText, BarChart3, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ComposedChart, Line, Bar, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { useDashboard } from '@/hooks/useDashboard';

const Index = () => {
  const [timeScale, setTimeScale] = useState<'monthly' | 'weekly' | 'daily'>('monthly');
  const { data: dashboardData, isLoading } = useDashboard();

  // Função para formatar dados conforme a escala de tempo selecionada
  const getChartData = () => {
    if (!dashboardData) return [];

    switch (timeScale) {
      case 'weekly':
        return dashboardData.pedidos_por_semana.histotico.map(item => ({
          period: `S${item.semana_do_mes}/${item.mes.slice(-2)}`,
          receita: parseFloat(item.valor_total),
          vendas: parseInt(item.quantidade_total)
        }));
      case 'daily':
        return dashboardData.pedidos_por_dia.histotico.slice(-7).map(item => ({
          period: new Date(item.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
          receita: parseFloat(item.valor_total),
          vendas: parseInt(item.quantidade_total)
        }));
      default:
        return dashboardData.pedidos_por_mes.histotico.map(item => ({
          period: item.mes.slice(-2) + '/' + item.mes.slice(0, 4),
          receita: parseFloat(item.valor_total),
          vendas: parseInt(item.quantidade_total)
        }));
    }
  };

  // Processar dados dos top produtos
  const getTopProducts = () => {
    if (!dashboardData) return [];
    
    return dashboardData.vendas_por_produto
      .sort((a, b) => b.quantidade_vendida.mes_atual - a.quantidade_vendida.mes_atual)
      .slice(0, 5)
      .map((product, index) => ({
        rank: index + 1,
        name: product.product_name,
        sku: `#${product.sku}`,
        units: product.quantidade_vendida.mes_atual,
        change: product.quantidade_vendida.diferenca_percentual 
          ? `${parseFloat(product.quantidade_vendida.diferenca_percentual) >= 0 ? '+' : ''}${product.quantidade_vendida.diferenca_percentual}%`
          : 'Novo'
      }));
  };

  const formatCurrency = (value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numValue);
  };

  const formatPercentage = (value: string) => {
    const numValue = parseFloat(value);
    const isPositive = numValue >= 0;
    return {
      value: `${isPositive ? '+' : ''}${value}%`,
      isPositive
    };
  };

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
                  ? formatCurrency(entry.value)
                  : entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const totalOrdersChange = dashboardData ? formatPercentage(dashboardData.valor_total_pedidos.diferenca_percentual) : { value: '0%', isPositive: true };
  const averageOrdersChange = dashboardData ? formatPercentage(dashboardData.valor_medio_pedidos.diferenca_percentual) : { value: '0%', isPositive: true };

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
              <Badge 
                variant="secondary" 
                className={`text-xs hover:bg-gray-100 ${
                  totalOrdersChange.isPositive 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {totalOrdersChange.isPositive ? (
                  <TrendingUp className="w-3 h-3 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1" />
                )}
                {totalOrdersChange.value}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-xs lg:text-sm text-gray-500">Vendas Totais</p>
              <p className="text-lg lg:text-2xl font-bold text-gray-900">
                {dashboardData ? formatCurrency(dashboardData.valor_total_pedidos.valor_mes_atual) : 'R$ 0,00'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <div className="p-2 bg-gray-50 rounded-lg">
                <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
              </div>
              <Badge 
                variant="secondary" 
                className={`text-xs hover:bg-gray-100 ${
                  averageOrdersChange.isPositive 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {averageOrdersChange.isPositive ? (
                  <TrendingUp className="w-3 h-3 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1" />
                )}
                {averageOrdersChange.value}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-xs lg:text-sm text-gray-500">Ticket Médio</p>
              <p className="text-lg lg:text-2xl font-bold text-gray-900">
                {dashboardData ? formatCurrency(dashboardData.valor_medio_pedidos.media_pedidos_mes_atual) : 'R$ 0,00'}
              </p>
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
                Ativo
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-xs lg:text-sm text-gray-500">Produtos Ativos</p>
              <p className="text-lg lg:text-2xl font-bold text-gray-900">
                {dashboardData ? dashboardData.produtos_ativos.toLocaleString() : '0'}
              </p>
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
                Atual
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-xs lg:text-sm text-gray-500">Pedidos do Mês</p>
              <p className="text-lg lg:text-2xl font-bold text-gray-900">
                {dashboardData ? dashboardData.total_pedidos.total_pedidos_mes_atual.toLocaleString() : '0'}
              </p>
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
                <p className="text-lg lg:text-xl font-bold text-gray-900">
                  {dashboardData ? formatCurrency(dashboardData.valor_total_pedidos.valor_mes_atual) : 'R$ 0,00'}
                </p>
                <p className={`text-sm font-medium flex items-center justify-end gap-1 ${
                  totalOrdersChange.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {totalOrdersChange.isPositive ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {totalOrdersChange.value}
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
              {getTopProducts().map((product) => (
                <div key={product.rank} className="group">
                  <div className="flex items-center space-x-3 lg:space-x-4 p-3 lg:p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex-shrink-0 w-6 h-6 lg:w-8 lg:h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-xs lg:text-sm font-semibold text-gray-700">{product.rank}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs lg:text-sm font-medium text-gray-900 truncate">
                        {product.name.length > 40 ? `${product.name.substring(0, 40)}...` : product.name}
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
