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
import AutorizacaoAmazonSucesso from "./pages/AutorizacaoAmazonSucesso";
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
                  <Route path="/autorizacao-amazon-sucesso" element={
                    <ProtectedRoute>
                      <AutorizacaoAmazonSucesso />
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
                        <LayoutWrapper component={Index} />
                      </AmazonAuthGuard>
                    </ProtectedRoute>
                  } />
                  <Route path="/produtos-amazon" element={
                    <ProtectedRoute>
                      <AmazonAuthGuard>
                        <LayoutWrapper component={ProdutosAmazon} />
                      </AmazonAuthGuard>
                    </ProtectedRoute>
                  } />
                  <Route path="/meus-pedidos" element={
                    <ProtectedRoute>
                      <AmazonAuthGuard>
                        <LayoutWrapper component={MeusPedidos} />
                      </AmazonAuthGuard>
                    </ProtectedRoute>
                  } />
                  <Route path="/fornecedores" element={
                    <ProtectedRoute>
                      <AmazonAuthGuard>
                        <LayoutWrapper component={Fornecedores} />
                      </AmazonAuthGuard>
                    </ProtectedRoute>
                  } />
                  <Route path="/verificar-gtin" element={
                    <ProtectedRoute>
                      <AmazonAuthGuard>
                        <LayoutWrapper component={VerificarGtin} />
                      </AmazonAuthGuard>
                    </ProtectedRoute>
                  } />
                  <Route path="/publicar-ofertas" element={
                    <ProtectedRoute>
                      <AmazonAuthGuard>
                        <LayoutWrapper component={PublicarOfertas} />
                      </AmazonAuthGuard>
                    </ProtectedRoute>
                  } />
                  <Route path="/atualizacao-estoque" element={
                    <ProtectedRoute>
                      <AmazonAuthGuard>
                        <LayoutWrapper component={AtualizacaoEstoque} />
                      </AmazonAuthGuard>
                    </ProtectedRoute>
                  } />
                  <Route path="/deletar-ofertas" element={
                    <ProtectedRoute>
                      <AmazonAuthGuard>
                        <LayoutWrapper component={DeletarOfertas} />
                      </AmazonAuthGuard>
                    </ProtectedRoute>
                  } />
                  <Route path="/historico" element={
                    <ProtectedRoute>
                      <AmazonAuthGuard>
                        <LayoutWrapper component={Historico} />
                      </AmazonAuthGuard>
                    </ProtectedRoute>
                  } />
                  <Route path="/universidade" element={
                    <ProtectedRoute>
                      <LayoutWrapper component={Universidade} />
                    </ProtectedRoute>
                  } />
                  <Route path="/suporte" element={
                    <ProtectedRoute>
                      <LayoutWrapper component={Suporte} />
                    </ProtectedRoute>
                  } />
                  <Route path="/integracoes" element={
                    <ProtectedRoute>
                      <LayoutWrapper component={Integracoes} />
                    </ProtectedRoute>
                  } />
                  <Route path="/configuracoes" element={
                    <ProtectedRoute>
                      <LayoutWrapper component={Configuracoes} />
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

// Componente wrapper para lidar com páginas que podem ou não ter barra de ações
const LayoutWrapper = ({ component: Component }: { component: React.ComponentType }) => {
  const result = Component({});
  
  // Se o componente retorna um objeto com content e actionBar, usa ambos
  if (result && typeof result === 'object' && 'content' in result) {
    return (
      <Layout actionBar={result.actionBar}>
        {result.content}
      </Layout>
    );
  }
  
  // Caso contrário, trata como JSX normal sem barra de ações
  return (
    <Layout>
      {result}
    </Layout>
  );
};

export default App;
