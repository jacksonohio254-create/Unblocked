import React, { useState } from 'react';
import { X, Plus, Code, Eye, AlertCircle } from 'lucide-react';
import { Game } from '../types';

interface AddGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGame: (game: Game) => void;
}

export const AddGameModal: React.FC<AddGameModalProps> = ({
  isOpen,
  onClose,
  onAddGame
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Arcade' | 'Retro' | 'Puzzle' | 'Action' | 'Sports' | 'Strategy' | 'Casual'>('Arcade');
  const [embedCode, setEmbedCode] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [controlsInput, setControlsInput] = useState('');
  const [previewActive, setPreviewActive] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Extract URL or iframe src
  const extractUrl = (raw: string): string => {
    const trimmed = raw.trim();
    if (trimmed.startsWith('<iframe')) {
      const match = trimmed.match(/src=["']([^"']+)["']/i);
      return match ? match[1] : '';
    }
    return trimmed;
  };

  const handleTestPreview = () => {
    const extracted = extractUrl(embedCode);
    if (!extracted) {
      setError('Please enter a valid game URL or iframe embed code.');
      return;
    }
    setError('');
    setPreviewActive(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Game title is required.');
      return;
    }
    const finalUrl = extractUrl(embedCode);
    if (!finalUrl) {
      setError('Please provide a valid game URL or iframe embed code.');
      return;
    }

    const controls = controlsInput
      .split('\n')
      .map(c => c.trim())
      .filter(Boolean);

    const newGame: Game = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      category,
      description: description.trim() || `Play ${title} unblocked directly in your browser.`,
      thumbnail: thumbnail.trim() || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
      iframeUrl: finalUrl,
      controls: controls.length ? controls : ['Standard mouse and keyboard controls'],
      tags: ['Custom', category],
      rating: 5.0,
      plays: 1,
      releaseYear: '2026',
      isCustom: true
    };

    onAddGame(newGame);
    onClose();
  };

  const currentUrl = extractUrl(embedCode);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-white">Add Custom Game Iframe</h2>
              <p className="text-xs text-slate-400">Embed any HTML5 game or iframe link to your library</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-950/60 border border-red-800/80 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Game Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Slope 3D / Retro Bowl"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Arcade">Arcade</option>
                <option value="Retro">Retro</option>
                <option value="Puzzle">Puzzle</option>
                <option value="Action">Action</option>
                <option value="Sports">Sports</option>
                <option value="Strategy">Strategy</option>
                <option value="Casual">Casual</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Thumbnail Image URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Iframe Embed Code or Game URL *
              </label>
              <button
                type="button"
                onClick={handleTestPreview}
                className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
              >
                <Eye className="w-3 h-3" />
                <span>Test Live Preview</span>
              </button>
            </div>
            <textarea
              rows={3}
              required
              placeholder='Paste full iframe like <iframe src="https://..."></iframe> or direct URL'
              value={embedCode}
              onChange={(e) => {
                setEmbedCode(e.target.value);
                setPreviewActive(false);
              }}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {previewActive && currentUrl && (
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
              <div className="text-[11px] font-medium text-slate-400 mb-2">Live Frame Preview:</div>
              <div className="aspect-video w-full rounded border border-slate-800 overflow-hidden bg-black">
                <iframe
                  src={currentUrl}
                  title="Preview"
                  sandbox="allow-scripts allow-same-origin allow-forms"
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Description (Optional)
            </label>
            <input
              type="text"
              placeholder="Brief description of the game gameplay"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Controls (One per line)
            </label>
            <textarea
              rows={2}
              placeholder="Arrow keys to drive&#10;Space to drift"
              value={controlsInput}
              onChange={(e) => setControlsInput(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Save to Games JSON</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
