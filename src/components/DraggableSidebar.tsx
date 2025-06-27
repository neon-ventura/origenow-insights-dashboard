
import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, 
  Package, 
  Users, 
  RefreshCw, 
  Search, 
  Upload, 
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
  FileText,
  History
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { useUserContext } from '@/contexts/UserContext';
import { useAuth } from '@/contexts/AuthContext';

interface DraggableSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  { icon: Home, label: 'Dashboard', path: '/', active: false },
  { icon: Package, label: 'Produtos Amazon', path: '/produtos-amazon', active: false },
  { icon: FileText, label: 'Meus Pedidos', path: '/meus-pedidos', active: false, badge: 'Em breve' },
  { icon: Users, label: 'Fornecedores', path: '/fornecedores', active: false },
  { icon: RefreshCw, label: 'Atualização de Estoque', path: '/atualizacao-estoque', active: false },
  { icon: Search, label: 'Verificar GTIN', path: '/verificar-gtin', active: false },
  { icon: Upload, label: 'Publicar Ofertas', path: '/publicar-ofertas', active: false },
  { icon: History, label: 'Histórico', path: '/historico', active: false },
  { icon: GraduationCap, label: 'Universidade OrigeNow', path: '/universidade', active: false },
];

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
  const [toggleButtonPosition, setToggleButtonPosition] = useState(50); // Posição em percentual (50% = meio da tela)
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
    <div className="relative">
      <div 
        ref={sidebarRef}
        className="bg-slate-900 text-white transition-all duration-300 flex flex-col fixed left-0 top-0 h-screen z-40"
        style={{ width: `${sidebarWidth}px` }}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-center border-b border-slate-700 min-h-[73px]">
          {sidebarWidth > 120 ? (
            <div className="flex items-center justify-center w-full">
              <img src="/lovable-uploads/b0c1de2e-281b-481c-8a12-0ba44aa91765.png" alt="Logo" className="h-14 w-auto object-contain" />
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <CollapsedLogo />
            </div>
          )}
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={index}
                to={item.path}
                className={cn(
                  "flex items-center p-3 rounded-lg cursor-pointer transition-colors relative",
                  isActive 
                    ? "bg-blue-600 text-white" 
                    : "hover:bg-slate-700 text-slate-300",
                  sidebarWidth <= 120 && "justify-center"
                )}
              >
                <item.icon size={sidebarWidth <= 120 ? 24 : 20} />
                {sidebarWidth > 120 && (
                  <>
                    <span className="ml-3 font-medium">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto bg-green-400 text-green-900 text-xs px-2 py-1 rounded-full font-medium">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer - Profile and Logout */}
        <div className="p-4 border-t border-slate-700 space-y-2">
          <div className={cn(
            "flex items-center cursor-pointer hover:bg-slate-700 p-3 rounded-lg transition-colors",
            sidebarWidth <= 120 ? "justify-center" : "space-x-3"
          )}>
            {sidebarWidth <= 120 ? (
              <User size={24} />
            ) : (
              <>
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {selectedUser?.user?.charAt(0).toUpperCase() || 'G'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {selectedUser?.user || 'guilherme'}
                  </p>
                  <p className="text-xs text-slate-400">
                    {selectedUser?.nickname || 'Administrador'}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center w-full p-3 rounded-lg cursor-pointer hover:bg-red-600 transition-colors text-slate-300 hover:text-white",
              sidebarWidth <= 120 ? "justify-center" : "space-x-3"
            )}
          >
            <LogOut size={sidebarWidth <= 120 ? 24 : 20} />
            {sidebarWidth > 120 && (
              <span className="font-medium">Sair</span>
            )}
          </button>
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
  );
};
