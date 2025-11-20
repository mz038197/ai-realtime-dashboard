import React from 'react';
import { Stats } from '../types';
import { Trophy, Users, TrendingUp, Award } from 'lucide-react';

interface StatsCardProps {
  stats: Stats;
}

export const StatsCard: React.FC<StatsCardProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
        <div className="flex items-center gap-2 text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">
          <Users size={14} /> Total Students
        </div>
        <div className="text-2xl font-bold text-slate-800">{stats.total}</div>
      </div>
      
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
        <div className="flex items-center gap-2 text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">
          <TrendingUp size={14} /> Average
        </div>
        <div className="text-2xl font-bold text-indigo-600">{stats.average.toFixed(1)}</div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
        <div className="flex items-center gap-2 text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">
          <Trophy size={14} className="text-amber-500" /> Highest
        </div>
        <div className="text-2xl font-bold text-amber-500">{stats.highest}</div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
        <div className="flex items-center gap-2 text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">
          <Award size={14} className="text-slate-400" /> Lowest
        </div>
        <div className="text-2xl font-bold text-slate-400">{stats.lowest}</div>
      </div>
    </div>
  );
};
