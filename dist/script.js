"use strict";
class TicTacToeGame {
    constructor(config) {
        this.config = config;
        this.board = new Array(config.boardSize * config.boardSize).fill(null);
        this.currentPlayer = 'X';
        this.gameState = 'playing';
        this.winningCombination = null;
        this.moveCount = 0;
    }
    // Make a move on the board
    makeMove(index) {
        if (this.gameState !== 'playing' || this.board[index] !== null) {
            return this.getGameResult();
        }
        this.board[index] = this.currentPlayer;
        this.moveCount++;
        const result = this.checkGameState();
        if (result.gameState === 'playing') {
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        }
        return result;
    }
    // Check if the game is won, drawn, or still playing
    checkGameState() {
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
    checkWin() {
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
    checkCombination(indices) {
        const firstCell = this.board[indices[0]];
        if (!firstCell)
            return false;
        return indices.every(index => this.board[index] === firstCell);
    }
    // Check if the board is full
    isBoardFull() {
        return this.board.every(cell => cell !== null);
    }
    // Get current game result
    getGameResult() {
        return {
            winner: this.gameState === 'won' ? this.currentPlayer : null,
            winningCombination: this.winningCombination,
            gameState: this.gameState
        };
    }
    // Reset the game
    reset() {
        this.board = new Array(this.config.boardSize * this.config.boardSize).fill(null);
        this.currentPlayer = 'X';
        this.gameState = 'playing';
        this.winningCombination = null;
        this.moveCount = 0;
    }
    // Get move count
    getMoveCount() {
        return this.moveCount;
    }
    // Get current player
    getCurrentPlayer() {
        return this.currentPlayer;
    }
    // Get board state
    getBoard() {
        return [...this.board];
    }
}
// UI Controller class
class GameUI {
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
    initializeElements() {
        this.boardElement = document.getElementById('game-board');
        this.statusElement = document.getElementById('game-status');
        this.resetButton = document.getElementById('reset-button');
        this.moveCounterElement = document.getElementById('move-counter');
        this.cells = Array.from(document.querySelectorAll('.cell'));
    }
    setupEventListeners() {
        this.cells.forEach((cell, index) => {
            cell.addEventListener('click', () => this.handleCellClick(index));
        });
        this.resetButton.addEventListener('click', () => this.resetGame());
    }
    handleCellClick(index) {
        const result = this.game.makeMove(index);
        this.render();
        if (result.gameState === 'won') {
            this.highlightWinningCombination(result.winningCombination);
            this.showWinAnimation();
        }
    }
    render() {
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
            this.statusElement.textContent = `Player ${result.winner} wins!`;
            this.statusElement.className = 'status-message win-message';
        }
        else if (result.gameState === 'draw') {
            this.statusElement.textContent = "It's a draw!";
            this.statusElement.className = 'status-message draw-message';
        }
        else {
            this.statusElement.textContent = `Player ${currentPlayer}'s turn`;
            this.statusElement.className = 'status-message playing-message';
        }
    }
    highlightWinningCombination(combination) {
        combination.forEach(index => {
            this.cells[index].classList.add('winning-cell');
        });
    }
    showWinAnimation() {
        const board = this.boardElement;
        board.classList.add('win-animation');
        setTimeout(() => {
            board.classList.remove('win-animation');
        }, 1000);
    }
    resetGame() {
        this.game.reset();
        this.render();
    }
}
// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GameUI();
});
//# sourceMappingURL=script.js.map