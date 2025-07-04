
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
import { Header } from "@/components/Header";
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
                      <div className="min-h-screen bg-gray-50">
                        <Header />
                        <Index />
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/produtos-amazon" element={
                    <ProtectedRoute>
                      <div className="min-h-screen bg-gray-50">
                        <Header />
                        <ProdutosAmazon />
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/meus-pedidos" element={
                    <ProtectedRoute>
                      <div className="min-h-screen bg-gray-50">
                        <Header />
                        <MeusPedidos />
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/fornecedores" element={
                    <ProtectedRoute>
                      <div className="min-h-screen bg-gray-50">
                        <Header />
                        <Fornecedores />
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/verificar-gtin" element={
                    <ProtectedRoute>
                      <div className="min-h-screen bg-gray-50">
                        <Header />
                        <VerificarGtin />
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/publicar-ofertas" element={
                    <ProtectedRoute>
                      <div className="min-h-screen bg-gray-50">
                        <Header />
                        <PublicarOfertas />
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/atualizacao-estoque" element={
                    <ProtectedRoute>
                      <div className="min-h-screen bg-gray-50">
                        <Header />
                        <AtualizacaoEstoque />
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/deletar-ofertas" element={
                    <ProtectedRoute>
                      <div className="min-h-screen bg-gray-50">
                        <Header />
                        <DeletarOfertas />
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/conciliacao-financeira" element={
                    <ProtectedRoute>
                      <div className="min-h-screen bg-gray-50">
                        <Header />
                        <ConciliacaoFinanceira />
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/historico" element={
                    <ProtectedRoute>
                      <div className="min-h-screen bg-gray-50">
                        <Header />
                        <Historico />
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/universidade" element={
                    <ProtectedRoute>
                      <div className="min-h-screen bg-gray-50">
                        <Header />
                        <Universidade />
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/suporte" element={
                    <ProtectedRoute>
                      <div className="min-h-screen bg-gray-50">
                        <Header />
                        <Suporte />
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/integracoes" element={
                    <ProtectedRoute>
                      <div className="min-h-screen bg-gray-50">
                        <Header />
                        <Integracoes />
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/configuracoes" element={
                    <ProtectedRoute>
                      <div className="min-h-screen bg-gray-50">
                        <Header />
                        <Configuracoes />
                      </div>
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
