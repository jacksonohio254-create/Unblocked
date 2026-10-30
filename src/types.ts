export interface Game {
  id: string;
  title: string;
  category: 'Arcade' | 'Retro' | 'Puzzle' | 'Action' | 'Sports' | 'Strategy' | 'Casual' | 'Custom';
  description: string;
  thumbnail: string;
  iframeUrl: string;
  srcDoc?: string;
  controls: string[];
  tags: string[];
  rating: number;
  plays: number;
  releaseYear?: string;
  isCustom?: boolean;
}

export type Category = 'All' | 'Arcade' | 'Retro' | 'Puzzle' | 'Action' | 'Sports' | 'Strategy';

export interface CloakPreset {
  id: string;
  name: string;
  title: string;
  icon: string;
}
