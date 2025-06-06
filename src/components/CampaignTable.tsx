
import React from 'react';
import { MoreVertical, ToggleLeft, ToggleRight } from 'lucide-react';

const campaigns = [
  {
    id: 1,
    name: 'Campanha com predefinições - B07P...',
    country: 'Brasil',
    status: 'Pausado',
    type: 'Sponsored Products',
    segment: 'Segmentação manual',
    portfolio: 'Sem data',
    startDate: '27 de mai de 2025',
    endDate: 'Sem data',
    active: false
  },
  {
    id: 2,
    name: 'Campanha com predefinições - B07Y...',
    country: 'Brasil',
    status: 'Pausado',
    type: 'Sponsored Products',
    segment: 'Segmentação manual',
    portfolio: 'Sem data',
    startDate: '27 de mai de 2025',
    endDate: 'Sem data',
    active: false
  },
  {
    id: 3,
    name: 'Campanha com predefinições - B07Y...',
    country: 'Brasil',
    status: 'Em inserção',
    type: 'Sponsored Products',
    segment: 'Segmentação manual',
    portfolio: 'Sem data',
    startDate: '27 de mai de 2025',
    endDate: 'Sem data',
    active: true
  },
  {
    id: 4,
    name: 'Campanha com predefinições - B0F5...',
    country: 'Brasil',
    status: 'Pausado',
    type: 'Sponsored Products',
    segment: 'Segmentação manual',
    portfolio: 'Sem data',
    startDate: '27 de mai de 2025',
    endDate: 'Sem data',
    active: false
  },
  {
    id: 5,
    name: 'Campanha com predefinições - B08L...',
    country: 'Brasil',
    status: 'Pausado',
    type: 'Sponsored Products',
    segment: 'Segmentação manual',
    portfolio: 'Sem data',
    startDate: '27 de mai de 2025',
    endDate: 'Sem data',
    active: false
  }
];

export const CampaignTable = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Campanhas Ativas</h2>
            <p className="text-sm text-gray-600">Gerencie suas campanhas de produtos</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Criar uma campanha
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Filtrar por
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Exportar
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ativo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Campanhas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                País
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Portfólio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data de início
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data de término
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {campaigns.map((campaign) => (
              <tr key={campaign.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  {campaign.active ? (
                    <ToggleRight className="w-6 h-6 text-blue-600" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-gray-400" />
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
                    {campaign.name}
                  </div>
                  <div className="text-sm text-gray-500">{campaign.segment}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {campaign.country}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    campaign.status === 'Em inserção' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {campaign.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div>{campaign.type}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {campaign.portfolio}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {campaign.startDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {campaign.endDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
