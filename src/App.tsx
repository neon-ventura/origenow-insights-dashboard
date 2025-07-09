import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient } from '@/lib/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { Layout } from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import Products from '@/pages/Products';
import Orders from '@/pages/Orders';
import Customers from '@/pages/Customers';
import Settings from '@/pages/Settings';
import Login from '@/pages/Login';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserProvider } from '@/contexts/UserContext';
import { GlobalLoadingProvider } from '@/contexts/GlobalLoadingContext';
import { JobContextProvider } from '@/contexts/JobContext';
import { Toaster } from '@/components/ui/toaster';
import ApiNotifications from '@/components/ApiNotifications';
import Fornecedores from '@/pages/Fornecedores';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('accessToken');

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

function App() {
  const [actionBarProps, setActionBarProps] = useState<any>(null);

  return (
    <QueryClientProvider client={new QueryClient()}>
      <BrowserRouter>
        <UserProvider>
          <AuthProvider>
            <GlobalLoadingProvider>
              <JobContextProvider>
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
                      path="/customers"
                      element={
                        <ProtectedRoute>
                          <Customers />
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
                <ApiNotifications />
              </JobContextProvider>
            </GlobalLoadingProvider>
          </AuthProvider>
        </UserProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
