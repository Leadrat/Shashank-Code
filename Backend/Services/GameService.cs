using Backend.DTOs;

namespace Backend.Services
{
    public class GameService : IGameService
    {
        public GameMoveDto MakeAIMove(string[] board)
        {
            // Copy board to avoid modifying original
            string[] newBoard = new string[9];
            Array.Copy(board, newBoard, 9);

            // 1. Check if AI can win
            int? winningMove = FindWinningMove(newBoard, "O");
            if (winningMove.HasValue)
            {
                newBoard[winningMove.Value] = "O";
                return new GameMoveDto
                {
                    Board = newBoard,
                    Mode = "AI",
                    Result = CheckWinner(newBoard)
                };
            }

            // 2. Check if need to block player
            int? blockingMove = FindWinningMove(newBoard, "X");
            if (blockingMove.HasValue)
            {
                newBoard[blockingMove.Value] = "O";
                return new GameMoveDto
                {
                    Board = newBoard,
                    Mode = "AI",
                    Result = CheckWinner(newBoard)
                };
            }

            // 3. Take center if available
            if (newBoard[4] == "")
            {
                newBoard[4] = "O";
                return new GameMoveDto
                {
                    Board = newBoard,
                    Mode = "AI",
                    Result = CheckWinner(newBoard)
                };
            }

            // 4. Take random empty cell
            var emptyCells = new List<int>();
            for (int i = 0; i < 9; i++)
            {
                if (newBoard[i] == "")
                    emptyCells.Add(i);
            }

            if (emptyCells.Count > 0)
            {
                Random random = new Random();
                int randomIndex = emptyCells[random.Next(emptyCells.Count)];
                newBoard[randomIndex] = "O";
            }

            return new GameMoveDto
            {
                Board = newBoard,
                Mode = "AI",
                Result = CheckWinner(newBoard)
            };
        }

        private int? FindWinningMove(string[] board, string player)
        {
            // Check all possible winning combinations
            int[][] winningCombos = new int[][]
            {
                new int[] {0, 1, 2}, new int[] {3, 4, 5}, new int[] {6, 7, 8}, // Rows
                new int[] {0, 3, 6}, new int[] {1, 4, 7}, new int[] {2, 5, 8}, // Columns
                new int[] {0, 4, 8}, new int[] {2, 4, 6}  // Diagonals
            };

            foreach (var combo in winningCombos)
            {
                int count = 0;
                int emptyIndex = -1;

                foreach (var index in combo)
                {
                    if (board[index] == player)
                        count++;
                    else if (board[index] == "")
                        emptyIndex = index;
                }

                if (count == 2 && emptyIndex != -1)
                    return emptyIndex;
            }

            return null;
        }

        public string CheckWinner(string[] board)
        {
            // Check for winner
            int[][] winningCombos = new int[][]
            {
                new int[] {0, 1, 2}, new int[] {3, 4, 5}, new int[] {6, 7, 8}, // Rows
                new int[] {0, 3, 6}, new int[] {1, 4, 7}, new int[] {2, 5, 8}, // Columns
                new int[] {0, 4, 8}, new int[] {2, 4, 6}  // Diagonals
            };

            foreach (var combo in winningCombos)
            {
                if (board[combo[0]] != "" &&
                    board[combo[0]] == board[combo[1]] &&
                    board[combo[1]] == board[combo[2]])
                {
                    // For two-player mode, return the actual winner (X or O)
                    // For AI mode, return PlayerWin/AIWin
                    return board[combo[0]] == "X" ? "PlayerWin" : "AIWin";
                }
            }

            // Check for draw
            bool isDraw = !board.Any(cell => cell == "");
            return isDraw ? "Draw" : "";
        }
    }
}
