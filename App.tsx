import React, { useState, useMemo, useEffect } from 'react';
import { Student, Stats } from './types';
import { generateSampleClass, analyzePerformance } from './services/geminiService';
import { 
  loginWithGoogle, 
  logout, 
  subscribeToAuthChanges, 
  User,
  subscribeToStudents,
  overwriteStudents,
  updateStudentScore
} from './services/firebase';
import { FileUpload } from './components/FileUpload';
import { Row } from './components/Row';
import { StatsCard } from './components/StatsCard';
import { LoginPage } from './components/LoginPage';
import { Sparkles, RotateCcw, Download, Loader2, Search, Upload, User as UserIcon } from 'lucide-react';

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Initialize Auth Listener
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Initialize Firestore Data Listener
  useEffect(() => {
    if (user) {
      // When user is logged in, subscribe to their data in Firestore
      const unsubscribe = subscribeToStudents(user.uid, (data) => {
        setStudents(data);
      });
      return () => unsubscribe();
    } else {
      // Clear data on logout
      setStudents([]);
    }
  }, [user]);

  // Sort students automatically by score (descending)
  const sortedStudents = useMemo(() => {
    const sorted = [...students].sort((a, b) => {
      if (b.score === a.score) {
        return a.name.localeCompare(b.name);
      }
      return b.score - a.score;
    });
    return sorted;
  }, [students]);

  // Filter for display based on search
  const displayedStudents = useMemo(() => {
    return sortedStudents.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [sortedStudents, searchQuery]);

  // Calculate stats
  const stats: Stats = useMemo(() => {
    if (students.length === 0) return { average: 0, highest: 0, lowest: 0, total: 0 };
    const totalScore = students.reduce((sum, s) => sum + s.score, 0);
    const scores = students.map(s => s.score);
    return {
      total: students.length,
      average: totalScore / students.length,
      highest: Math.max(...scores),
      lowest: Math.min(...scores),
    };
  }, [students]);

  const handleCSVLoaded = async (data: { name: string; score: number }[]) => {
    if (!user) return;
    
    const newStudents: Student[] = data.map((item, idx) => ({
      id: `csv-${Date.now()}-${idx}`,
      name: item.name,
      score: item.score,
    }));

    try {
      // Save to Firestore instead of local state
      await overwriteStudents(user.uid, newStudents);
      setAiAnalysis(null); // Reset analysis on new data
    } catch (error) {
      console.error("Failed to save CSV data", error);
      alert("Failed to save data to the database.");
    }
  };

  const handleGenerateAI = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await generateSampleClass(10);
      // Save to Firestore instead of local state
      await overwriteStudents(user.uid, data);
      setAiAnalysis(null);
    } catch (error) {
      console.error("Failed to generate", error);
      alert("Failed to generate AI data or save to database.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (students.length === 0) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzePerformance(students);
      setAiAnalysis(result);
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const updateScore = async (id: string, newScore: number) => {
    if (!user) return;
    // Optimistic update handled by Firestore subscription, 
    // but we trigger the DB update here
    try {
      await updateStudentScore(user.uid, id, newScore);
    } catch (error) {
      console.error("Failed to update score", error);
      alert("Failed to update score in database.");
    }
  };

  const exportCSV = () => {
    const header = "Name,Score\n";
    const rows = sortedStudents.map(s => `${s.name},${s.score}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leaderboard_export.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error: any) {
      console.error("Login failed", error);
      
      if (error.code === 'auth/unauthorized-domain') {
        const domain = window.location.hostname;
        alert(
          `Login Failed: Domain Not Authorized\n\n` +
          `The domain "${domain}" is not whitelisted in your Firebase project.\n\n` +
          `To fix this:\n` +
          `1. Go to the Firebase Console > Authentication > Settings > Authorized Domains\n` +
          `2. Add "${domain}" to the list\n\n` +
          `Note: If you haven't set up your own Firebase project yet, update 'services/firebase.ts' with your own config.`
        );
      } else if (error.code === 'auth/operation-not-supported-in-this-environment') {
         alert(
           "Login Failed: Environment Not Supported\n\n" +
           "This error usually happens in preview environments that restrict browser storage or use http instead of https.\n\n" +
           "Try opening this app in a new tab/window, or ensure you are running on https (or localhost)."
         );
      } else if (error.code === 'auth/popup-closed-by-user') {
        // User closed popup, do nothing
      } else if (error.code === 'auth/invalid-api-key' || error.message.includes('API Key')) {
        alert("Login Failed: Invalid Configuration\n\nPlease check your 'services/firebase.ts' file.");
      } else {
        alert(`Login failed: ${error.message}`);
      }
    }
  };

  // View Selection Logic
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Authenticated Dashboard
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight">
              AI競賽即時排行榜
            </h1>
            <p className="text-slate-500 mt-1">Real-time interactive student leaderboard</p>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
            {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'User'} className="w-8 h-8 rounded-full" />
            ) : (
                <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                    <UserIcon size={16} />
                </div>
            )}
            <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-700 max-w-[100px] truncate">
                    {user.displayName || 'User'}
                </span>
                <button 
                    onClick={logout}
                    className="text-[10px] text-slate-400 hover:text-red-500 text-left flex items-center gap-1 transition-colors"
                >
                    Log out
                </button>
            </div>
          </div>
        </header>

        {/* Main Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
                <FileUpload onDataLoaded={handleCSVLoaded} />
                {students.length > 0 && (
                    <button 
                        onClick={exportCSV}
                        className="p-2 text-slate-600 hover:text-primary hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all"
                        title="Export CSV"
                    >
                        <Download size={20} />
                    </button>
                )}
            </div>

             <button 
              onClick={handleGenerateAI}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 font-medium text-sm disabled:opacity-70 disabled:cursor-not-allowed ml-auto"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              {students.length === 0 ? "Generate Class (AI)" : "Regenerate"}
            </button>
        </div>

        {/* Stats Summary */}
        {students.length > 0 && <StatsCard stats={stats} />}

        {/* AI Analysis Section */}
        {students.length > 0 && (
           <div className="mb-6">
              {!aiAnalysis ? (
                  <button 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
                  >
                    {isAnalyzing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                    Analyze Performance with Gemini
                  </button>
              ) : (
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100 text-indigo-900 text-sm leading-relaxed relative">
                   <button 
                      onClick={() => setAiAnalysis(null)} 
                      className="absolute top-2 right-2 text-indigo-300 hover:text-indigo-600"
                    >
                      <RotateCcw size={14} />
                   </button>
                   <span className="font-bold mr-2">AI Insight:</span> 
                   {aiAnalysis}
                </div>
              )}
           </div>
        )}

        {/* Search Bar */}
        {students.length > 0 && (
            <div className="mb-4 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                    type="text" 
                    placeholder="Search student..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full p-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none shadow-sm transition-all"
                />
            </div>
        )}

        {/* Leaderboard List */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          {students.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
               <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                  <Upload size={32} className="text-indigo-500" />
               </div>
               <h3 className="text-xl font-bold text-slate-800 mb-2">No Students Yet</h3>
               <p className="text-slate-500 max-w-md">
                 Upload a CSV file (Name, Score) or generate a sample class using AI to get started.
               </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
               {/* Header Row */}
               <div className="flex items-center gap-4 p-4 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <div className="w-12 text-center">Rank</div>
                  <div className="flex-grow">Student Details</div>
                  <div className="w-20 text-right">Score</div>
               </div>

               {/* Rows */}
               {displayedStudents.length === 0 ? (
                   <div className="p-8 text-center text-slate-400">No students found matching "{searchQuery}"</div>
               ) : (
                   displayedStudents.map((student, index) => (
                    <Row 
                      key={student.id} 
                      student={student} 
                      rank={index + 1} 
                      onScoreUpdate={updateScore}
                      maxScore={100}
                    />
                  ))
               )}
            </div>
          )}
        </div>
        
        <footer className="mt-12 text-center text-slate-400 text-sm">
           <p>© {new Date().getFullYear()} AI競賽即時排行榜. Powered by React & Gemini.</p>
        </footer>

      </div>
    </div>
  );
};

export default App;