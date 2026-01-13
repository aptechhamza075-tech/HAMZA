
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { AppState, GeneratedImage, AspectRatio } from './types';
import { generateImage, editImage } from './geminiService';
import ImageCard from './components/ImageCard';
import PromptInput from './components/PromptInput';
import LoadingOverlay from './components/LoadingOverlay';
import Header from './components/Header';

const DEFAULT_PROMPT = "Create an epic Spider-Man movie poster. The hero is in a dynamic action pose, swinging through a city at night with skyscrapers and neon lights in the background. Emphasize dramatic lighting, cinematic shadows, and a sense of motion. Include web-slinging details, a vibrant and bold color palette (reds, blues, and blacks), and a heroic, intense mood. Add movie poster elements like title text space, glowing effects, and high-resolution cinematic quality, suitable for a blockbuster poster.";

const App: React.FC = () => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [status, setStatus] = useState<AppState>(AppState.IDLE);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("3:4");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async (prompt: string) => {
    try {
      setStatus(AppState.GENERATING);
      setErrorMessage(null);
      const url = await generateImage(prompt, aspectRatio);
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url,
        prompt,
        timestamp: Date.now(),
      };
      setImages(prev => [newImage, ...prev]);
      setCurrentImage(newImage);
      setStatus(AppState.IDLE);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to generate image.");
      setStatus(AppState.ERROR);
    }
  };

  const handleEdit = async (editPrompt: string) => {
    if (!currentImage) return;
    
    try {
      setStatus(AppState.EDITING);
      setErrorMessage(null);
      const url = await editImage(currentImage.url, editPrompt);
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url,
        prompt: `${currentImage.prompt} (Edited: ${editPrompt})`,
        timestamp: Date.now(),
      };
      setImages(prev => [newImage, ...prev]);
      setCurrentImage(newImage);
      setStatus(AppState.IDLE);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to edit image.");
      setStatus(AppState.ERROR);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: base64,
        prompt: "Uploaded image",
        timestamp: Date.now(),
      };
      setImages(prev => [newImage, ...prev]);
      setCurrentImage(newImage);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <Header />

      <main className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar - Gallery */}
        <div className={`
          ${isSidebarOpen ? 'w-80' : 'w-0'} 
          transition-all duration-300 glass border-r border-white/10 flex flex-col overflow-hidden
        `}>
          <div className="p-4 flex items-center justify-between border-b border-white/10">
            <h2 className="font-bold text-sm tracking-widest uppercase text-slate-400">Project Gallery</h2>
            <button onClick={() => setIsSidebarOpen(false)} className="text-slate-500 hover:text-white">
              <i className="fas fa-chevron-left"></i>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {images.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <i className="fas fa-images text-3xl mb-4 opacity-20"></i>
                <p className="text-sm">Your generated masterpieces will appear here.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {images.map((img) => (
                  <button 
                    key={img.id}
                    onClick={() => setCurrentImage(img)}
                    className={`
                      relative group rounded-lg overflow-hidden border-2 transition-all
                      ${currentImage?.id === img.id ? 'border-red-500 ring-2 ring-red-500/20' : 'border-transparent hover:border-white/20'}
                    `}
                  >
                    <img src={img.url} alt={img.prompt} className="w-full aspect-[3/4] object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <i className="fas fa-expand text-white text-xl"></i>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Toggle Sidebar Button (when closed) */}
        {!isSidebarOpen && (
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="absolute left-4 top-4 z-10 w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <i className="fas fa-bars"></i>
          </button>
        )}

        {/* Main Workspace */}
        <div className="flex-1 flex flex-col p-6 overflow-hidden bg-gradient-to-br from-black to-slate-900">
          <div className="flex-1 flex flex-col items-center justify-center gap-8 overflow-hidden relative">
            
            {status !== AppState.IDLE && (
              <LoadingOverlay status={status} />
            )}

            {currentImage ? (
              <div className="relative max-w-full max-h-full flex flex-col items-center group">
                <div className="relative shadow-2xl shadow-red-900/20 rounded-xl overflow-hidden border border-white/10 max-h-[70vh]">
                  <img 
                    src={currentImage.url} 
                    alt="Generated Preview" 
                    className="max-h-[70vh] object-contain"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button 
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = currentImage.url;
                        link.download = `poster-${currentImage.id}.png`;
                        link.click();
                      }}
                      className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <i className="fas fa-download"></i>
                    </button>
                  </div>
                </div>
                <div className="mt-4 glass p-4 rounded-lg max-w-xl text-center">
                  <p className="text-xs text-slate-400 mb-1 font-mono uppercase tracking-widest">Active Prompt</p>
                  <p className="text-sm text-slate-200 line-clamp-2 italic">"{currentImage.prompt}"</p>
                </div>
              </div>
            ) : (
              <div className="max-w-2xl text-center space-y-6">
                <div className="w-32 h-32 mx-auto bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20 neon-border">
                  <i className="fas fa-wand-magic-sparkles text-5xl text-red-500"></i>
                </div>
                <h2 className="text-4xl font-display font-black text-white">Create Your Epic Poster</h2>
                <p className="text-slate-400 text-lg">Enter a detailed prompt or use our pre-filled superhero template to generate high-resolution cinematic artwork.</p>
                <div className="flex flex-wrap justify-center gap-4">
                  <button 
                    onClick={() => handleGenerate(DEFAULT_PROMPT)}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-full font-bold transition-all transform hover:scale-105"
                  >
                    Generate Spidey Poster
                  </button>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 glass hover:bg-white/10 rounded-full font-bold transition-all"
                  >
                    Upload Image to Edit
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileUpload}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Persistent Footer Controls */}
          <div className="mt-auto w-full max-w-4xl mx-auto glass p-6 rounded-2xl border-white/20 shadow-2xl">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Ratio</span>
                <div className="flex p-1 glass rounded-lg gap-1">
                  {(["1:1", "3:4", "4:3", "9:16", "16:9"] as AspectRatio[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => setAspectRatio(r)}
                      className={`px-3 py-1 rounded text-xs font-bold transition-all ${aspectRatio === r ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'hover:bg-white/5 text-slate-400'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              
              {currentImage && (
                <div className="flex items-center gap-3">
                   <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Quick Edits</span>
                   <div className="flex gap-2">
                     {["Retro Filter", "More Neon", "Dramatic Smoke", "Brighten"].map(tag => (
                       <button 
                        key={tag}
                        onClick={() => handleEdit(`Apply a ${tag} effect to this image`)}
                        className="px-3 py-1 glass rounded-full text-[10px] font-bold uppercase hover:bg-white/10 border-white/10 transition-colors"
                       >
                         {tag}
                       </button>
                     ))}
                   </div>
                </div>
              )}
            </div>

            <PromptInput 
              onGenerate={handleGenerate} 
              onEdit={handleEdit} 
              isEditing={!!currentImage}
              isLoading={status !== AppState.IDLE}
              defaultPrompt={DEFAULT_PROMPT}
            />

            {errorMessage && (
              <p className="mt-4 text-center text-red-500 text-sm font-medium">
                <i className="fas fa-circle-exclamation mr-2"></i>
                {errorMessage}
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
