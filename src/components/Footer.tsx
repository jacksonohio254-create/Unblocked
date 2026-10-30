import React from 'react';
import { Gamepad2, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onOpenCloakModal: () => void;
  onOpenJsonModal: () => void;
  onSelectCategory: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenCloakModal,
  onOpenJsonModal,
  onSelectCategory
}) => {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-slate-950/80 py-10 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-indigo-500" />
            <span className="font-display font-bold text-white text-sm">ArcadeVault</span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span>Unblocked Games Portal</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs">
            <button
              onClick={() => onSelectCategory('All')}
              className="hover:text-slate-200 transition-colors cursor-pointer"
            >
              Browse Games
            </button>
            <button
              onClick={onOpenCloakModal}
              className="hover:text-slate-200 transition-colors cursor-pointer"
            >
              Tab Disguise
            </button>
            <button
              onClick={onOpenJsonModal}
              className="hover:text-slate-200 transition-colors cursor-pointer"
            >
              games.json Spec
            </button>
            <span className="flex items-center gap-1 text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>CORS & Sandbox Safe</span>
            </span>
          </div>

          <div className="text-slate-500 text-center md:text-right">
            <span>Built with HTML, JS, CSS & iframe JSON storage</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
