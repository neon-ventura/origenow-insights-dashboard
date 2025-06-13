
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

const colorClasses = {
  blue: 'border-blue-200 bg-blue-50',
  green: 'border-green-200 bg-green-50',
  purple: 'border-purple-200 bg-purple-50',
  teal: 'border-teal-200 bg-teal-50',
  orange: 'border-orange-200 bg-orange-50',
  indigo: 'border-indigo-200 bg-indigo-50',
};

const valueColors = {
  blue: 'text-blue-600',
  green: 'text-green-600',
  purple: 'text-purple-600',
  teal: 'text-teal-600',
  orange: 'text-orange-600',
  indigo: 'text-indigo-600',
};

export const MetricCard = ({ title, value, change, changeLabel, color, icon }: MetricCardProps) => {
  const isPositive = change && change > 0;
  
  return (
    <div className={cn("rounded-lg border-2 p-6 transition-all hover:shadow-md", colorClasses[color])}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600 flex items-center gap-2">
          {icon}
          {title}
        </h3>
      </div>
      
      <div className="space-y-3">
        <p className={cn("text-3xl font-bold", valueColors[color])}>
          {value}
        </p>
        
        {change !== undefined && changeLabel && (
          <div className="flex items-center space-x-2">
            <div className={cn(
              "flex items-center space-x-1 text-sm",
              isPositive ? "text-green-600" : "text-red-600"
            )}>
              {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span className="font-medium">{Math.abs(change)}%</span>
            </div>
            <span className="text-sm text-gray-500">{changeLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
};
