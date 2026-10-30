import React, { useState } from 'react';
import { X, Copy, Check, Download, FileCode, CheckCircle2 } from 'lucide-react';
import { Game } from '../types';

interface JsonViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  games: Game[];
}

export const JsonViewerModal: React.FC<JsonViewerModalProps> = ({
  isOpen,
  onClose,
  games
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Prepare a clean exportable JSON representation of the games with iframes
  const exportable = games.map(({ id, title, category, description, thumbnail, iframeUrl, controls, tags, rating, plays, releaseYear }) => ({
    id,
    title,
    category,
    description,
    thumbnail,
    iframe: `<iframe src="${iframeUrl}" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>`,
    iframeUrl,
    controls,
    tags,
    rating,
    plays,
    releaseYear
  }));

  const jsonString = JSON.stringify(exportable, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'games.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-white">games.json Database</h2>
              <p className="text-xs text-slate-400">
                {games.length} games stored with iframe specs, metadata & ratings
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* JSON Code Area */}
        <div className="mt-4 flex-1 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-3 py-2 bg-slate-950 border border-slate-800 border-b-0 rounded-t-lg text-xs text-slate-400">
            <span className="font-mono text-[11px] text-indigo-400">public/games.json</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer text-xs font-medium"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy JSON'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer text-xs font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .json</span>
              </button>
            </div>
          </div>

          <pre className="flex-1 p-4 bg-slate-950 border border-slate-800 rounded-b-lg font-mono text-xs text-slate-300 overflow-auto whitespace-pre leading-relaxed selection:bg-indigo-500 selection:text-white">
            {jsonString}
          </pre>
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Synced with JSON schema & iframe loader</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
