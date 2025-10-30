using Backend.DTOs;

namespace Backend.Services
{
    public interface IGameService
    {
        GameMoveDto MakeAIMove(string[] board);
        string CheckWinner(string[] board);
    }
}
