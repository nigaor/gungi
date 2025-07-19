'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Board, createInitialBoard, initialPieces, Piece, Player, Square, pieceRules } from './lib/gungi';

// --- Components ---

const HandPiece = ({ piece, isSelected, onClick }: { piece: Omit<Piece, 'id' | 'owner'>, isSelected: boolean, onClick: () => void }) => (
  <div 
    onClick={onClick}
    className={`relative w-10 h-10 sm:w-12 sm:h-12 bg-yellow-900 border-2 ${isSelected ? 'border-yellow-400 ring-2 ring-yellow-300' : 'border-yellow-950'} rounded-md flex items-center justify-center font-bold text-lg sm:text-xl text-white cursor-pointer hover:bg-yellow-700 transition-all`}>
    {piece.name}
  </div>
);

const BoardSquare = ({ square, isSelected, isPossibleMove, onClick }: { square: Square, isSelected: boolean, isPossibleMove: boolean, onClick: () => void }) => {
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
        ${isPossibleMove ? 'ring-2 ring-yellow-500 ring-inset' : ''}
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
  const [possibleMoves, setPossibleMoves] = useState<{row: number, col: number}[]>([]);
  const [winner, setWinner] = useState<Player | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  const restartGame = () => {
    setBoard(createInitialBoard());
    setCurrentPlayer('Player 1');
    setPlayer1Hand(initialPieces);
    setPlayer2Hand(initialPieces);
    setSelectedHandPiece(null);
    setSelectedBoardPiece(null);
    setPossibleMoves([]);
    setWinner(null);
    setGameStarted(false);
  }

  const calculatePossibleMoves = useCallback((piece: Piece, fromRow: number, fromCol: number) => {
    const moves: {row: number, col: number}[] = [];
    const rule = pieceRules[piece.type];
    if (!rule) return [];

    const playerMod = (currentPlayer === 'Player 1') ? -1 : 1;

    for (const move of rule.moves) {
        const [dy, dx] = move;
        for (let i = 1; i <= rule.maxSteps; i++) {
            const toRow = fromRow + dy * playerMod;
            const toCol = fromCol + dx * playerMod;

            if (toRow < 0 || toRow > 8 || toCol < 0 || toCol > 8) break;

            const targetSquare = board[toRow][toCol];
            if (board[fromRow][fromCol].stack.length + targetSquare.stack.length > 3) break;

            moves.push({ row: toRow, col: toCol });

            if (targetSquare.stack.length > 0 && !rule.canJump) break;
        }
    }
    return moves;
  }, [board, currentPlayer]);

  useEffect(() => {
    const generalsOnBoard = board.flat().flatMap(s => s.stack).filter(p => p.type === 'general');
    const p1GeneralOnBoard = generalsOnBoard.some(p => p.owner === 'Player 1');
    const p2GeneralOnBoard = generalsOnBoard.some(p => p.owner === 'Player 2');

    if (p1GeneralOnBoard && p2GeneralOnBoard) {
      setGameStarted(true);
    }

    if (gameStarted) {
      if (!p1GeneralOnBoard) setWinner('Player 2');
      if (!p2GeneralOnBoard) setWinner('Player 1');
    }
  }, [board, gameStarted]);

  const handleSquareClick = (row: number, col: number) => {
    if (winner) return;
    const newBoard = JSON.parse(JSON.stringify(board));

    // Action: Place from hand
    if (selectedHandPiece) {
      const targetSquare = newBoard[row][col];
      if (targetSquare.stack.length >= 3 || (targetSquare.stack.length > 0 && targetSquare.stack[0].owner !== currentPlayer)) {
        alert("Invalid placement."); return;
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

    // Action: Move on board
    if (selectedBoardPiece) {
      const { piece, row: fromRow, col: fromCol } = selectedBoardPiece;
      if (row === fromRow && col === fromCol) {
        setSelectedBoardPiece(null); setPossibleMoves([]); return;
      }

      if (possibleMoves.some(m => m.row === row && m.col === col)) {
        const fromSquare = newBoard[fromRow][fromCol];
        const toSquare = newBoard[row][col];
        const movingPiece = fromSquare.stack.pop();
        if (movingPiece) toSquare.stack.push(movingPiece);
        setBoard(newBoard);
        setSelectedBoardPiece(null);
        setPossibleMoves([]);
        setCurrentPlayer(p => p === 'Player 1' ? 'Player 2' : 'Player 1');
      } else {
        alert("Invalid move for this piece.");
      }
    } else {
      const square = newBoard[row][col];
      if (square.stack.length > 0 && square.stack[square.stack.length - 1].owner === currentPlayer) {
        const pieceToSelect = square.stack[square.stack.length - 1];
        setSelectedBoardPiece({ piece: pieceToSelect, row, col });
        setPossibleMoves(calculatePossibleMoves(pieceToSelect, row, col));
        setSelectedHandPiece(null);
      }
    }
  };

  const handleHandPieceClick = (piece: Omit<Piece, 'id' | 'owner'>, index: number) => {
    if (winner) return;
    if (selectedHandPiece?.index === index) {
      setSelectedHandPiece(null);
    } else {
      setSelectedHandPiece({ piece, index });
      setSelectedBoardPiece(null);
      setPossibleMoves([]);
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
            isPossibleMove={possibleMoves.some(m => m.row === square.row && m.col === square.col)}
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