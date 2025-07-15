'use client';

import React, { useState } from 'react';
import { Board, createInitialBoard, initialPieces, Piece, Player, Square } from './lib/gungi';

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

// --- Main Page Component ---

const GungiPage = () => {
  const [board, setBoard] = useState<Board>(createInitialBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>('Player 1');
  const [player1Hand, setPlayer1Hand] = useState(initialPieces);
  const [player2Hand, setPlayer2Hand] = useState(initialPieces);
  const [selectedHandPiece, setSelectedHandPiece] = useState<{piece: Omit<Piece, 'id' | 'owner'>, index: number} | null>(null);
  const [selectedBoardPiece, setSelectedBoardPiece] = useState<{piece: Piece, row: number, col: number} | null>(null);

  const handleHandPieceClick = (piece: Omit<Piece, 'id' | 'owner'>, index: number) => {
    if (selectedHandPiece?.index === index) {
      setSelectedHandPiece(null);
    } else {
      setSelectedHandPiece({ piece, index });
      setSelectedBoardPiece(null);
    }
  }

  const handleSquareClick = (row: number, col: number) => {
    const newBoard = JSON.parse(JSON.stringify(board)); // Deep copy

    // --- Action 1: Placing a new piece from hand ---
    if (selectedHandPiece) {
      const targetSquare = newBoard[row][col];
      const topPiece = targetSquare.stack.length > 0 ? targetSquare.stack[targetSquare.stack.length - 1] : null;

      if (topPiece && topPiece.owner !== currentPlayer) {
        alert("Cannot place on a square controlled by the opponent.");
        return;
      }
      if (targetSquare.stack.length >= 3) {
        alert("A stack cannot have more than 3 pieces.");
        return;
      }

      const newPiece: Piece = {
        ...selectedHandPiece.piece,
        id: `p-${Date.now()}`,
        owner: currentPlayer,
      };
      targetSquare.stack.push(newPiece);
      setBoard(newBoard);

      if (currentPlayer === 'Player 1') {
        const newHand = [...player1Hand];
        newHand.splice(selectedHandPiece.index, 1);
        setPlayer1Hand(newHand);
      } else {
        const newHand = [...player2Hand];
        newHand.splice(selectedHandPiece.index, 1);
        setPlayer2Hand(newHand);
      }

      setSelectedHandPiece(null);
      setCurrentPlayer(currentPlayer === 'Player 1' ? 'Player 2' : 'Player 1');
      return;
    }

    // --- Action 2: Selecting or Moving a board piece ---
    if (selectedBoardPiece) {
      const { row: fromRow, col: fromCol } = selectedBoardPiece;
      if (row === fromRow && col === fromCol) {
        setSelectedBoardPiece(null); // Deselect
        return;
      }

      const fromSquare = newBoard[fromRow][fromCol];
      const toSquare = newBoard[row][col];
      const isMoveValid = Math.abs(row - fromRow) <= 1 && Math.abs(col - fromCol) <= 1;
      const canStack = fromSquare.stack.length + toSquare.stack.length <= 3;

      if (isMoveValid && canStack) {
        const movingPiece = fromSquare.stack.pop();
        if (movingPiece) {
          toSquare.stack.push(movingPiece);
        }
        setBoard(newBoard);
        setSelectedBoardPiece(null);
        setCurrentPlayer(currentPlayer === 'Player 1' ? 'Player 2' : 'Player 1');
      } else {
        alert("Invalid move. Pieces can move one square and stacks cannot exceed 3 pieces.");
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

  const currentHand = currentPlayer === 'Player 1' ? player1Hand : player2Hand;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-gray-900 text-white p-4 sm:p-8">
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