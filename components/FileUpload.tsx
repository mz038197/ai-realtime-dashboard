import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import { getRandomAvatar } from '../constants';

interface FileUploadProps {
  onDataLoaded: (data: { name: string; score: number; avatar: string }[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      parseCSV(text);
    };
    reader.readAsText(file);
    
    // Reset input so same file can be selected again if needed
    event.target.value = '';
  };

  const parseCSV = (csvText: string) => {
    const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');
    const parsedData: { name: string; score: number; avatar: string }[] = [];

    lines.forEach((line, index) => {
      // Simple heuristic: Skip header if it contains "name" or "score" case insensitive
      if (index === 0 && (line.toLowerCase().includes('name') || line.toLowerCase().includes('score'))) {
        return;
      }

      const parts = line.split(',');
      if (parts.length >= 1) {
        const name = parts[0].trim();
        // If score is missing, default to 0. If parts[1] exists, parse it.
        const score = parts.length > 1 ? parseInt(parts[1].trim(), 10) : 0;
        
        if (name) {
          parsedData.push({ 
            name, 
            score: isNaN(score) ? 0 : score,
            avatar: getRandomAvatar()
          });
        }
      }
    });

    onDataLoaded(parsedData);
  };

  return (
    <div className="relative">
      <input
        type="file"
        accept=".csv,.txt"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 hover:border-primary hover:text-primary transition-all shadow-sm font-medium text-sm"
      >
        <Upload size={16} />
        Import CSV
      </button>
    </div>
  );
};