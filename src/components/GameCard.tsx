import React from 'react';
import { Game } from '../types';
import { Star, Play, Flame } from 'lucide-react';

interface GameCardProps {
  game: Game;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent, gameId: string) => void;
  onSelectGame: (game: Game) => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  isFavorite,
  onToggleFavorite,
  onSelectGame
}) => {
  return (
    <div
      onClick={() => onSelectGame(game)}
      className="group relative bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
        <img
          src={game.thumbnail}
          alt={game.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            // Elegant fallback if network image fails
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Fallback pattern underneath in case image fails */}
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-indigo-950/40 to-slate-900 -z-10 flex items-center justify-center">
          <span className="font-display font-bold text-slate-700 text-lg">{game.title}</span>
        </div>

        {/* Hover Play Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
          <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-5 h-5 ml-0.5 fill-current" />
          </div>
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => onToggleFavorite(e, game.id)}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-lg backdrop-blur-md transition-colors ${
            isFavorite
              ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
              : 'bg-black/50 text-slate-300 hover:text-white hover:bg-black/70'
          }`}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
        </button>

        {/* Custom Game tag if custom */}
        {game.isCustom && (
          <div className="absolute top-2.5 left-2.5 bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-md">
            Custom
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-display font-bold text-base text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-1">
            {game.title}
          </h3>

          <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {game.description}
          </p>
        </div>

        {/* Unboxed Metadata (Zero-Pill discipline) */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="text-slate-300">{game.category}</span>
            {game.releaseYear && (
              <>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="tabular-nums">{game.releaseYear}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 tabular-nums">
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3 h-3 fill-current" />
              <span>{game.rating.toFixed(1)}</span>
            </div>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <div className="flex items-center gap-1 text-slate-400" title={`${game.plays.toLocaleString()} plays`}>
              <Flame className="w-3 h-3 text-orange-400" />
              <span>{(game.plays / 1000).toFixed(1)}k</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
