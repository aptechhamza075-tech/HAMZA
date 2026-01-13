
import React, { useState } from 'react';

interface PromptInputProps {
  onGenerate: (prompt: string) => void;
  onEdit: (prompt: string) => void;
  isEditing: boolean;
  isLoading: boolean;
  defaultPrompt: string;
}

const PromptInput: React.FC<PromptInputProps> = ({ 
  onGenerate, 
  onEdit, 
  isEditing, 
  isLoading,
  defaultPrompt
}) => {
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<'generate' | 'edit'>(isEditing ? 'edit' : 'generate');

  // Sync mode with isEditing state
  React.useEffect(() => {
    if (isEditing) setMode('edit');
    else setMode('generate');
  }, [isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    if (mode === 'edit' && isEditing) {
      onEdit(prompt);
    } else {
      onGenerate(prompt);
    }
    setPrompt('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative group">
      <div className="flex items-center gap-2 mb-2">
        <button
          type="button"
          onClick={() => setMode('generate')}
          className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${mode === 'generate' ? 'bg-red-600/20 text-red-500 border border-red-500/30' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Generate New
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={() => setMode('edit')}
            className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${mode === 'edit' ? 'bg-blue-600/20 text-blue-500 border border-blue-500/30' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Edit Selected
          </button>
        )}
      </div>

      <div className="relative flex items-center">
        <div className="absolute left-4 text-slate-500">
          <i className={mode === 'edit' ? "fas fa-wand-magic" : "fas fa-sparkles"}></i>
        </div>
        
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={mode === 'edit' ? "Try: 'Add more lens flare' or 'Change color to purple'..." : "Describe your cinematic masterpiece..."}
          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-32 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all"
        />

        <div className="absolute right-2 flex gap-2">
           <button
            type="button"
            onClick={() => setPrompt(defaultPrompt)}
            className="px-3 py-2 text-slate-500 hover:text-white transition-colors text-xs font-bold"
            title="Use Default Template"
          >
            <i className="fas fa-magic"></i>
          </button>
          
          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className={`
              px-6 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2
              ${mode === 'edit' 
                ? 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 shadow-lg shadow-blue-600/20' 
                : 'bg-red-600 hover:bg-red-700 disabled:bg-red-900 shadow-lg shadow-red-600/20'}
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {isLoading ? (
              <i className="fas fa-circle-notch fa-spin"></i>
            ) : (
              <>
                <span>{mode === 'edit' ? 'Apply Edit' : 'Create'}</span>
                <i className="fas fa-arrow-right"></i>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PromptInput;
