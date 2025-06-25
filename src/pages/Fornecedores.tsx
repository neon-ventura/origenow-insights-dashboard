
import React, { useState } from 'react';
import { DraggableSidebar } from '@/components/DraggableSidebar';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Fornecedores = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      <DraggableSidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
      
      <div className="flex-1 transition-all duration-300" style={{ marginLeft: isSidebarCollapsed ? '88px' : '256px' }}>
        <Header />
        
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-600" />
                Fornecedores
              </h1>
              <p className="text-gray-600 mt-2">
                Gerencie seus fornecedores e parcerias comerciais
              </p>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Buscar fornecedores..." 
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filtros
                </Button>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Fornecedor
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total de Fornecedores</CardDescription>
                  <CardTitle className="text-2xl">47</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Fornecedores Ativos</CardDescription>
                  <CardTitle className="text-2xl text-green-600">42</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Pendentes</CardDescription>
                  <CardTitle className="text-2xl text-yellow-600">3</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Inativos</CardDescription>
                  <CardTitle className="text-2xl text-red-600">2</CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Main Content */}
            <Card>
              <CardHeader>
                <CardTitle>Lista de Fornecedores</CardTitle>
                <CardDescription>
                  Visualize e gerencie todos os seus fornecedores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum fornecedor encontrado
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Comece adicionando seu primeiro fornecedor
                  </p>
                  <Button className="flex items-center gap-2 mx-auto">
                    <Plus className="h-4 w-4" />
                    Adicionar Primeiro Fornecedor
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Fornecedores;
