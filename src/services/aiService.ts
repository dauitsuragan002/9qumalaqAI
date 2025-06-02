import OpenAI from 'openai';
import { GameState } from '@/utils/gameLogic';

export class AIService {
  private openai: OpenAI | null = null;

  constructor() {
    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey) {
        console.warn("OpenAI API key not found in environment variables");
        return;
      }

      this.openai = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true // WARNING: Not for production use
      });
    } catch (error) {
      console.error("Error initializing OpenAI client:", error);
    }
  }

  async getAIMove(gameState: GameState): Promise<[number, number] | null> {
    if (!this.openai) {
      console.warn("OpenAI API key not set, using fallback random move");
      return this.getRandomValidMove(gameState);
    }

    try {
      const prompt = this.buildGamePrompt(gameState);
      
      const response = await this.openai.chat.completions.create({
        model: "gpt-4.1-nano",
        messages: [
          {
            role: "system",
            content: `You are an AI playing the Togyz Kumalak board game. You need to analyze the current board state and determine the best move for the AI player (player 2). 
            
            The board has 2 rows (0 for player 1, 1 for player 2) and 9 columns (0-8). The move should be returned as a JSON array with exactly two numbers [row, column].
            
            Valid moves are only in your row (row 1) and only columns that have stones (count > 0).
            
            Example valid response: [1, 3] means row 1, column 3`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 100,
        response_format: { type: "json_object" }
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        console.warn("Invalid response from OpenAI, using fallback random move");
        return this.getRandomValidMove(gameState);
      }

      try {
        const moveObject = JSON.parse(content);
        if (Array.isArray(moveObject.move) && moveObject.move.length === 2) {
          const [row, col] = moveObject.move;
          
          // Validate move
          if (row === 1 && col >= 0 && col <= 8 && gameState.board[row][col] > 0) {
            return [row, col];
          } else {
            console.warn("Invalid move from OpenAI, using fallback random move");
            return this.getRandomValidMove(gameState);
          }
        } else {
          console.warn("Invalid format from OpenAI, using fallback random move");
          return this.getRandomValidMove(gameState);
        }
      } catch (error) {
        console.error("Error parsing OpenAI response:", error);
        return this.getRandomValidMove(gameState);
      }
    } catch (error) {
      console.error("Error getting AI move:", error);
      return this.getRandomValidMove(gameState);
    }
  }

  private buildGamePrompt(gameState: GameState): string {
    const player1BoardString = gameState.board[0].join(', ');
    const player2BoardString = gameState.board[1].join(', ');
    const player1Score = gameState.kazan[0];
    const player2Score = gameState.kazan[1];
    const currentTurn = gameState.currentPlayer === 2 ? "AI's turn (player 2)" : "Human's turn (player 1)";
    
    let tuzdikInfo = "No tuzdik (sacred hole) has been created yet.";
    if (gameState.tuzdik) {
      const tuzdikPlayer = gameState.tuzdik[0];
      const tuzdikPosition = gameState.tuzdik[1] + 1; // Convert to 1-indexed for better understanding
      tuzdikInfo = `Player ${tuzdikPlayer} has a tuzdik at position ${tuzdikPosition}.`;
    }

    return `
Current Togyz Kumalak game state:
- Player 1 (Human) pits: [${player1BoardString}]
- Player 2 (AI) pits: [${player2BoardString}]
- Player 1 score: ${player1Score}
- Player 2 score: ${player2Score}
- ${tuzdikInfo}
- ${currentTurn}

Analyze the current state and determine the best move for the AI (player 2). 
Return your move as a JSON object with a 'move' property containing an array of [row, column].
Example: {"move": [1, 4]}

Rules to remember:
- You can only select pits from your row (row = 1)
- The pit must contain at least one stone
- Stones are distributed counter-clockwise, one by one
- When the last stone lands in an empty hole on the opponent's side, no capture occurs
- When the last stone lands in a hole that becomes even (2, 4, 6, etc.) on the opponent's side, you capture all stones
- When a hole has exactly 3 stones after a move and is on the opponent's side, it becomes a tuzdik (sacred hole) if no tuzdik exists
- Tuzdik stones cannot be captured and cannot be moved (they belong to the player who created the tuzdik)
- You cannot create a tuzdik in the 9th position (index 8)
- The game ends when a player has 81+ stones or when one player has no valid moves

Strategic considerations:
- Try to land on opponent's holes to make them even for captures
- Protect your holes that have 3 stones from becoming opponent's tuzdik
- Try to create your own tuzdik in a strategic position
- Consider the distribution pattern to maximize captures
`;
  }

  private getRandomValidMove(gameState: GameState): [number, number] | null {
    const playerRow = 1; // AI is always player 2, row 1
    const validMoves: [number, number][] = [];
    
    gameState.board[playerRow].forEach((count, col) => {
      if (count > 0) {
        validMoves.push([playerRow, col]);
      }
    });
    
    if (validMoves.length === 0) {
      return null;
    }
    
    return validMoves[Math.floor(Math.random() * validMoves.length)];
  }
}

export default new AIService();
