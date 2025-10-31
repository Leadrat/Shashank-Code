using Application.DTOs;

namespace Application.Services
{
    public interface IGameService
    {
        GameMoveDto MakeAIMove(string[] board);
        string CheckWinner(string[] board);
    }
}
