import React, { useState, useEffect, useRef } from 'react';
import { Student } from '../types';
import { Medal } from 'lucide-react';
import { AVATAR_OPTIONS } from '../constants';

interface RowProps {
  student: Student;
  rank: number;
  onScoreUpdate: (id: string, newScore: number) => void;
  onAvatarUpdate: (id: string, newAvatar: string) => void;
  maxScore?: number;
}

export const Row: React.FC<RowProps> = ({ student, rank, onScoreUpdate, onAvatarUpdate, maxScore = 100 }) => {
  const [localScore, setLocalScore] = useState<string>(student.score.toString());
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Sync local state if external props change
  useEffect(() => {
    setLocalScore(student.score.toString());
  }, [student.score]);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsAvatarPickerOpen(false);
      }
    };

    if (isAvatarPickerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAvatarPickerOpen]);

  const handleBlur = () => {
    let val = parseInt(localScore, 10);
    if (isNaN(val)) val = 0;
    if (val < 0) val = 0;
    
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
    <div className="group flex items-center gap-4 p-4 bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors last:border-0 relative">
       {/* Rank Section */}
      <div className="flex-shrink-0 w-12 flex justify-center items-center">
        {getRankIcon(rank)}
      </div>

      {/* Avatar Section */}
      <div className="flex-shrink-0 relative" ref={pickerRef}>
        <button 
          onClick={() => setIsAvatarPickerOpen(!isAvatarPickerOpen)}
          className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-xl transition-colors border border-slate-200 cursor-pointer select-none"
          title="Change Avatar"
        >
          {student.avatar || '👤'}
        </button>

        {/* Avatar Picker Popover */}
        {isAvatarPickerOpen && (
          <div className="absolute left-0 top-full mt-2 z-50 bg-white p-2 rounded-xl shadow-xl border border-slate-200 w-64 grid grid-cols-5 gap-2 animate-in fade-in zoom-in-95 duration-100">
            {AVATAR_OPTIONS.map((avatar) => (
              <button
                key={avatar}
                onClick={() => {
                  onAvatarUpdate(student.id, avatar);
                  setIsAvatarPickerOpen(false);
                }}
                className={`w-10 h-10 flex items-center justify-center text-xl rounded-lg hover:bg-slate-100 transition-colors ${student.avatar === avatar ? 'bg-indigo-50 ring-2 ring-indigo-500' : ''}`}
              >
                {avatar}
              </button>
            ))}
          </div>
        )}
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