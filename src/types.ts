export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  cover: string;
}

export type Point = { x: number; y: number };

export type GameState = 'IDLE' | 'PLAYING' | 'GAME_OVER';
