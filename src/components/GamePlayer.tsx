import React, { useState, useRef, useEffect } from 'react';
import { Game } from '../types';
import {
  ArrowLeft,
  Maximize2,
  Minimize2,
  RotateCcw,
  Star,
  ExternalLink,
  ThumbsUp,
  SlidersHorizontal,
  Keyboard,
  ShieldCheck,
  Expand,
  Shrink
} from 'lucide-react';

interface GamePlayerProps {
  game: Game;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent, gameId: string) => void;
  allGames: Game[];
  onSelectGame: (game: Game) => void;
  onTriggerScreenMask?: () => void;
}

export const GamePlayer: React.FC<GamePlayerProps> = ({
  game,
  onBack,
  isFavorite,
  onToggleFavorite,
  allGames,
  onSelectGame,
  onTriggerScreenMask
}) => {
  const [theaterMode, setTheaterMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [likes, setLikes] = useState(() => {
    const saved = localStorage.getItem(`likes_${game.id}`);
    return saved ? parseInt(saved, 10) : Math.floor(game.plays / 28) + 42;
  });
  const [hasLiked, setHasLiked] = useState(() => {
    return localStorage.getItem(`has_liked_${game.id}`) === 'true';
  });
  const [iframeKey, setIframeKey] = useState(0);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  // Sync likes if game changes
  useEffect(() => {
    const saved = localStorage.getItem(`likes_${game.id}`);
    setLikes(saved ? parseInt(saved, 10) : Math.floor(game.plays / 28) + 42);
    setHasLiked(localStorage.getItem(`has_liked_${game.id}`) === 'true');
    setIframeKey(k => k + 1);
  }, [game.id]);

  // Handle Fullscreen events
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!playerContainerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await playerContainerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen request failed:', err);
    }
  };

  const handleLike = () => {
    if (hasLiked) {
      setLikes(l => l - 1);
      setHasLiked(false);
      localStorage.setItem(`has_liked_${game.id}`, 'false');
      localStorage.setItem(`likes_${game.id}`, String(likes - 1));
    } else {
      setLikes(l => l + 1);
      setHasLiked(true);
      localStorage.setItem(`has_liked_${game.id}`, 'true');
      localStorage.setItem(`likes_${game.id}`, String(likes + 1));
    }
  };

  const handleReload = () => {
    setIframeKey(k => k + 1);
  };

  // Related games
  const relatedGames = allGames
    .filter(g => g.id !== game.id && (g.category === game.category || Math.random() > 0.5))
    .slice(0, 4);

  return (
    <div className={`mx-auto pb-16 transition-all duration-300 ${theaterMode ? 'max-w-full px-2 sm:px-4' : 'max-w-6xl px-4'}`}>
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-3 mb-2">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Games</span>
          </button>

          <div>
            <h1 className="font-display font-bold text-lg sm:text-xl text-white leading-tight">
              {game.title}
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>{game.category}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Unblocked Sandbox</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
              hasLiked
                ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current' : ''}`} />
            <span className="tabular-nums">{likes}</span>
          </button>

          {/* Favorite Toggle */}
          <button
            onClick={(e) => onToggleFavorite(e, game.id)}
            className={`p-2 rounded-lg border text-xs transition-colors cursor-pointer ${
              isFavorite
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
          </button>

          {/* Reload Game Frame */}
          <button
            onClick={handleReload}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
            title="Reload game frame"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Theater Mode Toggle */}
          <button
            onClick={() => setTheaterMode(!theaterMode)}
            className="hidden sm:flex items-center p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
            title={theaterMode ? 'Exit theater mode' : 'Theater mode'}
          >
            {theaterMode ? <Shrink className="w-4 h-4" /> : <Expand className="w-4 h-4" />}
          </button>

          {/* Quick Disguise Screen (Boss Key) */}
          {onTriggerScreenMask && (
            <button
              onClick={onTriggerScreenMask}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-600/40 text-emerald-300 hover:bg-emerald-900/60 hover:text-white transition-colors cursor-pointer text-xs sm:text-sm font-medium"
              title="Instantly covers screen with Google Classroom (Hotkey: ])"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Disguise Screen</span>
            </button>
          )}

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer text-xs sm:text-sm font-medium"
            title="Toggle fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </button>
        </div>
      </div>

      {/* Main Iframe Player Canvas */}
      <div
        ref={playerContainerRef}
        className={`relative w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl flex flex-col justify-center items-center ${
          theaterMode ? 'aspect-[16/9] max-h-[82vh]' : 'aspect-[16/10] sm:aspect-[16/9] max-h-[72vh]'
        }`}
      >
        <iframe
          key={iframeKey}
          title={game.title}
          src={game.srcDoc ? undefined : game.iframeUrl}
          srcDoc={game.srcDoc}
          sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-presentation allow-scripts allow-same-origin allow-downloads allow-popups allow-popups-to-escape-sandbox"
          className="w-full h-full border-0 bg-slate-950"
          allow="autoplay; payment; fullscreen; microphone; focus-without-user-activation *; screen-wake-lock; gamepad; clipboard-read; clipboard-write; accelerometer; gyroscope; keyboard-map;"
        />
      </div>

      {/* Game Details & Controls Bar Below */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Description & Metadata */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800">
            <h2 className="text-base font-semibold text-white font-display flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
              <span>About {game.title}</span>
            </h2>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              {game.description}
            </p>

            <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <div>
                <span className="text-slate-500">Category:</span>{' '}
                <span className="text-slate-200 font-medium">{game.category}</span>
              </div>
              <span aria-hidden="true" className="text-slate-700">·</span>
              <div>
                <span className="text-slate-500">Rating:</span>{' '}
                <span className="text-amber-400 font-medium tabular-nums">{game.rating.toFixed(1)} / 5.0</span>
              </div>
              <span aria-hidden="true" className="text-slate-700">·</span>
              <div>
                <span className="text-slate-500">Total Plays:</span>{' '}
                <span className="text-slate-200 font-medium tabular-nums">{game.plays.toLocaleString()}</span>
              </div>
              {game.releaseYear && (
                <>
                  <span aria-hidden="true" className="text-slate-700">·</span>
                  <div>
                    <span className="text-slate-500">Year:</span>{' '}
                    <span className="text-slate-200 font-medium">{game.releaseYear}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Controls Card */}
          <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800">
            <h3 className="text-sm font-semibold text-white font-display flex items-center gap-2">
              <Keyboard className="w-4 h-4 text-indigo-400" />
              <span>Key Controls & Guide</span>
            </h3>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {game.controls.map((ctrl, idx) => (
                <div
                  key={idx}
                  className="px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                  <span>{ctrl}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Related Games */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-300 font-display">
            Recommended Games
          </h3>

          <div className="space-y-2.5">
            {relatedGames.map((rel) => (
              <div
                key={rel.id}
                onClick={() => onSelectGame(rel)}
                className="group flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all"
              >
                <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-950 shrink-0">
                  <img
                    src={rel.thumbnail}
                    alt={rel.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-semibold text-slate-200 group-hover:text-indigo-400 transition-colors truncate">
                    {rel.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                    <span>{rel.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-amber-400 font-medium">★ {rel.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
