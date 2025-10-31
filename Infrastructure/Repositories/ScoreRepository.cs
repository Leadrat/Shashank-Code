using Application.Abstractions.Persistence;
using Domain.Entities;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class ScoreRepository : IScoreRepository
    {
        private readonly ApplicationDbContext _context;

        public ScoreRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Score?> GetScoreByPlayerIdAsync(string playerId)
        {
            return await _context.Scores
                .FirstOrDefaultAsync(s => s.PlayerId == playerId);
        }

        public async Task CreateOrUpdateScoreAsync(Score score)
        {
            var existingScore = await _context.Scores
                .FirstOrDefaultAsync(s => s.PlayerId == score.PlayerId);

            if (existingScore != null)
            {
                existingScore.Wins = score.Wins;
                existingScore.Losses = score.Losses;
                existingScore.Draws = score.Draws;
                _context.Scores.Update(existingScore);
            }
            else
            {
                _context.Scores.Add(score);
            }

            await _context.SaveChangesAsync();
        }

        public async Task<List<Score>> GetAllScoresAsync()
        {
            return await _context.Scores
                .Include(s => s.Player)
                .ToListAsync();
        }
    }
}
