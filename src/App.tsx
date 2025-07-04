
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import { JobProvider } from "@/contexts/JobContext";
import { GlobalLoadingProvider } from "@/contexts/GlobalLoadingContext";
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
        <UserProvider>
          <JobProvider>
            <GlobalLoadingProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/produtos-amazon" element={<ProdutosAmazon />} />
                <Route path="/meus-pedidos" element={<MeusPedidos />} />
                <Route path="/fornecedores" element={<Fornecedores />} />
                <Route path="/verificar-gtin" element={<VerificarGtin />} />
                <Route path="/publicar-ofertas" element={<PublicarOfertas />} />
                <Route path="/atualizacao-estoque" element={<AtualizacaoEstoque />} />
                <Route path="/deletar-ofertas" element={<DeletarOfertas />} />
                <Route path="/conciliacao-financeira" element={<ConciliacaoFinanceira />} />
                <Route path="/historico" element={<Historico />} />
                <Route path="/universidade" element={<Universidade />} />
                <Route path="/suporte" element={<Suporte />} />
                <Route path="/integracoes" element={<Integracoes />} />
                <Route path="/configuracoes" element={<Configuracoes />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </GlobalLoadingProvider>
          </JobProvider>
        </UserProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
