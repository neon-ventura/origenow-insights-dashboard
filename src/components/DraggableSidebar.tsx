
import React, { useState, useRef, useEffect } from 'react';
import { 
  BarChart3, 
  Package, 
  Users, 
  RefreshCw, 
  Search, 
  Upload, 
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  LogOut,
  FileText,
  History,
  Trash2,
  Plug,
  Settings,
  ShoppingCart,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { useUserContext } from '@/contexts/UserContext';
import { useAuth } from '@/contexts/AuthContext';
import { AccountSelector } from './AccountSelector';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DraggableSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  { icon: BarChart3, label: 'Dashboard', path: '/', active: false },
  { icon: Package, label: 'Meus Anúncios', path: '/produtos-amazon', active: false },
  { icon: ShoppingCart, label: 'Meus Pedidos', path: '/meus-pedidos', active: false },
  { icon: Users, label: 'Fornecedores', path: '/fornecedores', active: false },
  { icon: Search, label: 'Verificar GTIN', path: '/verificar-gtin', active: false },
  { icon: Upload, label: 'Publicar Anúncios', path: '/publicar-ofertas', active: false },
  { icon: RefreshCw, label: 'Atualização de Estoque', path: '/atualizacao-estoque', active: false },
  { icon: Trash2, label: 'Deletar Anúncios', path: '/deletar-ofertas', active: false },
  { icon: History, label: 'Histórico', path: '/historico', active: false },
  { icon: GraduationCap, label: 'Tutoriais e Guias', path: '/universidade', active: false },
];

// Componente SVG customizado para quando o sidebar estiver expandido
const ExpandedLogo = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="80" 
    height="50" 
    viewBox="0 0 60 37.5" 
    preserveAspectRatio="xMidYMid meet"
    className="h-14 w-auto"
    style={{ marginRight: '110px' }}
  >
    <defs>
      <clipPath id="9f4b6143b8">
        <path d="M 46.964844 26.566406 L 53.949219 26.566406 L 53.949219 29.046875 L 46.964844 29.046875 Z M 46.964844 26.566406 "/>
      </clipPath>
    </defs>
    <g>
      <g style={{fill: '#ffffff', fillOpacity: 1}}>
        <g transform="translate(0.394737, 24.132936)">
          <path style={{stroke: 'none'}} d="M 13.59375 -4.5625 C 13.59375 -4 13.726562 -3.53125 14 -3.15625 C 14.269531 -2.789062 14.597656 -2.503906 14.984375 -2.296875 L 13.40625 0.21875 C 12.925781 0.175781 12.457031 0.0664062 12 -0.109375 C 11.539062 -0.296875 11.125 -0.613281 10.75 -1.0625 C 10.320312 -0.738281 9.789062 -0.4375 9.15625 -0.15625 C 8.519531 0.125 7.757812 0.265625 6.875 0.265625 C 5.800781 0.265625 4.796875 0.03125 3.859375 -0.4375 C 2.921875 -0.914062 2.164062 -1.625 1.59375 -2.5625 C 1.03125 -3.5 0.75 -4.644531 0.75 -6 C 0.75 -7.300781 1.035156 -8.414062 1.609375 -9.34375 C 2.191406 -10.28125 2.945312 -10.992188 3.875 -11.484375 C 4.800781 -11.984375 5.800781 -12.234375 6.875 -12.234375 C 7.695312 -12.234375 8.445312 -12.101562 9.125 -11.84375 C 9.800781 -11.59375 10.363281 -11.273438 10.8125 -10.890625 L 11.46875 -11.828125 L 13.59375 -11.828125 Z M 7.5 -2.6875 C 8.050781 -2.6875 8.5 -2.773438 8.84375 -2.953125 C 9.195312 -3.140625 9.566406 -3.375 9.953125 -3.65625 L 9.953125 -8.5 C 9.628906 -8.726562 9.265625 -8.914062 8.859375 -9.0625 C 8.460938 -9.21875 8.007812 -9.296875 7.5 -9.296875 C 6.550781 -9.296875 5.804688 -8.972656 5.265625 -8.328125 C 4.722656 -7.679688 4.453125 -6.882812 4.453125 -5.9375 C 4.453125 -5.039062 4.722656 -4.273438 5.265625 -3.640625 C 5.804688 -3.003906 6.550781 -2.6875 7.5 -2.6875 Z M 7.5 -2.6875 "/>
        </g>
      </g>
      <g style={{fill: '#ffffff', fillOpacity: 1}}>
        <g transform="translate(15.074776, 24.132936)">
          <path style={{stroke: 'none'}} d="M 7.921875 -12.234375 C 9.597656 -12.234375 10.976562 -11.703125 12.0625 -10.640625 C 13.15625 -9.578125 13.703125 -8.03125 13.703125 -6 L 13.703125 0 L 10.078125 0 L 10.078125 -5.9375 C 10.078125 -6.863281 9.851562 -7.65625 9.40625 -8.3125 C 8.96875 -8.96875 8.273438 -9.296875 7.328125 -9.296875 C 6.921875 -9.296875 6.488281 -9.210938 6.03125 -9.046875 C 5.582031 -8.890625 5.1875 -8.6875 4.84375 -8.4375 L 4.84375 0 L 1.203125 0 L 1.203125 -11.828125 L 3.265625 -11.828125 L 4 -10.6875 C 4.582031 -11.269531 5.222656 -11.671875 5.921875 -11.890625 C 6.628906 -12.117188 7.296875 -12.234375 7.921875 -12.234375 Z M 7.921875 -12.234375 "/>
        </g>
      </g>
      <g style={{fill: '#ffffff', fillOpacity: 1}}>
        <g transform="translate(29.240255, 24.132936)">
          <path style={{stroke: 'none'}} d="M 10.625 -11.828125 L 14.796875 -11.828125 L 10.015625 0 C 9.671875 0.84375 9.226562 1.660156 8.6875 2.453125 C 8.144531 3.253906 7.460938 3.953125 6.640625 4.546875 C 5.828125 5.148438 4.820312 5.59375 3.625 5.875 L 2.171875 3.328125 C 3.160156 3.109375 3.957031 2.753906 4.5625 2.265625 C 5.175781 1.785156 5.703125 1.171875 6.140625 0.421875 L 0.515625 -11.828125 L 4.75 -11.828125 L 7.875 -3.78125 Z M 10.625 -11.828125 "/>
        </g>
      </g>
      <g style={{fill: '#ffffff', fillOpacity: 1}}>
        <g transform="translate(43.799222, 24.132936)">
          <path style={{stroke: 'none'}} d="M 12.71875 -6.265625 L 12.71875 -5.484375 L 4.78125 -3.90625 C 5.0625 -3.519531 5.414062 -3.210938 5.84375 -2.984375 C 6.28125 -2.753906 6.804688 -2.640625 7.421875 -2.640625 C 8.097656 -2.640625 8.695312 -2.734375 9.21875 -2.921875 C 9.75 -3.109375 10.269531 -3.382812 10.78125 -3.75 L 12.234375 -1.484375 C 11.484375 -0.878906 10.703125 -0.4375 9.890625 -0.15625 C 9.085938 0.125 8.265625 0.265625 7.421875 0.265625 C 6.085938 0.265625 4.921875 0.0078125 3.921875 -0.5 C 2.921875 -1.007812 2.140625 -1.734375 1.578125 -2.671875 C 1.023438 -3.609375 0.75 -4.707031 0.75 -5.96875 C 0.75 -7.269531 1.019531 -8.382812 1.5625 -9.3125 C 2.113281 -10.25 2.835938 -10.96875 3.734375 -11.46875 C 4.628906 -11.976562 5.613281 -12.234375 6.6875 -12.234375 C 8 -12.234375 9.101562 -11.953125 10 -11.390625 C 10.894531 -10.835938 11.570312 -10.109375 12.03125 -9.203125 C 12.488281 -8.296875 12.71875 -7.316406 12.71875 -6.265625 Z M 6.875 -9.328125 C 6.144531 -9.328125 5.53125 -9.082031 5.03125 -8.59375 C 4.539062 -8.113281 4.265625 -7.445312 4.203125 -6.59375 L 9.359375 -7.625 C 8.972656 -8.757812 8.144531 -9.328125 6.875 -9.328125 Z M 6.875 -9.328125 "/>
        </g>
      </g>
      <g clipRule="nonzero" clipPath="url(#9f4b6143b8)">
        <path style={{stroke: 'none', fillRule: 'nonzero', fill: '#ffffff', fillOpacity: 1}} d="M 53.925781 27.804688 C 53.925781 28.480469 53.378906 29.027344 52.703125 29.027344 L 48.183594 29.027344 C 47.511719 29.03125 46.964844 28.480469 46.964844 27.804688 C 46.964844 27.128906 47.511719 26.585938 48.183594 26.585938 L 52.699219 26.585938 C 53.378906 26.585938 53.925781 27.128906 53.925781 27.804688 Z M 53.925781 27.804688 "/>
      </g>
    </g>
  </svg>
);

// Componente SVG customizado para quando o sidebar estiver colapsado
const CollapsedLogo = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="32" 
    height="32" 
    viewBox="0 0 375 374.999991" 
    preserveAspectRatio="xMidYMid meet"
    className="w-8 h-8"
  >
    <defs>
      <clipPath id="a403a4aaf5">
        <path d="M 112.261719 316.242188 L 266.339844 316.242188 L 266.339844 370.832031 L 112.261719 370.832031 Z M 112.261719 316.242188 "/>
      </clipPath>
    </defs>
    <g>
      <g style={{fill: '#ffffff', fillOpacity: 1}}>
        <g transform="translate(33.759934, 262.716431)">
          <path style={{stroke: 'none'}} d="M 279.4375 -137.71875 L 279.4375 -120.421875 L 105.125 -85.828125 C 111.332031 -77.398438 119.203125 -70.632812 128.734375 -65.53125 C 138.273438 -60.4375 149.695312 -57.890625 163 -57.890625 C 178.082031 -57.890625 191.390625 -59.992188 202.921875 -64.203125 C 214.453125 -68.421875 225.765625 -74.519531 236.859375 -82.5 L 268.796875 -32.59375 C 252.378906 -19.289062 235.300781 -9.535156 217.5625 -3.328125 C 199.820312 2.878906 181.632812 5.984375 163 5.984375 C 133.726562 5.984375 108.113281 0.332031 86.15625 -10.96875 C 64.195312 -22.28125 47.117188 -38.25 34.921875 -58.875 C 22.734375 -79.5 16.640625 -103.5625 16.640625 -131.0625 C 16.640625 -159.894531 22.625 -184.515625 34.59375 -204.921875 C 46.570312 -225.328125 62.429688 -241.070312 82.171875 -252.15625 C 101.910156 -263.25 123.53125 -268.796875 147.03125 -268.796875 C 175.863281 -268.796875 200.148438 -262.695312 219.890625 -250.5 C 239.628906 -238.300781 254.488281 -222.21875 264.46875 -202.25 C 274.445312 -182.289062 279.4375 -160.78125 279.4375 -137.71875 Z M 151.03125 -204.921875 C 135.0625 -204.921875 121.644531 -199.597656 110.78125 -188.953125 C 99.914062 -178.304688 93.816406 -163.671875 92.484375 -145.046875 L 205.59375 -167.65625 C 197.15625 -192.5 178.96875 -204.921875 151.03125 -204.921875 Z M 151.03125 -204.921875 "/>
        </g>
      </g>
      <g clipRule="nonzero" clipPath="url(#a403a4aaf5)">
        <path style={{stroke: 'none', fillRule: 'nonzero', fill: '#ffffff', fillOpacity: 1}} d="M 266.339844 343.484375 C 266.339844 358.359375 254.273438 370.359375 239.320312 370.359375 L 139.285156 370.359375 C 124.328125 370.460938 112.261719 358.359375 112.261719 343.484375 C 112.261719 328.609375 124.328125 316.609375 139.285156 316.609375 L 239.214844 316.609375 C 254.273438 316.609375 266.339844 328.609375 266.339844 343.484375 Z M 266.339844 343.484375 "/>
      </g>
    </g>
  </svg>
);

export const DraggableSidebar = ({ isCollapsed, onToggle }: DraggableSidebarProps) => {
  const location = useLocation();
  const { selectedUser } = useUserContext();
  const { logout } = useAuth();
  const [sidebarWidth, setSidebarWidth] = useState(isCollapsed ? 88 : 256);
  const [toggleButtonPosition, setToggleButtonPosition] = useState(50);
  const [isDraggingToggle, setIsDraggingToggle] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSidebarWidth(isCollapsed ? 88 : 256);
  }, [isCollapsed]);

  const handleToggleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingToggle(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingToggle) {
        const newPosition = Math.max(10, Math.min(90, (e.clientY / window.innerHeight) * 100));
        setToggleButtonPosition(newPosition);
      }
    };

    const handleMouseUp = () => {
      setIsDraggingToggle(false);
    };

    if (isDraggingToggle) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingToggle]);

  const handleLogout = () => {
    logout();
  };

  return (
    <TooltipProvider>
      <div className="relative">
        <div 
          ref={sidebarRef}
          className="bg-slate-900 text-white transition-all duration-300 flex flex-col fixed left-0 top-0 h-screen z-40 overflow-y-auto"
          style={{ width: `${sidebarWidth}px` }}
        >
          {/* Header */}
          <div className="p-4 flex items-center justify-center border-b border-slate-700 min-h-[73px] flex-shrink-0">
            {sidebarWidth > 120 ? (
              <div className="flex items-center justify-center w-full">
                <ExpandedLogo />
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <CollapsedLogo />
              </div>
            )}
          </div>

          {/* Menu Items - scrollable area */}
          <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
            {/* Seletor de conta logo acima do Dashboard */}
            {sidebarWidth > 120 && (
              <div className="mb-3">
                <AccountSelector />
              </div>
            )}
            
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              
              const menuButton = (
                <Link
                  key={index}
                  to={item.path}
                  className={cn(
                    "flex items-center p-2.5 rounded-lg cursor-pointer transition-colors relative",
                    isActive 
                      ? "bg-blue-600 text-white" 
                      : "hover:bg-slate-700 text-slate-300",
                    sidebarWidth <= 120 && "justify-center"
                  )}
                >
                  <item.icon size={sidebarWidth <= 120 ? 22 : 18} />
                  {sidebarWidth > 120 && (
                    <span className="ml-3 font-medium text-sm whitespace-nowrap">{item.label}</span>
                  )}
                </Link>
              );

              // Se o sidebar estiver colapsado, envolva com Tooltip
              if (sidebarWidth <= 120) {
                return (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      {menuButton}
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-slate-800 text-white border-slate-600">
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return menuButton;
            })}
          </nav>

          {/* Footer - Action Buttons */}
          <div className="p-3 border-t border-slate-700 space-y-1.5 flex-shrink-0">
            {/* Integrações */}
            {sidebarWidth <= 120 ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to="/integracoes"
                    className="flex items-center w-full p-2.5 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors text-slate-300 hover:text-white justify-center"
                  >
                    <Plug size={22} />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-slate-800 text-white border-slate-600">
                  <p>Integrações</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Link
                to="/integracoes"
                className="flex items-center w-full p-2.5 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors text-slate-300 hover:text-white space-x-3"
              >
                <Plug size={18} />
                <span className="font-medium text-sm">Integrações</span>
              </Link>
            )}

            {/* Configurações */}
            {sidebarWidth <= 120 ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to="/configuracoes"
                    className={cn(
                      "flex items-center w-full p-2.5 rounded-lg cursor-pointer transition-colors justify-center",
                      location.pathname === '/configuracoes' 
                        ? "bg-blue-600 text-white" 
                        : "hover:bg-slate-700 text-slate-300 hover:text-white"
                    )}
                  >
                    <Settings size={22} />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-slate-800 text-white border-slate-600">
                  <p>Configurações</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Link
                to="/configuracoes"
                className={cn(
                  "flex items-center w-full p-2.5 rounded-lg cursor-pointer transition-colors space-x-3",
                  location.pathname === '/configuracoes' 
                    ? "bg-blue-600 text-white" 
                    : "hover:bg-slate-700 text-slate-300 hover:text-white"
                )}
              >
                <Settings size={18} />
                <span className="font-medium text-sm">Configurações</span>
              </Link>
            )}

            {/* Suporte */}
            {sidebarWidth <= 120 ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to="/suporte"
                    className={cn(
                      "flex items-center w-full p-2.5 rounded-lg cursor-pointer transition-colors justify-center",
                      location.pathname === '/suporte' 
                        ? "bg-blue-600 text-white" 
                        : "hover:bg-slate-700 text-slate-300 hover:text-white"
                    )}
                  >
                    <HelpCircle size={22} />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-slate-800 text-white border-slate-600">
                  <p>Suporte</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Link
                to="/suporte"
                className={cn(
                  "flex items-center w-full p-2.5 rounded-lg cursor-pointer transition-colors space-x-3",
                  location.pathname === '/suporte' 
                    ? "bg-blue-600 text-white" 
                    : "hover:bg-slate-700 text-slate-300 hover:text-white"
                )}
              >
                <HelpCircle size={18} />
                <span className="font-medium text-sm">Suporte</span>
              </Link>
            )}

            {/* Logout Button */}
            {sidebarWidth <= 120 ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full p-2.5 rounded-lg cursor-pointer hover:bg-red-600 transition-colors text-slate-300 hover:text-white justify-center"
                  >
                    <LogOut size={22} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-slate-800 text-white border-slate-600">
                  <p>Sair</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <button
                onClick={handleLogout}
                className="flex items-center w-full p-2.5 rounded-lg cursor-pointer hover:bg-red-600 transition-colors text-slate-300 hover:text-white space-x-3"
              >
                <LogOut size={18} />
                <span className="font-medium text-sm">Sair</span>
              </button>
            )}
          </div>
        </div>

        {/* Toggle Button - Arrastável verticalmente */}
        <button
          onClick={onToggle}
          onMouseDown={handleToggleMouseDown}
          className="fixed z-50 p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-r-lg transition-all duration-300 border-r border-t border-b border-slate-600 shadow-lg cursor-move"
          style={{ 
            left: `${sidebarWidth}px`,
            top: `${toggleButtonPosition}vh`,
            transform: 'translateY(-50%)'
          }}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </TooltipProvider>
  );
};
