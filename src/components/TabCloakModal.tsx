import React, { useState } from 'react';
import { X, Shield, Check, Eye, ExternalLink, Keyboard, Monitor } from 'lucide-react';
import { CLOAK_PRESETS, applyCloak } from '../utils/cloak';
import { MaskType } from './ScreenMask';

interface TabCloakModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCloak: string;
  onSelectCloak: (id: string) => void;
  onTriggerScreenMask: (type: MaskType) => void;
}

export const TabCloakModal: React.FC<TabCloakModalProps> = ({
  isOpen,
  onClose,
  currentCloak,
  onSelectCloak,
  onTriggerScreenMask
}) => {
  const [customTitle, setCustomTitle] = useState('');
  const [panicKey, setPanicKey] = useState(() => localStorage.getItem('arcade_panic_key') || ']');

  if (!isOpen) return null;

  const handleApplyPreset = (id: string) => {
    onSelectCloak(id);
    applyCloak(id);
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;
    applyCloak('custom', customTitle.trim());
    onSelectCloak('custom');
  };

  const handlePanicRedirect = () => {
    window.location.href = 'https://classroom.google.com';
  };

  const currentPreset = CLOAK_PRESETS.find(p => p.id === currentCloak) || CLOAK_PRESETS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-white">Stealth & Disguise Suite</h2>
              <p className="text-xs text-slate-400">Tab title, favicon cloaking & instant screen masks</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Active Browser Tab Preview */}
        <div className="mt-4 p-3 bg-slate-950 border border-slate-800 rounded-xl">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Current Tab Appearance</span>
            <span className="text-emerald-400 text-[10px] lowercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active in browser
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-slate-200 shadow-inner">
            <img
              src={currentPreset.icon}
              alt={currentPreset.name}
              className="w-4 h-4 object-contain shrink-0"
            />
            <span className="font-medium truncate flex-1">
              {document.title || currentPreset.title}
            </span>
          </div>
        </div>

        {/* Instant Screen Mask Triggers */}
        <div className="mt-5 space-y-2">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Monitor className="w-3.5 h-3.5 text-indigo-400" />
              <span>Instant Screen Masks (Boss Key)</span>
            </span>
            <span className="text-[11px] text-slate-500 font-mono">Press {panicKey} anytime</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            Instantly covers your game with a real interactive school page when someone walks by:
          </p>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              onClick={() => {
                onClose();
                onTriggerScreenMask('classroom');
              }}
              className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-left transition-all cursor-pointer group"
            >
              <div className="text-xs font-bold text-slate-200 group-hover:text-emerald-400">Classroom</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Bio assignment</div>
            </button>

            <button
              onClick={() => {
                onClose();
                onTriggerScreenMask('docs');
              }}
              className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-left transition-all cursor-pointer group"
            >
              <div className="text-xs font-bold text-slate-200 group-hover:text-blue-400">Google Docs</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Study notes editor</div>
            </button>

            <button
              onClick={() => {
                onClose();
                onTriggerScreenMask('wikipedia');
              }}
              className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-left transition-all cursor-pointer group"
            >
              <div className="text-xs font-bold text-slate-200 group-hover:text-amber-400">Wikipedia</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Cell biology article</div>
            </button>
          </div>
        </div>

        {/* Tab Presets List */}
        <div className="mt-5 space-y-2">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Tab Title & Favicon Disguises
          </div>

          <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto pr-1">
            {CLOAK_PRESETS.map((preset) => {
              const isActive = currentCloak === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleApplyPreset(preset.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-950/60 border-indigo-500/80 text-white shadow-sm'
                      : 'bg-slate-950/50 border-slate-800/80 text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={preset.icon}
                      alt={preset.name}
                      className="w-4 h-4 object-contain"
                    />
                    <div>
                      <div className="text-xs font-semibold">{preset.name}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[240px]">
                        {preset.title}
                      </div>
                    </div>
                  </div>

                  {isActive && <Check className="w-4 h-4 text-indigo-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Tab Title */}
        <form onSubmit={handleApplyCustom} className="mt-4 pt-3 border-t border-slate-800">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Or enter custom tab title..."
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Apply
            </button>
          </div>
        </form>

        {/* Panic Redirect Escape */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Keyboard className="w-3.5 h-3.5 text-slate-500" />
            <span>Hotkeys: Press <code className="text-indigo-400 font-mono font-bold bg-slate-950 px-1 py-0.5 rounded">{panicKey}</code> or <code className="text-indigo-400 font-mono font-bold bg-slate-950 px-1 py-0.5 rounded">`</code></span>
          </div>

          <button
            onClick={handlePanicRedirect}
            className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 transition-colors cursor-pointer"
            title="Immediately redirects tab to Google Classroom"
          >
            <ExternalLink className="w-3 h-3" />
            <span>Emergency Escape</span>
          </button>
        </div>
      </div>
    </div>
  );
};
