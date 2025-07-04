
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
import ConciliacaoFinanceira from "./pages/ConciliacaoFinanceira";

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
                  <Route path="/" element={
                    <ProtectedRoute>
                      <Layout>
                        <Index />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  <Route path="/produtos-amazon" element={
                    <ProtectedRoute>
                      <Layout>
                        <ProdutosAmazon />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  <Route path="/meus-pedidos" element={
                    <ProtectedRoute>
                      <Layout>
                        <MeusPedidos />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  <Route path="/fornecedores" element={
                    <ProtectedRoute>
                      <Layout>
                        <Fornecedores />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  <Route path="/verificar-gtin" element={
                    <ProtectedRoute>
                      <Layout>
                        <VerificarGtin />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  <Route path="/publicar-ofertas" element={
                    <ProtectedRoute>
                      <Layout>
                        <PublicarOfertas />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  <Route path="/atualizacao-estoque" element={
                    <ProtectedRoute>
                      <Layout>
                        <AtualizacaoEstoque />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  <Route path="/deletar-ofertas" element={
                    <ProtectedRoute>
                      <Layout>
                        <DeletarOfertas />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  <Route path="/conciliacao-financeira" element={
                    <ProtectedRoute>
                      <Layout>
                        <ConciliacaoFinanceira />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  <Route path="/historico" element={
                    <ProtectedRoute>
                      <Layout>
                        <Historico />
                      </Layout>
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
