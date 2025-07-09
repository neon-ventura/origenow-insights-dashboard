
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from '@/components/Layout';
import Dashboard from '@/pages/Index';
import Products from '@/pages/ProdutosAmazon';
import Orders from '@/pages/MeusPedidos';
import Settings from '@/pages/Configuracoes';
import { Login } from '@/components/Login';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserProvider } from '@/contexts/UserContext';
import { GlobalLoadingProvider } from '@/contexts/GlobalLoadingContext';
import { JobProvider } from '@/contexts/JobContext';
import { Toaster } from '@/components/ui/toaster';
import { ApiNotifications } from '@/components/ApiNotifications';
import Fornecedores from '@/pages/Fornecedores';

console.log('App: Starting application initialization');

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('accessToken');
  console.log('ProtectedRoute: isAuthenticated:', !!isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

function App() {
  console.log('App: Component rendering');
  const [actionBarProps, setActionBarProps] = useState<any>(null);

  const queryClient = new QueryClient();
  console.log('App: QueryClient created');

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <UserProvider>
          <AuthProvider>
            <GlobalLoadingProvider>
              <JobProvider>
                <Layout actionBar={actionBarProps}>
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route
                      path="/"
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/products"
                      element={
                        <ProtectedRoute>
                          <Products />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/orders"
                      element={
                        <ProtectedRoute>
                          <Orders />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/settings"
                      element={
                        <ProtectedRoute>
                          <Settings />
                        </ProtectedRoute>
                      }
                    />
                    <Route 
                      path="/fornecedores" 
                      element={
                        <ProtectedRoute>
                          <Fornecedores onActionBarPropsChange={setActionBarProps} />
                        </ProtectedRoute>
                      } 
                    />
                  </Routes>
                </Layout>
                <Toaster />
                <ApiNotifications sellerId={null} />
              </JobProvider>
            </GlobalLoadingProvider>
          </AuthProvider>
        </UserProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

console.log('App: Component defined');

export default App;
