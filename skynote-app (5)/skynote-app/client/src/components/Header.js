import React from 'react';
import { Cloud, Crown } from 'lucide-react';

function Header({ onNavigate, currentPage, userPlan }) {
  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-sky-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-5 flex justify-between items-center">
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => onNavigate('home')}
        >
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Cloud className="w-6 h-6 text-white" fill="white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full animate-pulse shadow-md"></div>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
              SkyNote
            </h1>
            <p className="text-xs text-sky-600/70">Révise avec l'IA</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {userPlan === 'premium' && (
            <span className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
              <Crown className="w-4 h-4" />
              Premium
            </span>
          )}
          
          {currentPage === 'home' && (
            <button
              onClick={() => onNavigate('premium')}
              className="btn-secondary"
            >
              Premium
            </button>
          )}
          
          {currentPage !== 'home' && (
            <button
              onClick={() => onNavigate('home')}
              className="btn-secondary"
            >
              Accueil
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
