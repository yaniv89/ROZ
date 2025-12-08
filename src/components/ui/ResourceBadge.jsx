// src/components/ui/ResourceBadge.jsx
// Individual resource badge component with expand/collapse functionality

import React from 'react';
import { Coins, Users, Globe, Beaker, Zap, Swords, Shield } from 'lucide-react';
import { formatNumber } from '../../utils/helpers';

const RESOURCE_CONFIG = {
  money: {
    icon: Coins,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20',
    label: 'Funds'
  },
  manpower: {
    icon: Users,
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    label: 'Manpower'
  },
  diplomacyPoints: {
    icon: Globe,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    label: 'Diplomacy'
  },
  techPoints: {
    icon: Beaker,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    label: 'Tech Points'
  },
  actionPoints: {
    icon: Zap,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    label: 'Action Points'
  },
  militaryPower: {
    icon: Swords,
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
    label: 'Military Power'
  },
  undergroundStrength: {
    icon: Shield,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
    label: 'Underground'
  }
};

const ResourceBadge = ({ 
  type, 
  value, 
  maxValue = null, 
  expanded = false, 
  onClick = null,
  showLabel = false,
  size = 'normal' // 'small', 'normal', 'large'
}) => {
  const config = RESOURCE_CONFIG[type];
  if (!config) return null;

  const Icon = config.icon;
  const displayValue = maxValue !== null 
    ? `${value}/${maxValue}` 
    : (typeof value === 'number' ? formatNumber(value) : value);

  const sizeClasses = {
    small: 'px-1.5 py-0.5 text-xs gap-1',
    normal: 'px-2 py-1 text-sm gap-1.5',
    large: 'px-3 py-1.5 text-base gap-2'
  };

  const iconSizes = {
    small: 12,
    normal: 14,
    large: 18
  };

  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={`
        flex items-center rounded-lg transition-all
        ${sizeClasses[size]}
        ${expanded ? 'bg-slate-700 ring-1 ring-blue-400' : 'bg-slate-800/60 hover:bg-slate-700/80'}
        ${onClick ? 'cursor-pointer' : 'cursor-default'}
        disabled:cursor-default
      `}
      title={config.label}
    >
      <span className={config.color}>
        <Icon size={iconSizes[size]} />
      </span>
      <span className="font-mono font-bold text-white">
        {displayValue}
      </span>
      {(expanded || showLabel) && (
        <span className="text-slate-400 ml-1 text-xs">
          {config.label}
        </span>
      )}
    </button>
  );
};

export default ResourceBadge;
