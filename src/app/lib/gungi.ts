export type Player = 'Player 1' | 'Player 2';

export interface Piece {
  id: string;
  name: string; // e.g., '帥' (General), '中' (Captain), '兵' (Pawn)
  owner: Player;
}

export interface Square {
  id: string;
  row: number;
  col: number;
  stack: Piece[];
}

export type Board = Square[][];

export const initialPieces: Omit<Piece, 'id' | 'owner'>[] = [
  // This is a simplified initial setup. 
  // The real Gungi has a more complex setup phase.
  { name: '帥' }, // General
  { name: '中' }, { name: '中' }, // Captain
  { name: '大' }, { name: '大' }, // Major
  { name: '馬' }, { name: '馬' }, // Knight
  { name: '弓' }, { name: '弓' }, // Archer
  { name: '忍' }, // Shinobi
  { name: '砦' }, // Fort
  { name: '槍' }, // Spear
  { name: '兵' }, { name: '兵' }, { name: '兵' }, { name: '兵' }, { name: '兵' }, // Pawn
];

export function createInitialBoard(): Board {
  const board: Board = [];
  for (let row = 0; row < 9; row++) {
    board[row] = [];
    for (let col = 0; col < 9; col++) {
      board[row][col] = { id: `sq-${row}-${col}`, row, col, stack: [] };
    }
  }
  // For now, we will not place any pieces on the board initially.
  // The placement phase will be handled separately.
  return board;
}


