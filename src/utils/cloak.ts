import { CloakPreset } from '../types';

// High-fidelity SVG Data URIs for authentic browser tab favicons
const ICONS = {
  default: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236366f1'%3E%3Cpath d='M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z'/%3E%3C/svg%3E`,
  
  gdrive: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 87.3 78'%3E%3Cpath d='M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5z' fill='%230066da'/%3E%3Cpath d='M43.65 25L29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44C.4 50 0 51.55 0 53.1h27.5z' fill='%2300ac47'/%3E%3Cpath d='M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.8l5.85 13.8z' fill='%23ea4335'/%3E%3Cpath d='M43.65 25L57.4 1.2C56.05.4 54.5 0 52.9 0H34.4c-1.6 0-3.15.45-4.5 1.2z' fill='%2300832d'/%3E%3Cpath d='M59.8 53.1H27.5L13.75 76.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z' fill='%232684fc'/%3E%3Cpath d='M73.4 26.5l-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25l16.15 28.1h27.5c0-1.55-.4-3.1-1.2-4.5z' fill='%23ffba00'/%3E%3C/svg%3E`,

  classroom: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect x='4' y='8' width='56' height='48' rx='6' fill='%230f9d58'/%3E%3Crect x='8' y='12' width='48' height='40' rx='4' fill='%23285c3f'/%3E%3Ccircle cx='32' cy='26' r='6' fill='%23e0e0e0'/%3E%3Cpath d='M20 44c0-6 6-8 12-8s12 2 12 8z' fill='%23e0e0e0'/%3E%3Ccircle cx='44' cy='28' r='4' fill='%23b0bec5'/%3E%3Cpath d='M38 43c0-3.5 3.5-5 7-5s7 1.5 7 5z' fill='%23b0bec5'/%3E%3Ccircle cx='20' cy='28' r='4' fill='%23b0bec5'/%3E%3Cpath d='M12 43c0-3.5 3.5-5 7-5s7 1.5 7 5z' fill='%23b0bec5'/%3E%3Crect x='4' y='52' width='56' height='4' rx='2' fill='%23f4b400'/%3E%3C/svg%3E`,

  canvas: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='14' fill='%23e02424'/%3E%3Ccircle cx='16' cy='7' r='2.5' fill='white'/%3E%3Ccircle cx='22.5' cy='9.5' r='2.5' fill='white'/%3E%3Ccircle cx='25' cy='16' r='2.5' fill='white'/%3E%3Ccircle cx='22.5' cy='22.5' r='2.5' fill='white'/%3E%3Ccircle cx='16' cy='25' r='2.5' fill='white'/%3E%3Ccircle cx='9.5' cy='22.5' r='2.5' fill='white'/%3E%3Ccircle cx='7' cy='16' r='2.5' fill='white'/%3E%3Ccircle cx='9.5' cy='9.5' r='2.5' fill='white'/%3E%3C/svg%3E`,

  wikipedia: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='15' fill='%23f6f6f6' stroke='%23ccc'/%3E%3Ctext x='16' y='23' font-family='Georgia,serif' font-size='20' font-weight='bold' text-anchor='middle' fill='%23000'%3EW%3C/text%3E%3C/svg%3E`,

  docs: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Cpath fill='%232684fc' d='M30 4H10c-2.2 0-4 1.8-4 4v32c0 2.2 1.8 4 4 4h28c2.2 0 4-1.8 4-4V16L30 4z'/%3E%3Cpath fill='%23005fb8' d='M30 4v12h12L30 4z'/%3E%3Cpath fill='%23fff' d='M14 22h20v2.5H14zm0 6h20v2.5H14zm0 6h14v2.5H14z'/%3E%3C/svg%3E`,

  desmos: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%231976d2'/%3E%3Cpath d='M6 24 C 12 24, 14 8, 20 8 C 24 8, 26 16, 28 16' stroke='white' stroke-width='3.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E`
};

export const CLOAK_PRESETS: CloakPreset[] = [
  {
    id: 'default',
    name: 'Normal (ArcadeVault)',
    title: 'ArcadeVault - Unblocked Games',
    icon: ICONS.default
  },
  {
    id: 'classroom',
    name: 'Google Classroom',
    title: 'Classes',
    icon: ICONS.classroom
  },
  {
    id: 'gdrive',
    name: 'Google Drive',
    title: 'My Drive - Google Drive',
    icon: ICONS.gdrive
  },
  {
    id: 'docs',
    name: 'Google Docs',
    title: 'Biology Chapter 4 Notes - Google Docs',
    icon: ICONS.docs
  },
  {
    id: 'canvas',
    name: 'Canvas LMS',
    title: 'Dashboard',
    icon: ICONS.canvas
  },
  {
    id: 'desmos',
    name: 'Desmos Calculator',
    title: 'Desmos | Graphing Calculator',
    icon: ICONS.desmos
  },
  {
    id: 'wikipedia',
    name: 'Wikipedia',
    title: 'Cellular respiration - Wikipedia',
    icon: ICONS.wikipedia
  }
];

export function applyCloak(presetId: string, customTitle?: string) {
  const preset = CLOAK_PRESETS.find(p => p.id === presetId) || CLOAK_PRESETS[0];
  const newTitle = customTitle?.trim() || preset.title;

  // 1. Update document.title
  document.title = newTitle;

  // 2. Try updating parent/top document title if allowed by same-origin
  try {
    if (window.top && window.top !== window) {
      window.top.document.title = newTitle;
    }
  } catch {
    // Cross-origin restriction (safe to ignore)
  }

  // 3. Remove all existing favicon and icon elements to force browser tab refresh
  const existingIcons = document.querySelectorAll("link[rel*='icon']");
  existingIcons.forEach(el => el.remove());

  // 4. Inject freshly created icon element with Data URI
  const newIcon = document.createElement('link');
  newIcon.rel = 'icon';
  newIcon.type = 'image/svg+xml';
  newIcon.href = preset.icon;
  document.head.appendChild(newIcon);

  // 5. Inject shortcut icon link for older browsers
  const shortcutIcon = document.createElement('link');
  shortcutIcon.rel = 'shortcut icon';
  shortcutIcon.type = 'image/svg+xml';
  shortcutIcon.href = preset.icon;
  document.head.appendChild(shortcutIcon);

  // 6. Save in localStorage
  localStorage.setItem('arcade_cloak', presetId);
  if (customTitle) {
    localStorage.setItem('arcade_cloak_custom_title', customTitle);
  } else {
    localStorage.removeItem('arcade_cloak_custom_title');
  }
}
