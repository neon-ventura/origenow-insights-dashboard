
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserProvider } from '@/contexts/UserContext';
import { JobProvider } from '@/contexts/JobContext';
import { GlobalLoadingProvider } from '@/contexts/GlobalLoadingContext';
import { GlobalLoadingModal } from '@/components/GlobalLoadingModal';
import { useGlobalLoading } from '@/contexts/GlobalLoadingContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProtectedRoute from '@/components/ProtectedRoute';
import Login from '@/components/Login';
import Index from '@/pages/Index';
import ProdutosAmazon from '@/pages/ProdutosAmazon';
import MeusPedidos from '@/pages/MeusPedidos';
import Universidade from '@/pages/Universidade';
import VerificarGtin from '@/pages/VerificarGtin';
import PublicarOfertas from '@/pages/PublicarOfertas';
import AtualizacaoEstoque from '@/pages/AtualizacaoEstoque';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

const AppContent = () => {
  const { isLoading, title, description } = useGlobalLoading();
  
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        } />
        <Route path="/produtos-amazon" element={
          <ProtectedRoute>
            <ProdutosAmazon />
          </ProtectedRoute>
        } />
        <Route path="/meus-pedidos" element={
          <ProtectedRoute>
            <MeusPedidos />
          </ProtectedRoute>
        } />
        <Route path="/universidade" element={
          <ProtectedRoute>
            <Universidade />
          </ProtectedRoute>
        } />
        <Route path="/verificar-gtin" element={
          <ProtectedRoute>
            <VerificarGtin />
          </ProtectedRoute>
        } />
        <Route path="/publicar-ofertas" element={
          <ProtectedRoute>
            <PublicarOfertas />
          </ProtectedRoute>
        } />
        <Route path="/atualizacao-estoque" element={
          <ProtectedRoute>
            <AtualizacaoEstoque />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <GlobalLoadingModal 
        isOpen={isLoading}
        title={title}
        description={description}
      />
    </>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="app-theme">
        <AuthProvider>
          <UserProvider>
            <JobProvider>
              <GlobalLoadingProvider>
                <Router>
                  <AppContent />
                  <Toaster />
                </Router>
              </GlobalLoadingProvider>
            </JobProvider>
          </UserProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
