using Backend.Models;

namespace Backend.Repositories
{
    public interface IScoreRepository
    {
        Task<Score?> GetScoreByPlayerIdAsync(string playerId);
        Task<Score> CreateOrUpdateScoreAsync(Score score);
        Task<List<Score>> GetAllScoresAsync();
    }
}
