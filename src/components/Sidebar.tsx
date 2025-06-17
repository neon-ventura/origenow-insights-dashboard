import React from 'react';
import { Home, Package, ShoppingCart, Users, RefreshCw, Search, Upload, GraduationCap, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { useUserContext } from '@/contexts/UserContext';
interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}
const menuItems = [{
  icon: Home,
  label: 'Dashboard',
  path: '/',
  active: false
}, {
  icon: Package,
  label: 'Produtos Amazon',
  path: '/produtos-amazon',
  active: false
}, {
  icon: ShoppingCart,
  label: 'Minhas Vendas',
  path: '/vendas',
  active: false
}, {
  icon: Users,
  label: 'Fornecedores',
  path: '/fornecedores',
  active: false
}, {
  icon: RefreshCw,
  label: 'Atualização de Estoque',
  path: '/estoque',
  active: false
}, {
  icon: Search,
  label: 'Verificar GTIN',
  path: '/gtin',
  active: false
}, {
  icon: Upload,
  label: 'Publicar Ofertas',
  path: '/ofertas',
  active: false
}, {
  icon: GraduationCap,
  label: 'Universidade OrigeNow',
  path: '/universidade',
  active: false
}];
export const Sidebar = ({
  isCollapsed,
  onToggle
}: SidebarProps) => {
  const location = useLocation();
  const {
    selectedUser
  } = useUserContext();
  return <div className="relative">
      <div className={cn("bg-slate-900 text-white transition-all duration-300 flex flex-col fixed left-0 top-0 h-screen z-40", isCollapsed ? "w-16" : "w-64")}>
        {/* Header */}
        <div className="p-4 flex items-center justify-center border-b border-slate-700 min-h-[73px]">
          {!isCollapsed && <div className="flex items-center justify-center w-full">
              <img src="/lovable-uploads/0797504e-d0a1-4942-8074-4411d5e3e364.png" alt="Logo" className="h-14 w-auto object-contain" />
            </div>}
          {isCollapsed && <div className="flex items-center justify-center">
              <img src="/lovable-uploads/0797504e-d0a1-4942-8074-4411d5e3e364.png" alt="Logo" className="h-8 w-auto object-contain" />
            </div>}
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return <Link key={index} to={item.path} className={cn("flex items-center p-3 rounded-lg cursor-pointer transition-colors", isActive ? "bg-blue-600 text-white" : "hover:bg-slate-700 text-slate-300", isCollapsed && "justify-center")}>
                <item.icon size={isCollapsed ? 28 : 20} />
                {!isCollapsed && <span className="ml-3 font-medium">{item.label}</span>}
              </Link>;
        })}
        </nav>

        {/* Footer - Profile */}
        <div className="p-4 border-t border-slate-700">
          <div className={cn("flex items-center cursor-pointer hover:bg-slate-700 p-3 rounded-lg transition-colors", isCollapsed ? "justify-center" : "space-x-3")}>
            {isCollapsed ? <User size={28} /> : <>
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
              </>}
          </div>
        </div>
      </div>

      {/* Toggle Button - positioned at the edge */}
      <button onClick={onToggle} className={cn("fixed top-1/2 -translate-y-1/2 z-50 p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-r-lg transition-all duration-300 border-r border-t border-b border-slate-600 shadow-lg", isCollapsed ? "left-16" : "left-64")}>
        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    </div>;
};