export type Player = "Player 1" | "Player 2";

export type PieceType =
  | "king"
  | "general"
  | "lieutenant"
  | "major"
  | "samurai"
  | "spear"
  | "knight"
  | "shinobi"
  | "fort"
  | "pawn"
  | "canon"
  | "archer"
  | "tube"
  | "commander";

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

export const initialPieces: Omit<Piece, "id" | "owner">[] = [
  { name: "小", type: "major" },
  { name: "小", type: "major" },
  { name: "槍", type: "spear" },
  { name: "槍", type: "spear" },
  { name: "馬", type: "knight" },
  { name: "忍", type: "shinobi" },
  { name: "兵", type: "pawn" },
  { name: "砲", type: "canon" },
  { name: "筒", type: "tube" },
  { name: "謀", type: "commander" },
];

const initialSetup: {
  row: number;
  col: number;
  piece: Omit<Piece, "id" | "owner">;
}[] = [
  // Player 1 (Bottom)
  { row: 6, col: 0, piece: { name: "兵", type: "pawn" } },
  { row: 6, col: 2, piece: { name: "砦", type: "fort" } },
  { row: 6, col: 3, piece: { name: "侍", type: "samurai" } },
  { row: 6, col: 4, piece: { name: "兵", type: "pawn" } },
  { row: 6, col: 5, piece: { name: "侍", type: "samurai" } },
  { row: 6, col: 6, piece: { name: "砦", type: "fort" } },
  { row: 6, col: 8, piece: { name: "兵", type: "pawn" } },
  { row: 7, col: 1, piece: { name: "忍", type: "shinobi" } },
  { row: 7, col: 2, piece: { name: "弓", type: "archer" } },
  { row: 7, col: 4, piece: { name: "槍", type: "spear" } },
  { row: 7, col: 6, piece: { name: "弓", type: "archer" } },
  { row: 7, col: 7, piece: { name: "馬", type: "knight" } },
  { row: 8, col: 3, piece: { name: "大", type: "general" } },
  { row: 8, col: 4, piece: { name: "帥", type: "king" } },
  { row: 8, col: 5, piece: { name: "中", type: "lieutenant" } },
  // Player 2 (Top) - Mirrored
  { row: 0, col: 3, piece: { name: "中", type: "lieutenant" } },
  { row: 0, col: 4, piece: { name: "帥", type: "king" } },
  { row: 0, col: 5, piece: { name: "大", type: "general" } },
  { row: 1, col: 1, piece: { name: "馬", type: "knight" } },
  { row: 1, col: 2, piece: { name: "弓", type: "archer" } },
  { row: 1, col: 4, piece: { name: "槍", type: "spear" } },
  { row: 1, col: 6, piece: { name: "弓", type: "archer" } },
  { row: 1, col: 7, piece: { name: "忍", type: "shinobi" } },
  { row: 2, col: 0, piece: { name: "兵", type: "pawn" } },
  { row: 2, col: 2, piece: { name: "砦", type: "fort" } },
  { row: 2, col: 3, piece: { name: "侍", type: "samurai" } },
  { row: 2, col: 4, piece: { name: "兵", type: "pawn" } },
  { row: 2, col: 5, piece: { name: "侍", type: "samurai" } },
  { row: 2, col: 6, piece: { name: "砦", type: "fort" } },
  { row: 2, col: 8, piece: { name: "兵", type: "pawn" } },
];

type MoveVector = [number, number];
//1段目の駒の動き
const kingMoves: MoveVector[] = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];
const generalMoves: MoveVector[] = [
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];
const lieutenantMoves: MoveVector[] = [
  [-1, 0],
  [0, 1],
  [0, -1],
  [1, 0],
];
const majorMoves: MoveVector[] = [
  [-1, 0],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];
const samuraiMoves: MoveVector[] = [
  [1, 1],
  [1, 0],
  [1, -1],
  [-1, 0],
];
const spearMoves: MoveVector[] = [
  [2, 0],
  [1, 1],
  [1, 0],
  [1, -1],
  [-1, 0],
];
const knightMoves: MoveVector[] = [
  [2, 0],
  [1, 0],
  [0, 1],
  [0, -1],
  [-1, 0],
  [-2, 0],
];
const shinobiMoves: MoveVector[] = [
  [2, 2],
  [2, -2],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
  [-2, 2],
  [-2, -2],
];
const fortMoves: MoveVector[] = [
  [1, 0],
  [0, 1],
  [0, -1],
  [-1, 1],
  [-1, -1],
];
const pawnMoves: MoveVector[] = [
  [1, 0],
  [-1, 0],
];
const canonMoves: MoveVector[] = [
  [3, 0],
  [0, 1],
  [0, -1],
  [-1, 0],
];
const archerMoves: MoveVector[] = [
  [2, -1],
  [2, 0],
  [2, 1],
  [-1, 0],
];
const tubeMoves: MoveVector[] = [
  [2, 0],
  [-1, 1],
  [-1, -1],
];
const commanderMoves: MoveVector[] = [
  [1, 1],
  [1, -1],
  [-1, 0],
];

// 2段目の駒の動き
const kingevolMoves: MoveVector[] = [
  [2, 2],
  [2, 0],
  [2, -2],
  [0, 2],
  [0, -2],
  [-2, 2],
  [-2, 0],
  [-2, -2],
];
const generalevolMoves: MoveVector[] = [
  [2, 2],
  [2, -2],
  [-2, 2],
  [-2, -2],
];
const lieutenantevolMoves: MoveVector[] = [
  [2, 0],
  [0, 2],
  [0, -2],
  [-2, 0],
];
const majorevolMoves: MoveVector[] = [
  [2, 2],
  [2, 0],
  [2, -2],
  [0, 2],
  [0, -2],
  [-2, 0],
];
const samuraievolMoves: MoveVector[] = [
  [2, 2],
  [2, 0],
  [2, -2],
  [-2, 0],
];
const spearevolMoves: MoveVector[] = [
  [3, 0],
  [2, 2],
  [2, -2],
  [-2, 0],
];
const knightevolMoves: MoveVector[] = [
  [3, 0],
  [0, 2],
  [0, -2],
  [-3, 0],
];
const shinobievolMoves: MoveVector[] = [
  [3, 3],
  [3, -3],
  [-3, 3],
  [-3, -3],
];
const fortevolMoves: MoveVector[] = [
  [2, 0],
  [0, 2],
  [0, -2],
  [-2, 2],
  [-2, -2],
];
const pawnevolMoves: MoveVector[] = [
  [2, 0],
  [-2, 0],
];
const canonevolMoves: MoveVector[] = [
  [4, 0],
  [0, 2],
  [0, -2],
  [-2, 0],
];
const archerevolMoves: MoveVector[] = [
  [3, 2],
  [3, 0],
  [3, -2],
  [-2, 0],
];
const tubeevolMoves: MoveVector[] = [
  [2, 0],
  [-2, 2],
  [-2, -2],
];
const commanderevolMoves: MoveVector[] = [
  [2, 2],
  [2, -2],
  [-2, 0],
];

//3段目の駒の動き
const kingmasMoves: MoveVector[] = [
  [3, 3],
  [3, 0],
  [3, -3],
  [0, 3],
  [0, -3],
  [-3, 3],
  [-3, 0],
  [-3, -3],
];
const generalmasMoves: MoveVector[] = [
  [3, 3],
  [3, -3],
  [-3, 3],
  [-3, -3],
];
const lieutenantmasMoves: MoveVector[] = [
  [3, 0],
  [0, 3],
  [0, -3],
  [-3, 0],
];
const majormasMoves: MoveVector[] = [
  [3, 3],
  [3, 0],
  [3, -3],
  [0, 3],
  [0, -3],
  [-3, 0],
];
const samuraimasMoves: MoveVector[] = [
  [3, 3],
  [3, 0],
  [3, -3],
  [-3, 0],
];
const spearmasMoves: MoveVector[] = [
  [4, 0],
  [3, 3],
  [3, -3],
  [-3, 0],
];
const knightmasMoves: MoveVector[] = [
  [4, 0],
  [0, 3],
  [0, -3],
  [-4, 0],
];
const shinobimasMoves: MoveVector[] = [
  [4, 4],
  [4, -4],
  [-4, 4],
  [-4, -4],
];
const fortmasMoves: MoveVector[] = [
  [3, 0],
  [0, 3],
  [0, -3],
  [-3, 3],
  [-3, -3],
];
const pawnmasMoves: MoveVector[] = [
  [3, 0],
  [-3, 0],
];
const canonmasMoves: MoveVector[] = [
  [5, 0],
  [0, 3],
  [0, -3],
  [-3, 0],
];
const archermasMoves: MoveVector[] = [
  [4, 3],
  [4, 0],
  [4, -3],
  [-3, 0],
];
const tubemasMoves: MoveVector[] = [
  [4, 0],
  [-3, 3],
  [-3, -3],
];
const commandermasMoves: MoveVector[] = [
  [3, 3],
  [3, -3],
  [-3, 0],
];

export const pieceRules: Record<
  PieceType,
  {
    base: {
      moves: MoveVector[];
      maxSteps: number;
      canJump: boolean;
      directional: boolean;
    };
    evolved?: {
      moves: MoveVector[];
      maxSteps: number;
      canJump: boolean;
      directional: boolean;
    };
    mastered?: {
      moves: MoveVector[];
      maxSteps: number;
      canJump: boolean;
      directional: boolean;
    };
  }
> = {
  king: {
    base: { moves: kingMoves, maxSteps: 1, canJump: false, directional: false },
    evolved: {
      moves: [...kingMoves, ...kingevolMoves],
      maxSteps: 1,
      canJump: false,
      directional: false,
    },
    mastered: {
      moves: [...kingMoves, ...kingevolMoves, ...kingmasMoves],
      maxSteps: 1,
      canJump: false,
      directional: false,
    },
  },
  general: {
    base: {
      moves: generalMoves,
      maxSteps: 1,
      canJump: false,
      directional: false,
    },
    evolved: {
      moves: [...generalMoves, ...generalevolMoves],
      maxSteps: 1,
      canJump: false,
      directional: false,
    },
    mastered: {
      moves: [...generalMoves, ...generalevolMoves, ...generalmasMoves],
      maxSteps: 1,
      canJump: false,
      directional: false,
    },
  },
  lieutenant: {
    base: {
      moves: lieutenantMoves,
      maxSteps: 1,
      canJump: false,
      directional: false,
    },
    evolved: {
      moves: [...lieutenantMoves, ...lieutenantevolMoves],
      maxSteps: 1,
      canJump: false,
      directional: false,
    },
    mastered: {
      moves: [
        ...lieutenantMoves,
        ...lieutenantevolMoves,
        ...lieutenantmasMoves,
      ],
      maxSteps: 1,
      canJump: false,
      directional: false,
    },
  },
  major: {
    base: {
      moves: majorMoves,
      maxSteps: 1,
      canJump: false,
      directional: false,
    },
    evolved: {
      moves: [...majorMoves, ...majorevolMoves],
      maxSteps: 1,
      canJump: false,
      directional: false,
    },
    mastered: {
      moves: [...majorMoves, ...majorevolMoves, ...majormasMoves],
      maxSteps: 1,
      canJump: false,
      directional: false,
    },
  },
  samurai: {
    base: {
      moves: samuraiMoves,
      maxSteps: 1,
      canJump: false,
      directional: false,
    },
    evolved: {
      moves: [...samuraiMoves, ...samuraievolMoves],
      maxSteps: 1,
      canJump: false,
      directional: false,
    },
    mastered: {
      moves: [...samuraiMoves, ...samuraievolMoves, ...samuraimasMoves],
      maxSteps: 1,
      canJump: false,
      directional: false,
    },
  },
  spear: {
    base: {
      moves: spearMoves,
      maxSteps: 1,
      canJump: false,
      directional: false,
    },
    evolved: {
      moves: [...spearMoves, ...spearevolMoves],
      maxSteps: 1,
      canJump: false,
      directional: false,
    },
    mastered: {
      moves: [...spearMoves, ...spearevolMoves, ...spearmasMoves],
      maxSteps: 1,
      canJump: false,
      directional: false,
    },
  },
  knight: {
    base: {
      moves: knightMoves,
      maxSteps: 1,
      canJump: false,
      directional: false,
    },
    evolved: {
      moves: [...knightMoves, ...knightevolMoves],
      maxSteps: 1,
      canJump: false,
      directional: false,
    },
    mastered: {
      moves: [...knightMoves, ...knightevolMoves, ...knightmasMoves],
      maxSteps: 1,
      canJump: true,
      directional: false,
    },
  },
  shinobi: {
    base: {
      moves: shinobiMoves,
      maxSteps: 1,
      canJump: false,
      directional: false,
    },
    evolved: {
      moves: [...shinobiMoves, ...shinobievolMoves],
      maxSteps: 1,
      canJump: false,
      directional: false,
    },
    mastered: {
      moves: [...shinobiMoves, ...shinobievolMoves, ...shinobimasMoves],
      maxSteps: 1,
      canJump: true,
      directional: false,
    },
  },
  fort: {
    base: { moves: fortMoves, maxSteps: 1, canJump: false, directional: false },
    evolved: {
      moves: [...fortMoves, ...fortevolMoves],
      maxSteps: 1,
      canJump: false,
      directional: false,
    },
    mastered: {
      moves: [...fortMoves, ...fortevolMoves, ...fortmasMoves],
      maxSteps: 1,
      canJump: true,
      directional: false,
    },
  },
  pawn: {
    base: { moves: pawnMoves, maxSteps: 1, canJump: false, directional: false },
    evolved: {
      moves: [...pawnMoves, ...pawnevolMoves],
      maxSteps: 1,
      canJump: false,
      directional: false,
    },
    mastered: {
      moves: [...pawnMoves, ...pawnevolMoves, ...pawnmasMoves],
      maxSteps: 1,
      canJump: true,
      directional: false,
    },
  },
  canon: {
    base: {
      moves: canonMoves,
      maxSteps: 1,
      canJump: false,
      directional: false,
    },
    evolved: {
      moves: [...canonMoves, ...canonevolMoves],
      maxSteps: 1,
      canJump: false,
      directional: false,
    },
    mastered: {
      moves: [...canonMoves, ...canonevolMoves, ...canonmasMoves],
      maxSteps: 1,
      canJump: true,
      directional: false,
    },
  },
  archer: {
    base: {
      moves: archerMoves,
      maxSteps: 1,
      canJump: false,
      directional: false,
    },
    evolved: {
      moves: [...archerMoves, ...archerevolMoves],
      maxSteps: 1,
      canJump: false,
      directional: false,
    },
    mastered: {
      moves: [...archerMoves, ...archerevolMoves, ...archermasMoves],
      maxSteps: 1,
      canJump: true,
      directional: false,
    },
  },
  tube: {
    base: { moves: tubeMoves, maxSteps: 1, canJump: false, directional: false },
    evolved: {
      moves: [...tubeMoves, ...tubeevolMoves],
      maxSteps: 1,
      canJump: false,
      directional: false,
    },
    mastered: {
      moves: [...tubeMoves, ...tubeevolMoves, ...tubemasMoves],
      maxSteps: 1,
      canJump: true,
      directional: false,
    },
  },
  commander: {
    base: {
      moves: commanderMoves,
      maxSteps: 1,
      canJump: false,
      directional: false,
    },
    evolved: {
      moves: [...commanderMoves, ...commanderevolMoves],
      maxSteps: 1,
      canJump: false,
      directional: false,
    },
    mastered: {
      moves: [...commanderMoves, ...commanderevolMoves, ...commandermasMoves],
      maxSteps: 1,
      canJump: true,
      directional: false,
    },
  },
};

// --- Board Creation ---

export function createInitialBoard(): Board {
  const board: Board = [];
  const boardLength = 9;
  for (let row = 0; row < boardLength; row++) {
    board[row] = [];
    for (let col = 0; col < boardLength; col++) {
      board[row][col] = { id: `sq-${row}-${col}`, row, col, stack: [] };
    }
  }

  for (const setup of initialSetup) {
    const owner = setup.row > 4 ? "Player 1" : "Player 2";
    board[setup.row][setup.col].stack.push({
      ...setup.piece,
      id: `p-${setup.row}-${setup.col}`,
      owner: owner,
    });
  }

  return board;
}
