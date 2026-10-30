import React, { useState, useEffect, useMemo } from 'react';
import defaultGamesData from './data/games.json';
import { Game, Category } from './types';
import { Header } from './components/Header';
import { GameCard } from './components/GameCard';
import { GamePlayer } from './components/GamePlayer';
import { TabCloakModal } from './components/TabCloakModal';
import { AddGameModal } from './components/AddGameModal';
import { JsonViewerModal } from './components/JsonViewerModal';
import { ScreenMask, MaskType } from './components/ScreenMask';
import { Footer } from './components/Footer';
import { applyCloak } from './utils/cloak';
import {
  Search,
  SlidersHorizontal,
  Flame,
  Star,
  Gamepad2,
  Play,
  RotateCcw,
  Sparkles,
  Clock,
  ArrowUpDown,
  ShieldAlert
} from 'lucide-react';

const CATEGORIES: Category[] = [
  'All',
  'Arcade',
  'Retro',
  'Puzzle',
  'Action',
  'Sports',
  'Strategy'
];

export default function App() {
  // Games state (defaults + custom from localStorage)
  const [games, setGames] = useState<Game[]>(() => {
    try {
      const savedCustom = localStorage.getItem('arcade_custom_games');
      const customList: Game[] = savedCustom ? JSON.parse(savedCustom) : [];
      return [...(defaultGamesData as Game[]), ...customList];
    } catch {
      return defaultGamesData as Game[];
    }
  });

  // Current selected active game (null = browse mode)
  const [activeGame, setActiveGame] = useState<Game | null>(null);

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('arcade_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Recently played state
  const [recentIds, setRecentIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('arcade_recent');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Filtering & Sorting
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest' | 'az'>('popular');

  // Modals state
  const [isCloakModalOpen, setIsCloakModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [isScreenMaskOpen, setIsScreenMaskOpen] = useState(false);
  const [maskType, setMaskType] = useState<MaskType>('classroom');
  const [currentCloak, setCurrentCloak] = useState<string>(() => {
    return localStorage.getItem('arcade_cloak') || 'default';
  });

  // Initialize cloak on load
  useEffect(() => {
    const customTitle = localStorage.getItem('arcade_cloak_custom_title') || undefined;
    applyCloak(currentCloak, customTitle);
  }, [currentCloak]);

  // Keyboard shortcut listener for Panic Key / Quick Cloak (] or \ or `)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in text inputs (unless it's Escape)
      const isInput = ['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName);

      if (e.key === 'Escape' && isScreenMaskOpen) {
        setIsScreenMaskOpen(false);
        return;
      }

      if (!isInput) {
        if (e.key === ']' || e.key === '\\') {
          setIsScreenMaskOpen((prev) => !prev);
        } else if (e.key === '`') {
          setIsCloakModalOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isScreenMaskOpen]);

  // Toggle favorite
  const handleToggleFavorite = (e: React.MouseEvent, gameId: string) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = prev.includes(gameId)
        ? prev.filter((id) => id !== gameId)
        : [...prev, gameId];
      localStorage.setItem('arcade_favorites', JSON.stringify(next));
      return next;
    });
  };

  // Launch game
  const handleSelectGame = (game: Game) => {
    setActiveGame(game);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update recently played
    setRecentIds((prev) => {
      const filtered = prev.filter((id) => id !== game.id);
      const next = [game.id, ...filtered].slice(0, 8);
      localStorage.setItem('arcade_recent', JSON.stringify(next));
      return next;
    });

    // Increment play count locally
    setGames((prev) =>
      prev.map((g) => (g.id === game.id ? { ...g, plays: g.plays + 1 } : g))
    );
  };

  // Add custom game
  const handleAddCustomGame = (newGame: Game) => {
    setGames((prev) => {
      const updated = [newGame, ...prev];
      const customOnly = updated.filter((g) => g.isCustom);
      localStorage.setItem('arcade_custom_games', JSON.stringify(customOnly));
      return updated;
    });
    // Auto-launch the newly added game
    setActiveGame(newGame);
  };

  // Launch random game
  const handleRandomGame = () => {
    if (games.length === 0) {
      setIsAddModalOpen(true);
      return;
    }
    const pool = games.filter((g) => g.id !== activeGame?.id);
    if (pool.length === 0) return;
    const random = pool[Math.floor(Math.random() * pool.length)];
    handleSelectGame(random);
  };

  // Filtered & sorted games list
  const filteredGames = useMemo(() => {
    let result = [...games];

    // Filter by category or special tabs
    if (selectedCategory === 'Favorites') {
      result = result.filter((g) => favorites.includes(g.id));
    } else if (selectedCategory === 'Recent') {
      result = result.filter((g) => recentIds.includes(g.id));
      // Keep recent order
      result.sort((a, b) => recentIds.indexOf(a.id) - recentIds.indexOf(b.id));
      return result;
    } else if (selectedCategory !== 'All') {
      result = result.filter((g) => g.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q) ||
          g.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'popular') return b.plays - a.plays;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return (b.releaseYear || '0').localeCompare(a.releaseYear || '0');
      if (sortBy === 'az') return a.title.localeCompare(b.title);
      return 0;
    });

    return result;
  }, [games, selectedCategory, searchQuery, sortBy, favorites, recentIds]);

  // Featured Game Spotlight (guarded if games array is empty)
  const featuredGame = useMemo(() => {
    if (games.length === 0) return null;
    return games.find((g) => g.id === 'tetris-arcade') || games[0];
  }, [games]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Top Bar Navigation */}
      <Header
        onSelectCategory={setSelectedCategory}
        activeFilter={selectedCategory}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenCloakModal={() => setIsCloakModalOpen(true)}
        onOpenJsonModal={() => setIsJsonModalOpen(true)}
        onRandomGame={handleRandomGame}
        onGoHome={() => setActiveGame(null)}
        favoriteCount={favorites.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeGame ? (
          /* Active Game Player View */
          <div className="pt-4">
            <GamePlayer
              game={activeGame}
              onBack={() => setActiveGame(null)}
              isFavorite={favorites.includes(activeGame.id)}
              onToggleFavorite={handleToggleFavorite}
              allGames={games}
              onSelectGame={handleSelectGame}
              onTriggerScreenMask={() => {
                setMaskType('classroom');
                setIsScreenMaskOpen(true);
              }}
            />
          </div>
        ) : (
          /* Lobby / Catalog View */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-10">
            {/* Hero / Spotlight Section */}
            {selectedCategory === 'All' && !searchQuery && featuredGame && (
              <section className="relative rounded-2xl overflow-hidden border border-slate-800 bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-900 p-6 sm:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 tracking-wide uppercase">
                      <Sparkles className="w-4 h-4" />
                      <span>Featured Game Spotlight</span>
                    </div>

                    <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display tracking-tight text-balance">
                      Play Authentic Classic & Unblocked Games Directly in Browser
                    </h1>

                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                      Zero ads, zero blockers, instant 60fps play. Stored cleanly in JSON iframe specifications with built-in tab cloaking disguise.
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => handleSelectGame(featuredGame)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>Play {featuredGame.title}</span>
                      </button>

                      <button
                        onClick={handleRandomGame}
                        className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 text-sm font-medium rounded-xl transition-colors cursor-pointer"
                      >
                        <span>Surprise Me</span>
                      </button>
                    </div>

                    {/* Clean unboxed proof metadata */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center gap-4 text-xs text-slate-400">
                      <span className="tabular-nums font-medium text-slate-200">{games.length} Games Available</span>
                      <span aria-hidden="true" className="text-slate-700">·</span>
                      <span>Safe Iframe Sandbox</span>
                      <span aria-hidden="true" className="text-slate-700">·</span>
                      <span>Offline Capable</span>
                    </div>
                  </div>

                  {/* Right Column Featured Banner Graphic */}
                  <div
                    onClick={() => handleSelectGame(featuredGame)}
                    className="lg:col-span-5 relative aspect-[16/10] rounded-xl overflow-hidden border border-slate-700/70 shadow-2xl group cursor-pointer"
                  >
                    <img
                      src={featuredGame.thumbnail}
                      alt={featuredGame.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5">
                      <div className="flex items-center gap-2 text-xs text-indigo-300 font-medium">
                        <span>{featuredGame.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1 text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{featuredGame.rating}</span>
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-lg text-white mt-0.5">
                        {featuredGame.title}
                      </h3>
                      <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
                        {featuredGame.description}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Filter, Search & Sort Bar */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search games by title, category, or tag..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Sort Selector */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-slate-400 hidden sm:inline flex items-center gap-1">
                    <ArrowUpDown className="w-3.5 h-3.5" />
                    <span>Sort by:</span>
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="rating">Top Rated</option>
                    <option value="newest">Newest First</option>
                    <option value="az">Alphabetical (A-Z)</option>
                  </select>
                </div>
              </div>

              {/* Category Segmented Tabs (Functional filter buttons per Section 1.A) */}
              <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800/80 rounded-xl overflow-x-auto scrollbar-none">
                {CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}

                <button
                  onClick={() => setSelectedCategory('Favorites')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    selectedCategory === 'Favorites'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Star className="w-3 h-3 fill-current" />
                  <span>Favorites ({favorites.length})</span>
                </button>

                {recentIds.length > 0 && (
                  <button
                    onClick={() => setSelectedCategory('Recent')}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                      selectedCategory === 'Recent'
                        ? 'bg-slate-800 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    <span>Recently Played</span>
                  </button>
                )}
              </div>
            </div>

            {/* Games Grid Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-lg text-white">
                  {selectedCategory === 'All'
                    ? 'All Games'
                    : selectedCategory === 'Favorites'
                    ? 'Your Bookmarked Favorites'
                    : selectedCategory === 'Recent'
                    ? 'Recently Played'
                    : `${selectedCategory} Games`}
                </h2>
                <span className="text-xs text-slate-500 tabular-nums">
                  ({filteredGames.length})
                </span>
              </div>
            </div>

            {/* Games Grid */}
            {filteredGames.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    isFavorite={favorites.includes(game.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onSelectGame={handleSelectGame}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-20 px-4 bg-slate-900/40 border border-slate-800/80 rounded-2xl">
                <Gamepad2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-200 font-display">
                  {games.length === 0 ? 'No games in library' : 'No games found'}
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
                  {games.length === 0
                    ? 'All games have been deleted. You can embed your own games via iframe URL or raw HTML code using the Add Game button.'
                    : searchQuery
                    ? `No titles matched "${searchQuery}". Try a different keyword or reset filters.`
                    : selectedCategory === 'Favorites'
                    ? 'You have not favorited any games yet. Click the star icon on any game card to add it to favorites.'
                    : 'No games available in this category.'}
                </p>
                <div className="mt-5 flex items-center justify-center gap-3">
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-sm"
                  >
                    + Add Custom Game
                  </button>
                  <button
                    onClick={() => setIsJsonModalOpen(true)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                  >
                    View games.json
                  </button>
                  {games.length > 0 && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('All');
                      }}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modals & Overlays */}
      <ScreenMask
        isOpen={isScreenMaskOpen}
        onClose={() => setIsScreenMaskOpen(false)}
        maskType={maskType}
      />

      <TabCloakModal
        isOpen={isCloakModalOpen}
        onClose={() => setIsCloakModalOpen(false)}
        currentCloak={currentCloak}
        onSelectCloak={setCurrentCloak}
        onTriggerScreenMask={(type) => {
          setMaskType(type);
          setIsScreenMaskOpen(true);
        }}
      />

      <AddGameModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddGame={handleAddCustomGame}
      />

      <JsonViewerModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        games={games}
      />

      {/* Floating Quick Disguise Button (Discreet in corner) */}
      <button
        onClick={() => {
          setMaskType('classroom');
          setIsScreenMaskOpen(true);
        }}
        className="fixed bottom-4 right-4 z-30 flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 rounded-full shadow-lg backdrop-blur-sm text-xs font-medium cursor-pointer transition-all hover:scale-105 active:scale-95 group"
        title="Instantly covers screen with Google Classroom (Hotkey: ])"
      >
        <ShieldAlert className="w-3.5 h-3.5 text-emerald-400 group-hover:animate-pulse" />
        <span>Disguise Screen</span>
        <kbd className="hidden sm:inline bg-slate-950 px-1.5 py-0.5 rounded text-[10px] text-slate-400 font-mono">]</kbd>
      </button>

      {/* Footer */}
      <Footer
        onOpenCloakModal={() => setIsCloakModalOpen(true)}
        onOpenJsonModal={() => setIsJsonModalOpen(true)}
        onSelectCategory={setSelectedCategory}
      />
    </div>
  );
}
