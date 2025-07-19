export type Player = 'Player 1' | 'Player 2';

export type PieceType = 'king' | 'general' | 'lieutenant' | 'major' | 'samurai' | 'spear' | 'knight' | 'shinobi' | 'fort' | 'pawn' | 'canon' | 'archer' | 'tube' | 'commander';

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
  { name: '帥', type: 'king' },
  { name: '大', type: 'general' },
  { name: '中', type: 'lieutenant' },
  { name: '小', type: 'major' },
  { name: '侍', type: 'samurai'}, { name: '侍', type: 'samurai'},
  { name: '槍', type: 'spear' },{ name: '槍', type: 'spear' },{ name: '槍', type: 'spear' },
  { name: '馬', type: 'knight' }, { name: '馬', type: 'knight' },
  { name: '忍', type: 'shinobi' },{ name: '忍', type: 'shinobi' },
  { name: '砦', type: 'fort' },{ name: '砦', type: 'fort' },
  { name: '兵', type: 'pawn' }, { name: '兵', type: 'pawn' }, { name: '兵', type: 'pawn' }, { name: '兵', type: 'pawn' },
  { name: '砲', type: 'canon' },
  { name: '弓', type: 'archer' }, { name: '弓', type: 'archer' },
  { name: '筒', type: 'tube' },
  { name: '謀', type: 'commander' },
];

type MoveVector = [number, number];

const kingMoves: MoveVector[] = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
const generalMoves: MoveVector[] = [[1,1], [1,-1], [-1,1], [-1,-1]];
const lieutenantMoves: MoveVector[] = [[-1, 0], [0, 1], [0, -1], [1, 0]];
const majorMoves: MoveVector[] = [[-1, 0], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
const samuraiMoves: MoveVector[] = [[1,1],[1,0], [1,-1],[-1,0]];
const spearMoves: MoveVector[] = [[2,0],[1,1],[1,0],[1,-1],[-1,0]];
const knightMoves: MoveVector[] = [[2,0],[1,0],[0,1],[0,-1],[-1,0],[-2,0]];
const shinobiMoves: MoveVector[] = [[2,2],[2,-2],[1,1],[1,-1],[-1,1],[-1,-1],[-2,2],[-2,-2]];
const fortMoves: MoveVector[] = [[1,0],[0,1],[0,-1],[-1,1],[-1,-1]];
const pawnMoves: MoveVector[] = [[1,0],[-1,0]];
const canonMoves: MoveVector[] = [[3,0],[0,1],[0,-1],[-1,0]];
const archerMoves: MoveVector[] = [[2,-1],[2,0],[2,1],[-1,0]];
const tubeMoves: MoveVector[] = [[2,0],[-1,1],[-1,-1]];
const commanderMoves: MoveVector[] = [[1,1],[1,-1],[-1,0]];


export const pieceRules: Record<PieceType, { moves: MoveVector[], maxSteps: number, canJump: boolean }> = {

  king: { moves: kingMoves, maxSteps: 1, canJump: false },
  general: { moves: generalMoves, maxSteps: 1, canJump: false },
  lieutenant: { moves: lieutenantMoves, maxSteps: 1, canJump: false },
  major:   { moves: majorMoves, maxSteps: 1, canJump: false },
  samurai: { moves: samuraiMoves, maxSteps: 1, canJump: false },
  spear: { moves: spearMoves, maxSteps: 1, canJump: false },
  knight:  { moves: knightMoves, maxSteps: 1, canJump: false },
  shinobi:  { moves: shinobiMoves, maxSteps: 1, canJump: false },
  fort: { moves: fortMoves, maxSteps: 1, canJump: false },
  pawn:    { moves: pawnMoves, maxSteps: 1, canJump: false },
  canon:   { moves: canonMoves, maxSteps: 1, canJump: false },
  archer:    { moves: archerMoves, maxSteps: 1, canJump: false },
  tube: { moves: tubeMoves, maxSteps: 1, canJump: false },
  commander: { moves: commanderMoves, maxSteps: 1, canJump: false },
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


