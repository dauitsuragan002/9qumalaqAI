// Types for the game state
export interface GameState {
  board: number[][];
  kazan: [number, number]; // [player1Score, player2Score]
  currentPlayer: 1 | 2;
  selectedHole: [number, number] | null;
  gameOver: boolean;
  winner: 1 | 2 | null;
  tuzdik: [number, number] | null; // [player, position] - Special "sacred" hole
}

// Initial game state
export const initialGameState: GameState = {
  board: [
    [9, 9, 9, 9, 9, 9, 9, 9, 9], // Player 1 (bottom row)
    [9, 9, 9, 9, 9, 9, 9, 9, 9]  // Player 2 (top row)
  ],
  kazan: [0, 0],
  currentPlayer: 1,
  selectedHole: null,
  gameOver: false,
  winner: null,
  tuzdik: null,
};

// Check if game is over
export const checkGameOver = (state: GameState): boolean => {
  // Game is over if a player has 81 or more balls in their kazan
  if (state.kazan[0] >= 81 || state.kazan[1] >= 81) {
    return true;
  }

  // Game is over if one player's row is empty
  const player1Empty = state.board[0].every(hole => hole === 0);
  const player2Empty = state.board[1].every(hole => hole === 0);
  
  return player1Empty || player2Empty;
};

// Get the winner of the game
export const getWinner = (state: GameState): 1 | 2 | null => {
  if (!state.gameOver) return null;
  
  if (state.kazan[0] > state.kazan[1]) {
    return 1;
  } else if (state.kazan[1] > state.kazan[0]) {
    return 2;
  }
  
  return null; // Draw
};

// Check if a move is valid
export const isValidMove = (state: GameState, row: number, col: number): boolean => {
  // Can only move on your own side
  const playerRow = state.currentPlayer === 1 ? 0 : 1;
  
  // The hole must belong to the current player and have at least one ball
  return row === playerRow && state.board[row][col] > 0;
};

// Get the next position in counter-clockwise direction
const getNextPosition = (row: number, col: number): [number, number] => {
  if (row === 0) { // Player 1 row (bottom)
    if (col > 0) {
      return [0, col - 1]; // Move left
    } else {
      return [1, 0]; // Move to player 2 leftmost hole
    }
  } else { // Player 2 row (top)
    if (col < 8) {
      return [1, col + 1]; // Move right
    } else {
      return [0, 8]; // Move to player 1 rightmost hole
    }
  }
};

// Implementation of proper Togyz Kumalak rules
export const makeMove = (state: GameState, row: number, col: number): GameState => {
  if (!isValidMove(state, row, col) || state.gameOver) {
    return state;
  }

  // Clone the state to avoid mutations
  const newState = JSON.parse(JSON.stringify(state)) as GameState;
  
  // Get the number of pieces in the selected hole
  let pieces = newState.board[row][col];
  newState.board[row][col] = 0;
  
  // Distribute the pieces counterclockwise
  let currentRow = row;
  let currentCol = col;
  
  while (pieces > 0) {
    // Move to the next position
    [currentRow, currentCol] = getNextPosition(currentRow, currentCol);
    
    // Skip the tuzdik hole if it exists and belongs to the opponent
    if (newState.tuzdik && 
        newState.tuzdik[0] !== newState.currentPlayer && 
        currentRow === (newState.tuzdik[0] === 1 ? 0 : 1) && 
        currentCol === newState.tuzdik[1]) {
      continue;
    }
    
    newState.board[currentRow][currentCol]++;
    pieces--;
  }
  
  // Check for tuzdik creation
  // In Togyz Kumalak, a hole with 3 balls after a move can become a tuzdik
  // if it's on the opponent's side and not the 9th position
  const isOpponentSide = currentRow !== (newState.currentPlayer === 1 ? 0 : 1);
  const isNotNinthPosition = currentCol !== 8; // 9th position (index 8) cannot be tuzdik
  
  if (newState.board[currentRow][currentCol] === 3 && isOpponentSide && isNotNinthPosition && !newState.tuzdik) {
    // Create tuzdik
    newState.tuzdik = [newState.currentPlayer, currentCol];
    // In tuzdik, stones remain but belong to the player who created it
  }
  
  // Check for captures
  // In Togyz Kumalak, if the last stone lands in an opponent's hole and makes it even (2, 4, 6, etc.)
  // the player captures all stones from that hole
  if (isOpponentSide && newState.board[currentRow][currentCol] % 2 === 0) {
    const playerIndex = newState.currentPlayer === 1 ? 0 : 1;
    newState.kazan[playerIndex] += newState.board[currentRow][currentCol];
    newState.board[currentRow][currentCol] = 0;
  }
  
  // Switch players
  newState.currentPlayer = newState.currentPlayer === 1 ? 2 : 1;
  
  // Check if the game is over
  newState.gameOver = checkGameOver(newState);
  if (newState.gameOver) {
    newState.winner = getWinner(newState);
  }
  
  return newState;
};

// For demonstrating moves in the UI
export const getValidMoves = (state: GameState): [number, number][] => {
  const playerRow = state.currentPlayer === 1 ? 0 : 1;
  const validMoves: [number, number][] = [];
  
  state.board[playerRow].forEach((count, col) => {
    if (count > 0) {
      validMoves.push([playerRow, col]);
    }
  });
  
  return validMoves;
};
