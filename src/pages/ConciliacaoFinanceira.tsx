
import { Construction } from 'lucide-react';

const ConciliacaoFinanceira = () => {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Conciliação Financeira
        </h1>
        <p className="text-gray-600 text-lg">
          Página em desenvolvimento
        </p>
      </div>

      <div className="min-h-[400px] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <div className="mb-6">
            <Construction className="h-24 w-24 text-orange-500 mx-auto mb-4" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Página em Desenvolvimento
          </h2>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            A funcionalidade de <strong>Conciliação Financeira</strong> está sendo desenvolvida e estará disponível em breve.
          </p>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
            <p className="text-blue-700 text-sm">
              Estamos trabalhando para trazer as melhores ferramentas de conciliação financeira para você!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConciliacaoFinanceira;
