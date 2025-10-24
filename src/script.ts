// Type definitions
type Player = 'X' | 'O' | null;
type GameState = 'playing' | 'won' | 'draw';
type WinningCombination = number[] | null;

interface PlayerInfo {
  name: string;
  score: number;
}

interface GameConfig {
  boardSize: number;
  players: {
    X: PlayerInfo;
    O: PlayerInfo;
  };
}

interface GameResult {
  winner: Player;
  winningCombination: WinningCombination;
  gameState: GameState;
  winnerName?: string;
}

class TicTacToeGame {
  private board: Player[];
  private currentPlayer: Player;
  private gameState: GameState;
  private winningCombination: WinningCombination;
  private config: GameConfig;
  private moveCount: number;

  constructor(config: GameConfig) {
    this.config = {
      boardSize: config.boardSize,
      players: {
        X: { name: config.players.X.name, score: 0 },
        O: { name: config.players.O.name, score: 0 }
      }
    };
    this.board = new Array(config.boardSize * config.boardSize).fill(null);
    this.currentPlayer = 'X';
    this.gameState = 'playing';
    this.winningCombination = null;
    this.moveCount = 0;
    this.updateScoreDisplay();
  }

  private updateScoreDisplay(): void {
    const playerXName = document.getElementById('player-x-name');
    const playerOName = document.getElementById('player-o-name');
    const playerXScore = document.getElementById('player-x-score');
    const playerOScore = document.getElementById('player-o-score');

    if (playerXName) playerXName.textContent = this.config.players.X.name;
    if (playerOName) playerOName.textContent = this.config.players.O.name;
    if (playerXScore) playerXScore.textContent = this.config.players.X.score.toString();
    if (playerOScore) playerOScore.textContent = this.config.players.O.score.toString();
  }

  // Make a move on the board
  public makeMove(index: number): GameResult {
    if (this.gameState !== 'playing' || this.board[index] !== null) {
      return this.getGameResult();
    }

    this.board[index] = this.currentPlayer;
    this.moveCount++;
    const result = this.checkGameState();
    
    if (result.gameState === 'won') {
      // Update score for winning player
      if (this.currentPlayer === 'X' || this.currentPlayer === 'O') {
        this.config.players[this.currentPlayer].score++;
        this.updateScoreDisplay();
      }
    } else if (result.gameState === 'playing') {
      this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    }

    return this.getGameResult();
  }

  // Check if the game is won, drawn, or still playing
  private checkGameState(): GameResult {
    const winningCombination = this.checkWin();
    
    if (winningCombination) {
      this.gameState = 'won';
      this.winningCombination = winningCombination;
      const winnerName = this.currentPlayer === 'X' ? 
        this.config.players.X.name : 
        this.currentPlayer === 'O' ? 
        this.config.players.O.name : 
        undefined;
      
      return {
        winner: this.currentPlayer,
        winningCombination,
        gameState: 'won',
        winnerName
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
    this.moveCount = 0;
  }

  // Get move count
  public getMoveCount(): number {
    return this.moveCount;
  }

  public getConfig(): GameConfig {
    return this.config;
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
  private game!: TicTacToeGame;
  private boardElement!: HTMLElement;
  private statusElement!: HTMLElement;
  private resetButton!: HTMLElement;
  private cells!: HTMLElement[];
  private moveCounterElement!: HTMLElement;
  private playerForm!: HTMLFormElement;
  private gameBoard!: HTMLElement;
  private scoreBoard!: HTMLElement;

  constructor() {
    this.initializeElements();
    this.setupPlayerForm();
    // Game will be initialized when player form is submitted
  }

  private setupPlayerForm(): void {
    this.playerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const playerXName = (document.getElementById('player-x') as HTMLInputElement).value || 'Player X';
      const playerOName = (document.getElementById('player-o') as HTMLInputElement).value || 'Player O';

      this.game = new TicTacToeGame({
        boardSize: 3,
        players: {
          X: { name: playerXName, score: 0 },
          O: { name: playerOName, score: 0 }
        }
      });

      this.playerForm.style.display = 'none';
      this.gameBoard.style.display = 'grid';
      this.scoreBoard.style.display = 'flex';

      // Smooth scroll to game section
      const gameSection = document.getElementById('game-section');
      if (gameSection) {
        gameSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      this.setupEventListeners();
      this.render();
    });
  }

  private initializeElements(): void {
    this.boardElement = document.getElementById('game-board')!;
    this.statusElement = document.getElementById('game-status')!;
    this.resetButton = document.getElementById('reset-button')!;
    this.moveCounterElement = document.getElementById('move-counter')!;
    this.cells = Array.from(document.querySelectorAll('.cell')) as HTMLElement[];
    this.playerForm = document.getElementById('player-names-form') as HTMLFormElement;
    this.gameBoard = document.getElementById('game-board')!;
    this.scoreBoard = document.getElementById('score-board')!;

    // Initially hide game board and score board
    this.gameBoard.style.display = 'none';
    this.scoreBoard.style.display = 'none';
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
    const moveCount = this.game.getMoveCount();

    // Update board cells
    this.cells.forEach((cell, index) => {
      cell.textContent = board[index] || '';
      cell.classList.remove('winning-cell');
    });

    // Update move counter
    this.moveCounterElement.textContent = `Moves: ${moveCount}`;

    // Update status message
    if (result.gameState === 'won') {
      const winnerName = currentPlayer === 'X' ? 
        this.game.getConfig().players.X.name : 
        this.game.getConfig().players.O.name;
      this.statusElement.textContent = `${winnerName} wins!`;
      this.statusElement.className = 'status-message win-message';
    } else if (result.gameState === 'draw') {
      this.statusElement.textContent = "It's a draw!";
      this.statusElement.className = 'status-message draw-message';
    } else {
      const currentPlayerName = currentPlayer === 'X' ? 
        this.game.getConfig().players.X.name : 
        this.game.getConfig().players.O.name;
      this.statusElement.textContent = `${currentPlayerName}'s turn`;
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
