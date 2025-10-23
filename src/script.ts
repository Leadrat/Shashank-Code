// Type definitions
type Player = 'X' | 'O' | null;
type GameState = 'playing' | 'won' | 'draw';
type WinningCombination = number[] | null;

interface GameConfig {
  boardSize: number;
  players: {
    X: string;
    O: string;
  };
}

interface GameResult {
  winner: Player;
  winningCombination: WinningCombination;
  gameState: GameState;
}

class TicTacToeGame {
  private board: Player[];
  private currentPlayer: Player;
  private gameState: GameState;
  private winningCombination: WinningCombination;
  private config: GameConfig;

  constructor(config: GameConfig) {
    this.config = config;
    this.board = new Array(config.boardSize * config.boardSize).fill(null);
    this.currentPlayer = 'X';
    this.gameState = 'playing';
    this.winningCombination = null;
  }

  // Make a move on the board
  public makeMove(index: number): GameResult {
    if (this.gameState !== 'playing' || this.board[index] !== null) {
      return this.getGameResult();
    }

    this.board[index] = this.currentPlayer;
    const result = this.checkGameState();
    
    if (result.gameState === 'playing') {
      this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    }

    return result;
  }

  // Check if the game is won, drawn, or still playing
  private checkGameState(): GameResult {
    const winningCombination = this.checkWin();
    
    if (winningCombination) {
      this.gameState = 'won';
      this.winningCombination = winningCombination;
      return {
        winner: this.currentPlayer,
        winningCombination,
        gameState: 'won'
      };
    }

    if (this.isBoardFull()) {
      this.gameState = 'draw';
      return {
        winner: null,
        winningCombination: null,
        gameState: 'draw'
      };
    }

    return {
      winner: null,
      winningCombination: null,
      gameState: 'playing'
    };
  }

  // Check for winning combinations
  private checkWin(): WinningCombination {
    const size = this.config.boardSize;

    // Check rows
    for (let row = 0; row < size; row++) {
      const startIndex = row * size;
      if (this.checkCombination([startIndex, startIndex + 1, startIndex + 2])) {
        return [startIndex, startIndex + 1, startIndex + 2];
      }
    }

    // Check columns
    for (let col = 0; col < size; col++) {
      if (this.checkCombination([col, col + size, col + 2 * size])) {
        return [col, col + size, col + 2 * size];
      }
    }

    // Check diagonals
    if (this.checkCombination([0, 4, 8])) {
      return [0, 4, 8];
    }
    if (this.checkCombination([2, 4, 6])) {
      return [2, 4, 6];
    }

    return null;
  }

  // Check if a combination of cells has the same player
  private checkCombination(indices: number[]): boolean {
    const firstCell = this.board[indices[0]];
    if (!firstCell) return false;
    
    return indices.every(index => this.board[index] === firstCell);
  }

  // Check if the board is full
  private isBoardFull(): boolean {
    return this.board.every(cell => cell !== null);
  }

  // Get current game result
  public getGameResult(): GameResult {
    return {
      winner: this.gameState === 'won' ? this.currentPlayer : null,
      winningCombination: this.winningCombination,
      gameState: this.gameState
    };
  }

  // Reset the game
  public reset(): void {
    this.board = new Array(this.config.boardSize * this.config.boardSize).fill(null);
    this.currentPlayer = 'X';
    this.gameState = 'playing';
    this.winningCombination = null;
  }

  // Get current player
  public getCurrentPlayer(): Player {
    return this.currentPlayer;
  }

  // Get board state
  public getBoard(): Player[] {
    return [...this.board];
  }
}

// UI Controller class
class GameUI {
  private game: TicTacToeGame;
  private boardElement!: HTMLElement;
  private statusElement!: HTMLElement;
  private resetButton!: HTMLElement;
  private cells!: HTMLElement[];

  constructor() {
    this.game = new TicTacToeGame({
      boardSize: 3,
      players: {
        X: 'X',
        O: 'O'
      }
    });

    this.initializeElements();
    this.setupEventListeners();
    this.render();
  }

  private initializeElements(): void {
    this.boardElement = document.getElementById('game-board')!;
    this.statusElement = document.getElementById('game-status')!;
    this.resetButton = document.getElementById('reset-button')!;
    this.cells = Array.from(document.querySelectorAll('.cell')) as HTMLElement[];
  }

  private setupEventListeners(): void {
    this.cells.forEach((cell, index) => {
      cell.addEventListener('click', () => this.handleCellClick(index));
    });

    this.resetButton.addEventListener('click', () => this.resetGame());
  }

  private handleCellClick(index: number): void {
    const result = this.game.makeMove(index);
    this.render();

    if (result.gameState === 'won') {
      this.highlightWinningCombination(result.winningCombination!);
      this.showWinAnimation();
    }
  }

  private render(): void {
    const board = this.game.getBoard();
    const currentPlayer = this.game.getCurrentPlayer();
    const result = this.game.getGameResult();

    // Update board cells
    this.cells.forEach((cell, index) => {
      cell.textContent = board[index] || '';
      cell.classList.remove('winning-cell');
    });

    // Update status message
    if (result.gameState === 'won') {
      this.statusElement.textContent = `Player ${result.winner} wins!`;
      this.statusElement.className = 'status-message win-message';
    } else if (result.gameState === 'draw') {
      this.statusElement.textContent = "It's a draw!";
      this.statusElement.className = 'status-message draw-message';
    } else {
      this.statusElement.textContent = `Player ${currentPlayer}'s turn`;
      this.statusElement.className = 'status-message playing-message';
    }
  }

  private highlightWinningCombination(combination: number[]): void {
    combination.forEach(index => {
      this.cells[index].classList.add('winning-cell');
    });
  }

  private showWinAnimation(): void {
    const board = this.boardElement;
    board.classList.add('win-animation');
    
    setTimeout(() => {
      board.classList.remove('win-animation');
    }, 1000);
  }

  private resetGame(): void {
    this.game.reset();
    this.render();
  }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new GameUI();
});
