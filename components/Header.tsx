
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="h-16 px-6 glass border-b border-white/10 flex items-center justify-between z-20">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-600/40">
          <i className="fas fa-camera-retro text-white"></i>
        </div>
        <div>
          <h1 className="font-display font-black text-xl tracking-tighter text-white">CINE-EDITOR <span className="text-red-600">AI</span></h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 -mt-1">Powered by Nano Banana</p>
        </div>
      </div>

      <nav className="hidden md:flex items-center gap-8">
        <a href="#" className="text-sm font-semibold text-red-500">Studio</a>
        <a href="#" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Assets</a>
        <a href="#" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Presets</a>
        <a href="#" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Learn</a>
      </nav>

      <div className="flex items-center gap-4">
        <button className="hidden sm:flex items-center gap-2 px-4 py-2 glass rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-colors">
          <i className="fas fa-bolt text-yellow-500"></i>
          Upgrade Pro
        </button>
        <div className="w-10 h-10 rounded-full border border-white/20 p-0.5">
          <img src="https://picsum.photos/seed/user/100/100" className="w-full h-full rounded-full object-cover" alt="User Profile" />
        </div>
      </div>
    </header>
  );
};

export default Header;
