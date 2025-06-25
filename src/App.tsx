
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import { JobProvider } from "@/contexts/JobContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import ProdutosAmazon from "./pages/ProdutosAmazon";
import PublicarOfertas from "./pages/PublicarOfertas";
import VerificarGtin from "./pages/VerificarGtin";
import Universidade from "./pages/Universidade";
import AtualizacaoEstoque from "./pages/AtualizacaoEstoque";
import MeusPedidos from "./pages/MeusPedidos";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <UserProvider>
        <JobProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Rotas protegidas */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } />
                <Route path="/produtos-amazon" element={
                  <ProtectedRoute>
                    <ProdutosAmazon />
                  </ProtectedRoute>
                } />
                <Route path="/pedidos" element={
                  <ProtectedRoute>
                    <MeusPedidos />
                  </ProtectedRoute>
                } />
                <Route path="/ofertas" element={
                  <ProtectedRoute>
                    <PublicarOfertas />
                  </ProtectedRoute>
                } />
                <Route path="/gtin" element={
                  <ProtectedRoute>
                    <VerificarGtin />
                  </ProtectedRoute>
                } />
                <Route path="/universidade" element={
                  <ProtectedRoute>
                    <Universidade />
                  </ProtectedRoute>
                } />
                <Route path="/estoque" element={
                  <ProtectedRoute>
                    <AtualizacaoEstoque />
                  </ProtectedRoute>
                } />
                
                {/* Rota raiz - não protegida, mostra login se não autenticado */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } />
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </JobProvider>
      </UserProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
