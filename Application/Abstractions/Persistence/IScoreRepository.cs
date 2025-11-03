using Domain.Entities;

namespace Application.Abstractions.Persistence
{
    public interface IScoreRepository
    {
        Task<Score?> GetScoreByPlayerIdAsync(string playerId);
        Task<List<Score>> GetAllScoresAsync();
        Task CreateOrUpdateScoreAsync(Score score);
    }
}
