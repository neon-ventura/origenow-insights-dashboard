
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
              <ProtectedRoute>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/produtos-amazon" element={<ProdutosAmazon />} />
                  <Route path="/pedidos" element={<MeusPedidos />} />
                  <Route path="/ofertas" element={<PublicarOfertas />} />
                  <Route path="/gtin" element={<VerificarGtin />} />
                  <Route path="/universidade" element={<Universidade />} />
                  <Route path="/estoque" element={<AtualizacaoEstoque />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ProtectedRoute>
            </BrowserRouter>
          </TooltipProvider>
        </JobProvider>
      </UserProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
