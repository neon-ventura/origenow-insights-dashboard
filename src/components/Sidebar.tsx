
import React from 'react';
import { 
  Home, 
  Package, 
  ShoppingCart, 
  Droplets, 
  RefreshCw, 
  Search, 
  Upload, 
  GraduationCap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  { icon: Home, label: 'Dashboard', active: true },
  { icon: Package, label: 'Produtos Amazon' },
  { icon: ShoppingCart, label: 'Minhas Vendas' },
  { icon: Droplets, label: 'Painel de Drop' },
  { icon: RefreshCw, label: 'Atualização de Estoque' },
  { icon: Search, label: 'Verificar GTIN' },
  { icon: Upload, label: 'Publicar Ofertas' },
  { icon: GraduationCap, label: 'Universidade OrigeNow' },
];

export const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
  return (
    <div className={cn(
      "bg-slate-900 text-white transition-all duration-300 flex flex-col h-screen",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-slate-700">
        {!isCollapsed && (
          <div>
            <h1 className="text-xl font-bold">OrigeNow</h1>
            <p className="text-sm text-slate-400">Amazon Manager</p>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center p-3 rounded-lg cursor-pointer transition-colors",
              item.active 
                ? "bg-blue-600 text-white" 
                : "hover:bg-slate-700 text-slate-300"
            )}
          >
            <item.icon size={20} />
            {!isCollapsed && (
              <span className="ml-3 font-medium">{item.label}</span>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">U</span>
            </div>
            <div>
              <p className="text-sm font-medium">Usuário</p>
              <p className="text-xs text-slate-400">Admin</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
