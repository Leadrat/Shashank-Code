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
declare class TicTacToeGame {
    private board;
    private currentPlayer;
    private gameState;
    private winningCombination;
    private config;
    constructor(config: GameConfig);
    makeMove(index: number): GameResult;
    private checkGameState;
    private checkWin;
    private checkCombination;
    private isBoardFull;
    getGameResult(): GameResult;
    reset(): void;
    getCurrentPlayer(): Player;
    getBoard(): Player[];
}
declare class GameUI {
    private game;
    private boardElement;
    private statusElement;
    private resetButton;
    private cells;
    constructor();
    private initializeElements;
    private setupEventListeners;
    private handleCellClick;
    private render;
    private highlightWinningCombination;
    private showWinAnimation;
    private resetGame;
}
//# sourceMappingURL=script.d.ts.map