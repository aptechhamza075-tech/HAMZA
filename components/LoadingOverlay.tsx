
import React from 'react';
import { AppState } from '../types';

interface LoadingOverlayProps {
  status: AppState;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ status }) => {
  const messages = {
    [AppState.GENERATING]: [
      "Dreaming up your hero...",
      "Lighting the city streets...",
      "Rendering cinematic details...",
      "Polishing the blockbuster look..."
    ],
    [AppState.EDITING]: [
      "Analyzing the scene...",
      "Modifying pixel data...",
      "Applying cinematic adjustments...",
      "Finalizing edits..."
    ],
    [AppState.IDLE]: [],
    [AppState.ERROR]: []
  };

  const [messageIndex, setMessageIndex] = React.useState(0);

  React.useEffect(() => {
    if (status === AppState.IDLE || status === AppState.ERROR) return;

    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % (messages[status]?.length || 1));
    }, 2500);

    return () => clearInterval(interval);
  }, [status]);

  if (status !== AppState.GENERATING && status !== AppState.EDITING) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 rounded-xl overflow-hidden">
      <div className="glass p-10 rounded-2xl flex flex-col items-center gap-6 border-red-500/30 text-center max-w-sm">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-700 border-t-red-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <i className={`fas ${status === AppState.EDITING ? 'fa-pen-nib' : 'fa-sparkles'} text-red-500 animate-pulse`}></i>
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-bold text-white mb-2">
            {status === AppState.EDITING ? "Editing Poster" : "Generating Poster"}
          </h3>
          <p className="text-slate-400 font-medium h-6">
            {messages[status]?.[messageIndex]}
          </p>
        </div>

        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
          <div className="bg-red-600 h-full animate-progress-bar w-[0%]"></div>
        </div>

        <style>{`
          @keyframes progress-bar {
            0% { width: 0%; }
            100% { width: 100%; }
          }
          .animate-progress-bar {
            animation: progress-bar 10s linear infinite;
          }
        `}</style>
      </div>
    </div>
  );
};

export default LoadingOverlay;
