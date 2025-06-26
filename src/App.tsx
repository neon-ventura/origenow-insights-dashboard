
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { UserProvider } from "@/contexts/UserContext";
import { JobProvider } from "@/contexts/JobContext";
import { GlobalLoadingProvider } from "@/contexts/GlobalLoadingContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "@/components/Login";
import Index from "./pages/Index";
import ProdutosAmazon from "./pages/ProdutosAmazon";
import MeusPedidos from "./pages/MeusPedidos";
import Fornecedores from "./pages/Fornecedores";
import AtualizacaoEstoque from "./pages/AtualizacaoEstoque";
import VerificarGtin from "./pages/VerificarGtin";
import PublicarOfertas from "./pages/PublicarOfertas";
import Historico from "./pages/Historico";
import Universidade from "./pages/Universidade";
import NotFound from "./pages/NotFound";

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
                  <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                  <Route path="/produtos-amazon" element={<ProtectedRoute><ProdutosAmazon /></ProtectedRoute>} />
                  <Route path="/meus-pedidos" element={<ProtectedRoute><MeusPedidos /></ProtectedRoute>} />
                  <Route path="/fornecedores" element={<ProtectedRoute><Fornecedores /></ProtectedRoute>} />
                  <Route path="/atualizacao-estoque" element={<ProtectedRoute><AtualizacaoEstoque /></ProtectedRoute>} />
                  <Route path="/verificar-gtin" element={<ProtectedRoute><VerificarGtin /></ProtectedRoute>} />
                  <Route path="/publicar-ofertas" element={<ProtectedRoute><PublicarOfertas /></ProtectedRoute>} />
                  <Route path="/historico" element={<ProtectedRoute><Historico /></ProtectedRoute>} />
                  <Route path="/universidade" element={<ProtectedRoute><Universidade /></ProtectedRoute>} />
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
