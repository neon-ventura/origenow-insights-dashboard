
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { UserProvider } from "@/contexts/UserContext";
import { JobProvider } from "@/contexts/JobContext";
import { GlobalLoadingProvider } from "@/contexts/GlobalLoadingContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AmazonAuthGuard } from "@/components/AmazonAuthGuard";
import { Login } from "@/components/Login";
import { Register } from "@/components/Register";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import ProdutosAmazon from "./pages/ProdutosAmazon";
import MeusPedidos from "./pages/MeusPedidos";
import Fornecedores from "./pages/Fornecedores";
import AtualizacaoEstoque from "./pages/AtualizacaoEstoque";
import VerificarGtin from "./pages/VerificarGtin";
import PublicarOfertas from "./pages/PublicarOfertas";
import Historico from "./pages/Historico";
import Universidade from "./pages/Universidade";
import Suporte from "./pages/Suporte";
import Integracoes from "./pages/Integracoes";
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";
import DeletarOfertas from "./pages/DeletarOfertas";
import AutorizacaoAmazon from "./pages/AutorizacaoAmazon";
import Planos from "./pages/Planos";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <UserProvider>
            <JobProvider>
              <GlobalLoadingProvider>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/autorizacao-amazon" element={
                    <ProtectedRoute>
                      <AutorizacaoAmazon />
                    </ProtectedRoute>
                  } />
                  <Route path="/planos" element={
                    <ProtectedRoute>
                      <Planos />
                    </ProtectedRoute>
                  } />
                  <Route path="/" element={
                    <ProtectedRoute>
                      <AmazonAuthGuard>
                        <Layout>
                          <Index />
                        </Layout>
                      </AmazonAuthGuard>
                    </ProtectedRoute>
                  } />
                  <Route path="/produtos-amazon" element={
                    <ProtectedRoute>
                      <AmazonAuthGuard>
                        <Layout>
                          <ProdutosAmazon />
                        </Layout>
                      </AmazonAuthGuard>
                    </ProtectedRoute>
                  } />
                  <Route path="/meus-pedidos" element={
                    <ProtectedRoute>
                      <AmazonAuthGuard>
                        <Layout>
                          <MeusPedidos />
                        </Layout>
                      </AmazonAuthGuard>
                    </ProtectedRoute>
                  } />
                  <Route path="/fornecedores" element={
                    <ProtectedRoute>
                      <AmazonAuthGuard>
                        <Layout>
                          <Fornecedores />
                        </Layout>
                      </AmazonAuthGuard>
                    </ProtectedRoute>
                  } />
                  <Route path="/verificar-gtin" element={
                    <ProtectedRoute>
                      <AmazonAuthGuard>
                        <Layout>
                          <VerificarGtin />
                        </Layout>
                      </AmazonAuthGuard>
                    </ProtectedRoute>
                  } />
                  <Route path="/publicar-ofertas" element={
                    <ProtectedRoute>
                      <AmazonAuthGuard>
                        <Layout>
                          <PublicarOfertas />
                        </Layout>
                      </AmazonAuthGuard>
                    </ProtectedRoute>
                  } />
                  <Route path="/atualizacao-estoque" element={
                    <ProtectedRoute>
                      <AmazonAuthGuard>
                        <Layout>
                          <AtualizacaoEstoque />
                        </Layout>
                      </AmazonAuthGuard>
                    </ProtectedRoute>
                  } />
                  <Route path="/deletar-ofertas" element={
                    <ProtectedRoute>
                      <AmazonAuthGuard>
                        <Layout>
                          <DeletarOfertas />
                        </Layout>
                      </AmazonAuthGuard>
                    </ProtectedRoute>
                  } />
                  <Route path="/historico" element={
                    <ProtectedRoute>
                      <AmazonAuthGuard>
                        <Layout>
                          <Historico />
                        </Layout>
                      </AmazonAuthGuard>
                    </ProtectedRoute>
                  } />
                  <Route path="/universidade" element={
                    <ProtectedRoute>
                      <Layout>
                        <Universidade />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  <Route path="/suporte" element={
                    <ProtectedRoute>
                      <Layout>
                        <Suporte />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  <Route path="/integracoes" element={
                    <ProtectedRoute>
                      <Layout>
                        <Integracoes />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  <Route path="/configuracoes" element={
                    <ProtectedRoute>
                      <Layout>
                        <Configuracoes />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </GlobalLoadingProvider>
            </JobProvider>
          </UserProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
