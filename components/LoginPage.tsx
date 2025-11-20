import React from 'react';
import { Trophy, Sparkles, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
  error?: string | null;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, error }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
       {/* Background decorations */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-100/50 blur-3xl"></div>
          <div className="absolute top-[60%] -right-[5%] w-[30%] h-[30%] rounded-full bg-pink-100/50 blur-3xl"></div>
       </div>

       <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100 max-w-md w-full text-center relative z-10">
          <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3 shadow-sm">
             <Trophy size={40} className="text-indigo-600" />
          </div>
          
          <h1 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
            AI競賽即時排行榜
          </h1>
          <p className="text-slate-500 mb-8 text-lg leading-relaxed">
            Sign in to manage scores, generate AI insights, and track class performance in real-time.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-left flex gap-3">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
              <div className="text-sm text-red-700 whitespace-pre-wrap font-medium">
                {error}
              </div>
            </div>
          )}

          <button 
            onClick={onLogin}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white text-slate-700 border-2 border-slate-200 hover:border-indigo-600 hover:text-indigo-600 rounded-xl transition-all duration-300 font-bold group shadow-sm hover:shadow-md"
          >
            {/* Google Icon SVG */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" className="text-[#4285F4] group-hover:fill-indigo-600 transition-colors" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" className="text-[#34A853] group-hover:fill-indigo-600 transition-colors" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" className="text-[#FBBC05] group-hover:fill-indigo-600 transition-colors" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" className="text-[#EA4335] group-hover:fill-indigo-600 transition-colors" />
            </svg>
            Sign in with Google
          </button>

          <div className="mt-10 flex items-center justify-center gap-2 text-xs text-slate-400 font-medium uppercase tracking-wide">
             <Sparkles size={12} />
             <span>Powered by Google Gemini</span>
          </div>
       </div>
    </div>
  );
};