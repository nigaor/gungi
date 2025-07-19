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
  { name: '小', type: 'major' },{ name: '小', type: 'major' },
  { name: '槍', type: 'spear' },{ name: '槍', type: 'spear' },
  { name: '馬', type: 'knight' }, 
  { name: '忍', type: 'shinobi' },
  { name: '兵', type: 'pawn' },
  { name: '砲', type: 'canon' },
  { name: '筒', type: 'tube' },
  { name: '謀', type: 'commander' },
];

// --- Initial Board Setup ---

const initialSetup: { row: number; col: number; piece: Omit<Piece, 'id' | 'owner'> }[] = [
  // Player 1 (Bottom)
  { row: 6, col: 0, piece: { name: '兵', type: 'pawn' } },
  { row: 6, col: 2, piece: { name: '砦', type: 'fort' } },
  { row: 6, col: 3, piece: { name: '侍', type: 'samurai' } },
  { row: 6, col: 4, piece: { name: '兵', type: 'pawn' } },
  { row: 6, col: 5, piece: { name: '侍', type: 'samurai' } },
  { row: 6, col: 6, piece: { name: '砦', type: 'fort' } },
  { row: 6, col: 8, piece: { name: '兵', type: 'pawn' } },
  { row: 7, col: 1, piece: { name: '忍', type: 'shinobi' } },
  { row: 7, col: 2, piece: { name: '弓', type: 'archer' } },
  { row: 7, col: 4, piece: { name: '槍', type: 'spear' } },
  { row: 7, col: 6, piece: { name: '弓', type: 'archer' } },
  { row: 7, col: 7, piece: { name: '馬', type: 'knight' } },
  { row: 8, col: 3, piece: { name: '大', type: 'general' } },
  { row: 8, col: 4, piece: { name: '帥', type: 'king' } },
  { row: 8, col: 5, piece: { name: '中', type: 'lieutenant' } },
  // Player 2 (Top) - Mirrored
  { row: 0, col: 3, piece: { name: '中', type: 'lieutenant' } },
  { row: 0, col: 4, piece: { name: '帥', type: 'king' } },
  { row: 0, col: 5, piece: { name: '大', type: 'general' } },
  { row: 1, col: 1, piece: { name: '馬', type: 'knight' } },
  { row: 1, col: 2, piece: { name: '弓', type: 'archer' } },
  { row: 1, col: 4, piece: { name: '槍', type: 'spear' } },
  { row: 1, col: 6, piece: { name: '弓', type: 'archer' } },
  { row: 1, col: 7, piece: { name: '忍', type: 'shinobi' } },
  { row: 2, col: 0, piece: { name: '兵', type: 'pawn' } },
  { row: 2, col: 2, piece: { name: '砦', type: 'fort' } },
  { row: 2, col: 3, piece: { name: '侍', type: 'samurai' } },
  { row: 2, col: 4, piece: { name: '兵', type: 'pawn' } },
  { row: 2, col: 5, piece: { name: '侍', type: 'samurai' } },
  { row: 2, col: 6, piece: { name: '砦', type: 'fort' } },
  { row: 2, col: 8, piece: { name: '兵', type: 'pawn' } },
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
const diagonalMoves: MoveVector[] = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
const orthogonalMoves: MoveVector[] = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];


export const pieceRules: Record<PieceType, { 
  base: { moves: MoveVector[], maxSteps: number, canJump: boolean, directional: boolean },
  evolved?: { moves: MoveVector[], maxSteps: number, canJump: boolean, directional: boolean },
  mastered?: { moves: MoveVector[], maxSteps: number, canJump: boolean, directional: boolean }
}> = {
  king:      { base: { moves: kingMoves, maxSteps: 1, canJump: false, directional: false } },
  general:   { base: { moves: generalMoves, maxSteps: 1, canJump: false, directional: false } },
  lieutenant:{ base: { moves: lieutenantMoves, maxSteps: 1, canJump: false, directional: false } },
  major:     { base: { moves: majorMoves, maxSteps: 1, canJump: false, directional: false } },
  samurai:   { base: { moves: samuraiMoves, maxSteps: 1, canJump: false, directional: false } },
  spear:     { base: { moves: spearMoves, maxSteps: 1, canJump: false, directional: true } },
  knight:    { 
    base: { moves: knightMoves, maxSteps: 1, canJump: false, directional: false },
    evolved: { moves: [...knightMoves, ...diagonalMoves], maxSteps: 1, canJump: false, directional: false },
    mastered: { moves: [...knightMoves, ...diagonalMoves], maxSteps: 1, canJump: true, directional: false } // Can now jump
  },
  shinobi:   { 
    base: { moves: shinobiMoves, maxSteps: 1, canJump: false, directional: false },
    evolved: { moves: [...shinobiMoves, ...orthogonalMoves], maxSteps: 1, canJump: false, directional: false },
    mastered: { moves: [...shinobiMoves, ...orthogonalMoves], maxSteps: 2, canJump: false, directional: false } // Can now move 2 steps
  },
  fort:      { base: { moves: fortMoves, maxSteps: 1, canJump: false, directional: false } },
  pawn:      { 
    base: { moves: pawnMoves, maxSteps: 1, canJump: false, directional: true },
    evolved: { moves: [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, 0]], maxSteps: 1, canJump: false, directional: true }, // Gold General moves
    mastered: { moves: kingMoves, maxSteps: 1, canJump: false, directional: false }
  },
  canon:     { base: { moves: canonMoves, maxSteps: 1, canJump: false, directional: false } },
  archer:    { base: { moves: archerMoves, maxSteps: 1, canJump: false, directional: true } },
  tube:      { base: { moves: tubeMoves, maxSteps: 1, canJump: false, directional: false } },
  commander: { base: { moves: commanderMoves, maxSteps: 1, canJump: false, directional: false } },
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

  for (const setup of initialSetup) {
    const owner = setup.row > 4 ? 'Player 1' : 'Player 2';
    board[setup.row][setup.col].stack.push({
      ...setup.piece,
      id: `p-${setup.row}-${setup.col}`,
      owner: owner,
    });
  }

  return board;
}


