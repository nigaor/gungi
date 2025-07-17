export type Player = 'Player 1' | 'Player 2';

export type PieceType = 'general' | 'captain' | 'major' | 'knight' | 'archer' | 'shinobi' | 'fort' | 'spear' | 'pawn';

export interface Piece {
  id: string;
  name: string; 
  type: PieceType;
  owner: Player;
}

export interface Square {
  id: string;
  row: number;
  col: number;
  stack: Piece[];
}

export type Board = Square[][];

// --- Piece Definitions ---

export const initialPieces: Omit<Piece, 'id' | 'owner'>[] = [
  { name: '帥', type: 'general' },
  { name: '中', type: 'captain' }, { name: '中', type: 'captain' },
  { name: '大', type: 'major' }, { name: '大', type: 'major' },
  { name: '馬', type: 'knight' }, { name: '馬', type: 'knight' },
  { name: '弓', type: 'archer' }, { name: '弓', type: 'archer' },
  { name: '忍', type: 'shinobi' },
  { name: '砦', type: 'fort' },
  { name: '槍', type: 'spear' },
  { name: '兵', type: 'pawn' }, { name: '兵', type: 'pawn' }, { name: '兵', type: 'pawn' }, { name: '兵', type: 'pawn' }, { name: '兵', type: 'pawn' },
];

// --- Movement Rules (Simplified) ---

// [row, col] pairs
type MoveVector = [number, number];

const kingMoves: MoveVector[] = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
const orthogonalMoves: MoveVector[] = [[-1, 0], [1, 0], [0, -1], [0, 1]];
const diagonalMoves: MoveVector[] = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
const forwardMove: MoveVector[] = [[-1, 0]]; // Player 1 moves up

export const pieceRules: Record<PieceType, { moves: MoveVector[], maxSteps: number, canJump: boolean }> = {
  general: { moves: kingMoves, maxSteps: 1, canJump: false },
  captain: { moves: kingMoves, maxSteps: 1, canJump: false },
  major:   { moves: kingMoves, maxSteps: 1, canJump: false },
  knight:  { moves: orthogonalMoves, maxSteps: 1, canJump: false },
  archer:  { moves: orthogonalMoves, maxSteps: 9, canJump: false }, // Can move far, but not jump
  shinobi: { moves: diagonalMoves, maxSteps: 1, canJump: false },
  fort:    { moves: [], maxSteps: 0, canJump: false }, // Cannot move
  spear:   { moves: forwardMove, maxSteps: 1, canJump: false },
  pawn:    { moves: forwardMove, maxSteps: 1, canJump: false },
};

// --- Board Creation ---

export function createInitialBoard(): Board {
  const board: Board = [];
  for (let row = 0; row < 9; row++) {
    board[row] = [];
    for (let col = 0; col < 9; col++) {
      board[row][col] = { id: `sq-${row}-${col}`, row, col, stack: [] };
    }
  }
  return board;
}


