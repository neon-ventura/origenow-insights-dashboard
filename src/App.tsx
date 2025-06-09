
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import Index from "./pages/Index";
import ProdutosAmazon from "./pages/ProdutosAmazon";
import PublicarOfertas from "./pages/PublicarOfertas";
import VerificarGtin from "./pages/VerificarGtin";
import Universidade from "./pages/Universidade";
import AtualizacaoEstoque from "./pages/AtualizacaoEstoque";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/produtos-amazon" element={<ProdutosAmazon />} />
            <Route path="/ofertas" element={<PublicarOfertas />} />
            <Route path="/gtin" element={<VerificarGtin />} />
            <Route path="/universidade" element={<Universidade />} />
            <Route path="/estoque" element={<AtualizacaoEstoque />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
