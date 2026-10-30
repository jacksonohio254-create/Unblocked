import React from 'react';
import { Dices, Shield, Plus, FileCode, Star, Gamepad2 } from 'lucide-react';

interface HeaderProps {
  onSelectCategory: (cat: string) => void;
  activeFilter: string;
  onOpenAddModal: () => void;
  onOpenCloakModal: () => void;
  onOpenJsonModal: () => void;
  onRandomGame: () => void;
  onGoHome: () => void;
  favoriteCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectCategory,
  activeFilter,
  onOpenAddModal,
  onOpenCloakModal,
  onOpenJsonModal,
  onRandomGame,
  onGoHome,
  favoriteCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button
          onClick={onGoHome}
          className="text-xl font-bold tracking-tight text-white font-display flex items-center gap-2 whitespace-nowrap shrink-0 hover:text-indigo-400 transition-colors"
        >
          <Gamepad2 className="w-5 h-5 text-indigo-500" />
          <span>ArcadeVault</span>
        </button>

        {/* Zone 2: 4-5 concise single-line text nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => onSelectCategory('All')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              activeFilter === 'All' ? 'text-indigo-400 font-semibold' : 'text-slate-400'
            }`}
          >
            All Games
          </button>
          <button
            onClick={() => onSelectCategory('Favorites')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white flex items-center gap-1.5 ${
              activeFilter === 'Favorites' ? 'text-indigo-400 font-semibold' : 'text-slate-400'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Favorites ({favoriteCount})</span>
          </button>
          <button
            onClick={onOpenAddModal}
            className="whitespace-nowrap shrink-0 transition-colors hover:text-white text-slate-400 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Game</span>
          </button>
          <button
            onClick={onOpenCloakModal}
            className="whitespace-nowrap shrink-0 transition-colors hover:text-white text-slate-400 flex items-center gap-1.5"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Tab Disguise</span>
          </button>
          <button
            onClick={onOpenJsonModal}
            className="whitespace-nowrap shrink-0 transition-colors hover:text-white text-slate-400 flex items-center gap-1.5"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>JSON Database</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onRandomGame}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all rounded-lg shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
            title="Launch a random unblocked game"
          >
            <Dices className="w-4 h-4" />
            <span>Random Game</span>
          </button>
        </div>
      </div>
    </header>
  );
};
