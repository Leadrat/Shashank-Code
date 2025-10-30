using Backend.Models;

namespace Backend.Repositories
{
    public interface IGameRepository
    {
        Task<Game> SaveGameAsync(Game game);
        Task<Game?> GetLatestGameAsync(string playerId);
        Task<List<Game>> GetAllGamesByPlayerAsync(string playerId);
    }
}
