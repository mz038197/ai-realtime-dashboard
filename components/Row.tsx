import React, { useState, useEffect } from 'react';
import { Student } from '../types';
import { Medal, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface RowProps {
  student: Student;
  rank: number;
  onScoreUpdate: (id: string, newScore: number) => void;
  maxScore?: number;
}

export const Row: React.FC<RowProps> = ({ student, rank, onScoreUpdate, maxScore = 100 }) => {
  const [localScore, setLocalScore] = useState<string>(student.score.toString());

  // Sync local state if external props change (e.g. CSV reload)
  useEffect(() => {
    setLocalScore(student.score.toString());
  }, [student.score]);

  const handleBlur = () => {
    let val = parseInt(localScore, 10);
    if (isNaN(val)) val = 0;
    if (val < 0) val = 0;
    // We don't enforce max limit strictly, allowing bonus points, but standard exams usually cap at 100.
    
    setLocalScore(val.toString());
    if (val !== student.score) {
      onScoreUpdate(student.id, val);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    }
  };

  const getRankIcon = (r: number) => {
    if (r === 1) return <Medal className="text-yellow-500" fill="currentColor" size={24} />;
    if (r === 2) return <Medal className="text-slate-400" fill="currentColor" size={24} />;
    if (r === 3) return <Medal className="text-amber-700" fill="currentColor" size={24} />;
    return <span className="font-bold text-slate-400 text-lg w-6 text-center">#{r}</span>;
  };

  const getBarColor = () => {
    if (student.score >= 90) return 'bg-green-500';
    if (student.score >= 80) return 'bg-indigo-500';
    if (student.score >= 70) return 'bg-blue-500';
    if (student.score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="group flex items-center gap-4 p-4 bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors last:border-0 relative overflow-hidden">
       {/* Rank Section */}
      <div className="flex-shrink-0 w-12 flex justify-center items-center">
        {getRankIcon(rank)}
      </div>

      {/* Name Section */}
      <div className="flex-grow flex flex-col justify-center">
        <h3 className="font-semibold text-slate-800 text-lg">{student.name}</h3>
        {/* Visual Progress Bar */}
        <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
          <div 
            className={`h-full rounded-full ${getBarColor()} transition-all duration-500 ease-out`} 
            style={{ width: `${Math.min(100, Math.max(0, (student.score / maxScore) * 100))}%` }}
          />
        </div>
      </div>

      {/* Score Input Section */}
      <div className="flex-shrink-0 relative">
        <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wide hidden sm:block">Score</span>
            <input
            type="number"
            value={localScore}
            onChange={(e) => setLocalScore(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-20 text-right font-bold text-2xl bg-transparent border-b-2 border-transparent hover:border-slate-300 focus:border-primary focus:outline-none text-slate-800 transition-all p-1"
            />
        </div>
      </div>
    </div>
  );
};
