
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { date: 'Mai 01', cliques: 50, gastos: 95, pedidos: 30, vendas: 80 },
  { date: 'Mai 03', cliques: 80, gastos: 110, pedidos: 45, vendas: 120 },
  { date: 'Mai 05', cliques: 45, gastos: 85, pedidos: 25, vendas: 90 },
  { date: 'Mai 07', cliques: 120, gastos: 140, pedidos: 60, vendas: 180 },
  { date: 'Mai 09', cliques: 35, gastos: 75, pedidos: 20, vendas: 65 },
  { date: 'Mai 11', cliques: 90, gastos: 115, pedidos: 40, vendas: 140 },
  { date: 'Mai 13', cliques: 15, gastos: 45, pedidos: 10, vendas: 35 },
  { date: 'Mai 15', cliques: 75, gastos: 105, pedidos: 35, vendas: 110 },
  { date: 'Mai 17', cliques: 95, gastos: 125, pedidos: 50, vendas: 160 },
  { date: 'Mai 19', cliques: 110, gastos: 135, pedidos: 55, vendas: 175 },
  { date: 'Mai 21', cliques: 85, gastos: 120, pedidos: 40, vendas: 130 },
  { date: 'Mai 23', cliques: 130, gastos: 155, pedidos: 70, vendas: 210 },
  { date: 'Mai 25', cliques: 140, gastos: 165, pedidos: 75, vendas: 225 },
  { date: 'Mai 27', cliques: 25, gastos: 60, pedidos: 15, vendas: 45 },
  { date: 'Mai 29', cliques: 105, gastos: 130, pedidos: 52, vendas: 170 },
  { date: 'Mai 31', cliques: 95, gastos: 125, pedidos: 48, vendas: 155 },
];

export const PerformanceChart = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Performance das Vendas</h2>
        <p className="text-sm text-gray-600">Acompanhamento diário do último mês</p>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              stroke="#666"
              fontSize={12}
            />
            <YAxis stroke="#666" fontSize={12} />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="cliques" 
              stroke="#7c3aed" 
              strokeWidth={2}
              name="Cliques"
              dot={{ fill: '#7c3aed', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="gastos" 
              stroke="#059669" 
              strokeWidth={2}
              name="Gastos"
              dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="pedidos" 
              stroke="#dc2626" 
              strokeWidth={2}
              name="Pedidos"
              dot={{ fill: '#dc2626', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="vendas" 
              stroke="#2563eb" 
              strokeWidth={2}
              name="Vendas"
              dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
