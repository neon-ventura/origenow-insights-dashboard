
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserContext } from '@/contexts/UserContext';
import { EmailVerificationAlert } from './EmailVerificationAlert';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast"
import { ModeToggle } from './ModeToggle';
import { AlignJustify } from 'lucide-react';

interface HeaderProps {
  sidebarWidth?: number;
}

const routeLabels: Record<string, string> = {
  '/': 'Página Inicial',
  '/produtos-amazon': 'Produtos Amazon',
  '/meus-pedidos': 'Meus Pedidos',
  '/fornecedores': 'Fornecedores',
  '/verificar-gtin': 'Verificar GTIN',
  '/publicar-ofertas': 'Publicar Ofertas',
  '/atualizacao-estoque': 'Atualização de Estoque',
  '/deletar-ofertas': 'Deletar Ofertas',
  '/conciliacao-financeira': 'Conciliação Financeira',
  '/historico': 'Histórico',
  '/universidade': 'Universidade',
  '/suporte': 'Suporte',
  '/integracoes': 'Integrações',
  '/configuracoes': 'Configurações',
};

export const Header = ({ sidebarWidth = 256 }: HeaderProps) => {
  const { user, logout } = useAuth();
  const { selectedUser } = useUserContext();
  const { toast } = useToast()
  const navigate = useNavigate();
  const location = useLocation();

  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ path: '/', label: 'Início' }];

    let currentPath = '';
    pathSegments.forEach(segment => {
      currentPath += `/${segment}`;
      const label = routeLabels[currentPath] || segment;
      breadcrumbs.push({ path: currentPath, label });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="w-full">
      <EmailVerificationAlert />
      <header 
        className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 fixed top-0 right-0 z-50 transition-all duration-300"
        style={{ 
          left: `${sidebarWidth}px`,
          marginTop: '0px'
        }}
      >
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex items-center justify-between">
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((breadcrumb, index) => (
                  <React.Fragment key={breadcrumb.path}>
                    <BreadcrumbItem>
                      {index === breadcrumbs.length - 1 ? (
                        <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink 
                          onClick={() => navigate(breadcrumb.path)}
                          className="cursor-pointer"
                        >
                          {breadcrumb.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <AlignJustify className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="sm:w-64">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Opções de navegação
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <Button variant="outline" onClick={() => navigate('/')}>Página Inicial</Button>
                  <Button variant="outline" onClick={() => navigate('/produtos-amazon')}>Produtos Amazon</Button>
                  <Button variant="outline" onClick={() => navigate('/meus-pedidos')}>Meus Pedidos</Button>
                  <Button variant="outline" onClick={() => navigate('/fornecedores')}>Fornecedores</Button>
                  <Button variant="outline" onClick={() => navigate('/verificar-gtin')}>Verificar GTIN</Button>
                  <Button variant="outline" onClick={() => navigate('/publicar-ofertas')}>Publicar Ofertas</Button>
                  <Button variant="outline" onClick={() => navigate('/atualizacao-estoque')}>Atualização de Estoque</Button>
                  <Button variant="outline" onClick={() => navigate('/deletar-ofertas')}>Deletar Ofertas</Button>
                  <Button variant="outline" onClick={() => navigate('/conciliacao-financeira')}>Conciliação Financeira</Button>
                  <Button variant="outline" onClick={() => navigate('/historico')}>Histórico</Button>
                  <Button variant="outline" onClick={() => navigate('/universidade')}>Universidade</Button>
                  <Button variant="outline" onClick={() => navigate('/suporte')}>Suporte</Button>
                  <Button variant="outline" onClick={() => navigate('/integracoes')}>Integrações</Button>
                  <Button variant="outline" onClick={() => navigate('/configuracoes')}>Configurações</Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://github.com/shadcn.png" alt={user?.user || "Avatar"} />
                    <AvatarFallback>{user?.user?.charAt(0).toUpperCase() || "US"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>Olá, {user?.user || "Usuário"}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/configuracoes')}>
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  logout();
                  navigate('/login');
                  toast({
                    title: "Logout realizado!",
                    description: "Você foi redirecionado para a página de login.",
                  })
                }}
                >
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </div>
  );
};
