
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string;
  change?: number;
  changeLabel?: string;
  color: 'blue' | 'green' | 'purple' | 'teal' | 'orange' | 'indigo';
  icon?: React.ReactNode;
}

export const MetricCard = ({ title, value, change, changeLabel, icon }: MetricCardProps) => {
  const isPositive = change && change > 0;
  
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 transition-all hover:shadow-sm hover:border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
          <span className="text-gray-400">{icon}</span>
          {title}
        </h3>
      </div>
      
      <div className="space-y-3">
        <p className="text-2xl font-bold text-gray-900">
          {value}
        </p>
        
        {change !== undefined && changeLabel && (
          <div className="flex items-center space-x-2">
            <div className={cn(
              "flex items-center space-x-1 text-sm",
              isPositive ? "text-green-600" : "text-red-600"
            )}>
              {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span className="font-medium">{Math.abs(change)}%</span>
            </div>
            <span className="text-sm text-gray-400">{changeLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
};
