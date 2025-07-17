'use client';

import React, { useState, useEffect } from 'react';
import { Board, createInitialBoard, initialPieces, Piece, Player, Square, pieceRules } from './lib/gungi';

// --- Helper Functions ---

function isMoveValid(from: {row: number, col: number}, to: {row: number, col: number}, piece: Piece, board: Board, player: Player): boolean {
  const rule = pieceRules[piece.type];
  if (!rule) return false;

  const dy = to.row - from.row;
  const dx = to.col - from.col;
  const adx = Math.abs(dx);
  const ady = Math.abs(dy);

  // Player 2 moves in the opposite direction for forward-only pieces
  const playerMod = (player === 'Player 1') ? -1 : 1;
  
  let movePattern = rule.moves.find(([vy, vx]) => {
    if (piece.type === 'pawn' || piece.type === 'spear') {
      return vy * playerMod === dy && vx === dx;
    }
    return (vy === dy && vx === dx) || (vy === -dy && vx === -dx) || (vy === dy && vx === -dx) || (vy === -dy && vx === dx);
  });

  if (!movePattern) return false;

  // Check distance
  if (adx > rule.maxSteps || ady > rule.maxSteps) return false;

  // Check for obstacles (if it cannot jump)
  if (!rule.canJump && rule.maxSteps > 1) {
    let r = from.row + Math.sign(dy);
    let c = from.col + Math.sign(dx);
    while (r !== to.row || c !== to.col) {
      if (board[r][c].stack.length > 0) return false; // Path is blocked
      r += Math.sign(dy);
      c += Math.sign(dx);
    }
  }

  return true;
}

// --- Components ---

const HandPiece = ({ piece, isSelected, onClick }: { piece: Omit<Piece, 'id' | 'owner'>, isSelected: boolean, onClick: () => void }) => (
  <div 
    onClick={onClick}
    className={`relative w-10 h-10 sm:w-12 sm:h-12 bg-yellow-900 border-2 ${isSelected ? 'border-yellow-400 ring-2 ring-yellow-300' : 'border-yellow-950'} rounded-md flex items-center justify-center font-bold text-lg sm:text-xl text-white cursor-pointer hover:bg-yellow-700 transition-all`}>
    {piece.name}
  </div>
);

const BoardSquare = ({ square, isSelected, onClick }: { square: Square, isSelected: boolean, onClick: () => void }) => {
  const topPiece = square.stack.length > 0 ? square.stack[square.stack.length - 1] : null;

  return (
    <div
      onClick={onClick}
      className={`
        w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20
        flex items-center justify-center
        border border-black/50
        ${(square.row + square.col) % 2 === 0 ? 'bg-yellow-700' : 'bg-yellow-800'}
        hover:bg-yellow-600 transition-colors duration-200 cursor-pointer
        relative
        ${isSelected ? 'ring-4 ring-yellow-400 ring-inset' : ''}
      `}
    >
      {topPiece && (
        <>
          <div className={`font-bold text-2xl ${topPiece.owner === 'Player 1' ? 'text-white' : 'text-gray-400'}`}>
            {topPiece.name}
          </div>
          {square.stack.length > 1 && (
            <div className="absolute bottom-0 right-0 bg-blue-800 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-yellow-800">
              {square.stack.length}
            </div>
          )}
        </>
      )}
    </div>
  );
};

const GameOverModal = ({ winner, onRestart }: { winner: Player, onRestart: () => void }) => (
  <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
    <div className="bg-gray-800 p-8 rounded-lg text-center shadow-xl">
      <h2 className="text-4xl font-bold text-yellow-400 mb-4">Game Over</h2>
      <p className="text-2xl text-white mb-8">{winner} wins!</p>
      <button onClick={onRestart} className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-2 px-6 rounded-lg text-lg">
        Play Again
      </button>
    </div>
  </div>
);

// --- Main Page Component ---

const GungiPage = () => {
  const [board, setBoard] = useState<Board>(createInitialBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>('Player 1');
  const [player1Hand, setPlayer1Hand] = useState(initialPieces);
  const [player2Hand, setPlayer2Hand] = useState(initialPieces);
  const [selectedHandPiece, setSelectedHandPiece] = useState<{piece: Omit<Piece, 'id' | 'owner'>, index: number} | null>(null);
  const [selectedBoardPiece, setSelectedBoardPiece] = useState<{piece: Piece, row: number, col: number} | null>(null);
  const [winner, setWinner] = useState<Player | null>(null);

  const restartGame = () => {
    setBoard(createInitialBoard());
    setCurrentPlayer('Player 1');
    setPlayer1Hand(initialPieces);
    setPlayer2Hand(initialPieces);
    setSelectedHandPiece(null);
    setSelectedBoardPiece(null);
    setWinner(null);
  }

  useEffect(() => {
    // Check for a winner whenever the board changes
    const generals = board.flat().flatMap(s => s.stack).filter(p => p.type === 'general');
    const p1General = generals.find(p => p.owner === 'Player 1');
    const p2General = generals.find(p => p.owner === 'Player 2');

    if (!p1General) setWinner('Player 2');
    if (!p2General) setWinner('Player 1');
  }, [board]);


  const handleSquareClick = (row: number, col: number) => {
    if (winner) return;
    const newBoard = JSON.parse(JSON.stringify(board));

    // Action 1: Place from hand
    if (selectedHandPiece) {
      const targetSquare = newBoard[row][col];
      if (targetSquare.stack.length >= 3) {
        alert("A stack cannot have more than 3 pieces.");
        return;
      }
      if (targetSquare.stack.length > 0 && targetSquare.stack[0].owner !== currentPlayer) {
        alert("You can only stack on your own pieces.");
        return;
      }

      const newPiece: Piece = { ...selectedHandPiece.piece, id: `p-${Date.now()}`, owner: currentPlayer };
      targetSquare.stack.push(newPiece);
      setBoard(newBoard);

      if (currentPlayer === 'Player 1') setPlayer1Hand(prev => prev.filter((_, i) => i !== selectedHandPiece.index));
      else setPlayer2Hand(prev => prev.filter((_, i) => i !== selectedHandPiece.index));
      
      setSelectedHandPiece(null);
      setCurrentPlayer(p => p === 'Player 1' ? 'Player 2' : 'Player 1');
      return;
    }

    // Action 2: Move on board
    if (selectedBoardPiece) {
      const { piece, row: fromRow, col: fromCol } = selectedBoardPiece;
      if (row === fromRow && col === fromCol) {
        setSelectedBoardPiece(null); return;
      }

      if (isMoveValid({row: fromRow, col: fromCol}, {row, col}, piece, board, currentPlayer)) {
        const fromSquare = newBoard[fromRow][fromCol];
        const toSquare = newBoard[row][col];
        if (fromSquare.stack.length + toSquare.stack.length > 3) {
          alert("Invalid move: Stack would be too high."); return;
        }

        const movingPiece = fromSquare.stack.pop();
        if (movingPiece) toSquare.stack.push(movingPiece);
        setBoard(newBoard);
        setSelectedBoardPiece(null);
        setCurrentPlayer(p => p === 'Player 1' ? 'Player 2' : 'Player 1');
      } else {
        alert("Invalid move for this piece.");
        setSelectedBoardPiece(null);
      }
    } else {
      const square = newBoard[row][col];
      if (square.stack.length > 0 && square.stack[square.stack.length - 1].owner === currentPlayer) {
        setSelectedBoardPiece({ piece: square.stack[square.stack.length - 1], row, col });
        setSelectedHandPiece(null);
      }
    }
  };

  const handleHandPieceClick = (piece: Omit<Piece, 'id' | 'owner'>, index: number) => {
    if (winner) return;
    if (selectedHandPiece?.index === index) setSelectedHandPiece(null);
    else {
      setSelectedHandPiece({ piece, index });
      setSelectedBoardPiece(null);
    }
  }

  const currentHand = currentPlayer === 'Player 1' ? player1Hand : player2Hand;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-gray-900 text-white p-4 sm:p-8">
      {winner && <GameOverModal winner={winner} onRestart={restartGame} />}
      <div className="w-full max-w-5xl flex justify-between items-center">
        <h1 className="text-4xl sm:text-5xl font-bold font-serif text-yellow-100">軍議</h1>
        <div className="text-right">
          <p className="text-xl text-gray-300">Current Turn</p>
          <p className="text-2xl font-bold text-yellow-400">{currentPlayer}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-9 grid-rows-9 border-4 border-yellow-950 shadow-2xl bg-yellow-800 my-8">
        {board.flat().map((square) => (
          <BoardSquare 
            key={square.id}
            square={square}
            isSelected={selectedBoardPiece?.row === square.row && selectedBoardPiece?.col === square.col}
            onClick={() => handleSquareClick(square.row, square.col)}
          />
        ))}
      </div>

      <div className="w-full max-w-5xl p-4 bg-gray-800 rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-yellow-100">{`${currentPlayer}'s Hand`}</h2>
        <div className="flex flex-wrap gap-2">
          {currentHand.map((p, i) => (
            <HandPiece 
              key={i} 
              piece={p} 
              isSelected={selectedHandPiece?.index === i}
              onClick={() => handleHandPieceClick(p, i)} 
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default GungiPage;