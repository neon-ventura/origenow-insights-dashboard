import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserContext } from '@/contexts/UserContext';
import { EmailVerificationAlert } from './EmailVerificationAlert';
import { ApiNotifications } from './ApiNotifications';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast"
import { ModeToggle } from './ModeToggle';
import { AlignJustify, Settings, Bell, Copy } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';

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
  const { user, currentUser, logout } = useAuth();
  const { selectedUser } = useUserContext();
  const { toast } = useToast()
  const navigate = useNavigate();
  const location = useLocation();
  const { data: notifications = [] } = useNotifications();

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

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copiado!",
        description: `${label} foi copiado para a área de transferência.`,
      });
    }).catch(() => {
      toast({
        title: "Erro",
        description: "Não foi possível copiar para a área de transferência.",
        variant: "destructive",
      });
    });
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
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => navigate('/configuracoes')}
                    className="h-9 w-9 border"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Configurações</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="icon" className="h-9 w-9 relative border">
                        <Bell className="h-4 w-4" />
                        {notifications.length > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {notifications.length}
                          </span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0" align="end">
                      <ApiNotifications sellerId={currentUser?.sellerId || null} />
                    </PopoverContent>
                  </Popover>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Notificações</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <ModeToggle />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Alternar tema</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <div className="flex items-center space-x-3">
              <div className="text-right text-sm space-y-0">
                <div className="font-medium text-gray-900">{currentUser?.nickname || "Usuário"}</div>
                <div 
                  className="text-gray-500 cursor-pointer hover:text-gray-700 flex items-center space-x-1"
                  onClick={() => copyToClipboard(currentUser?.sellerId || "", "Seller ID")}
                  title="Clique para copiar"
                >
                  <span>{currentUser?.sellerId || "ID não disponível"}</span>
                  <Copy className="h-3 w-3" />
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://github.com/shadcn.png" alt={currentUser?.user || "Avatar"} />
                      <AvatarFallback>{currentUser?.user?.charAt(0).toUpperCase() || "US"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel>{currentUser?.user || "Usuário"}</DropdownMenuLabel>
                  <DropdownMenuLabel className="font-normal text-sm text-muted-foreground -mt-1">{currentUser?.email || "Email não disponível"}</DropdownMenuLabel>
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
        </div>
      </header>
    </div>
  );
};
