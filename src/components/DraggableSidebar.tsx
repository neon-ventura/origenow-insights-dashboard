
import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, 
  Package, 
  ShoppingCart, 
  Users, 
  RefreshCw, 
  Search, 
  Upload, 
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  User,
  GripVertical,
  LogOut,
  FileText
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
  { icon: ShoppingCart, label: 'Minhas Vendas', path: '/vendas', active: false },
  { icon: FileText, label: 'Meus Pedidos', path: '/pedidos', active: false, badge: 'Em breve' },
  { icon: Users, label: 'Fornecedores', path: '/fornecedores', active: false },
  { icon: RefreshCw, label: 'Atualização de Estoque', path: '/estoque', active: false },
  { icon: Search, label: 'Verificar GTIN', path: '/gtin', active: false },
  { icon: Upload, label: 'Publicar Ofertas', path: '/ofertas', active: false },
  { icon: GraduationCap, label: 'Universidade OrigeNow', path: '/universidade', active: false },
];

export const DraggableSidebar = ({ isCollapsed, onToggle }: DraggableSidebarProps) => {
  const location = useLocation();
  const { selectedUser } = useUserContext();
  const { logout } = useAuth();
  const [sidebarWidth, setSidebarWidth] = useState(isCollapsed ? 64 : 256);
  const [isDragging, setIsDragging] = useState(false);
  const [toggleButtonPosition, setToggleButtonPosition] = useState(50); // Posição em percentual (50% = meio da tela)
  const [isDraggingToggle, setIsDraggingToggle] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSidebarWidth(isCollapsed ? 64 : 256);
  }, [isCollapsed]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleToggleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingToggle(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newWidth = Math.max(64, Math.min(400, e.clientX));
        setSidebarWidth(newWidth);
        
        // Atualiza o estado collapsed baseado na largura
        if (newWidth <= 80 && !isCollapsed) {
          onToggle();
        } else if (newWidth > 80 && isCollapsed) {
          onToggle();
        }
      }

      if (isDraggingToggle) {
        const newPosition = Math.max(10, Math.min(90, (e.clientY / window.innerHeight) * 100));
        setToggleButtonPosition(newPosition);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsDraggingToggle(false);
    };

    if (isDragging || isDraggingToggle) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isDraggingToggle, isCollapsed, onToggle]);

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
          {sidebarWidth > 80 && (
            <div className="flex items-center justify-center w-full">
              <img src="/lovable-uploads/b0c1de2e-281b-481c-8a12-0ba44aa91765.png" alt="Logo" className="h-14 w-auto object-contain" />
            </div>
          )}
          {sidebarWidth <= 80 && (
            <div className="flex items-center justify-center">
              <img src="/lovable-uploads/b0c1de2e-281b-481c-8a12-0ba44aa91765.png" alt="Logo" className="h-8 w-auto object-contain" />
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
                  sidebarWidth <= 80 && "justify-center"
                )}
              >
                <item.icon size={sidebarWidth <= 80 ? 28 : 20} />
                {sidebarWidth > 80 && (
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
            sidebarWidth <= 80 ? "justify-center" : "space-x-3"
          )}>
            {sidebarWidth <= 80 ? (
              <User size={28} />
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
              sidebarWidth <= 80 ? "justify-center" : "space-x-3"
            )}
          >
            <LogOut size={sidebarWidth <= 80 ? 28 : 20} />
            {sidebarWidth > 80 && (
              <span className="font-medium">Sair</span>
            )}
          </button>
        </div>

        {/* Drag Handle */}
        <div
          ref={dragRef}
          className="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-slate-600 hover:bg-slate-500 transition-colors"
          onMouseDown={handleMouseDown}
        >
          <div className="absolute top-1/2 -translate-y-1/2 right-0 w-4 h-8 bg-slate-700 hover:bg-slate-600 rounded-l-md flex items-center justify-center cursor-col-resize">
            <GripVertical size={12} className="text-slate-300" />
          </div>
        </div>
      </div>

      {/* Toggle Button - Agora arrastável verticalmente */}
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
