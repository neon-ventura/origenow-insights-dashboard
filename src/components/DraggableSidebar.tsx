
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
  GripVertical
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { useUserContext } from '@/contexts/UserContext';

interface DraggableSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  { icon: Home, label: 'Dashboard', path: '/', active: false },
  { icon: Package, label: 'Produtos Amazon', path: '/produtos-amazon', active: false },
  { icon: ShoppingCart, label: 'Minhas Vendas', path: '/vendas', active: false },
  { icon: Users, label: 'Fornecedores', path: '/fornecedores', active: false },
  { icon: RefreshCw, label: 'Atualização de Estoque', path: '/estoque', active: false },
  { icon: Search, label: 'Verificar GTIN', path: '/gtin', active: false },
  { icon: Upload, label: 'Publicar Ofertas', path: '/ofertas', active: false },
  { icon: GraduationCap, label: 'Universidade OrigeNow', path: '/universidade', active: false },
];

export const DraggableSidebar = ({ isCollapsed, onToggle }: DraggableSidebarProps) => {
  const location = useLocation();
  const { selectedUser } = useUserContext();
  const [sidebarWidth, setSidebarWidth] = useState(isCollapsed ? 64 : 256);
  const [isDragging, setIsDragging] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSidebarWidth(isCollapsed ? 64 : 256);
  }, [isCollapsed]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const newWidth = Math.max(64, Math.min(400, e.clientX));
      setSidebarWidth(newWidth);
      
      // Atualiza o estado collapsed baseado na largura
      if (newWidth <= 80 && !isCollapsed) {
        onToggle();
      } else if (newWidth > 80 && isCollapsed) {
        onToggle();
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isCollapsed, onToggle]);

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
            <div className="text-center">
              <h1 className="text-xl font-bold">OrigeNow</h1>
              <p className="text-sm text-slate-400">Amazon Manager</p>
            </div>
          )}
          {sidebarWidth <= 80 && (
            <div className="text-center">
              <h1 className="text-lg font-bold">ON</h1>
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
                  "flex items-center p-3 rounded-lg cursor-pointer transition-colors",
                  isActive 
                    ? "bg-blue-600 text-white" 
                    : "hover:bg-slate-700 text-slate-300",
                  sidebarWidth <= 80 && "justify-center"
                )}
              >
                <item.icon size={sidebarWidth <= 80 ? 28 : 20} />
                {sidebarWidth > 80 && (
                  <span className="ml-3 font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer - Profile */}
        <div className="p-4 border-t border-slate-700">
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
                    {selectedUser?.user?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {selectedUser?.user || 'Usuário'}
                  </p>
                  <p className="text-xs text-slate-400">
                    {selectedUser?.nickname || 'Nenhum usuário selecionado'}
                  </p>
                </div>
              </>
            )}
          </div>
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

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed top-1/2 -translate-y-1/2 z-50 p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-r-lg transition-all duration-300 border-r border-t border-b border-slate-600 shadow-lg"
        style={{ left: `${sidebarWidth}px` }}
      >
        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    </div>
  );
};
