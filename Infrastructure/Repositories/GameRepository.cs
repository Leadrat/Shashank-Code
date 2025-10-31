using Application.Abstractions.Persistence;
using Domain.Entities;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class GameRepository : IGameRepository
    {
        private readonly ApplicationDbContext _context;

        public GameRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Game> SaveGameAsync(Game game)
        {
            _context.Games.Add(game);
            await _context.SaveChangesAsync();
            return game;
        }

        public async Task<Game?> GetLatestGameAsync(string playerId)
        {
            return await _context.Games
                .Where(g => g.PlayerId == playerId)
                .OrderByDescending(g => g.CreatedAt)
                .FirstOrDefaultAsync();
        }

        public async Task<List<Game>> GetAllGamesByPlayerAsync(string playerId)
        {
            return await _context.Games
                .Where(g => g.PlayerId == playerId)
                .ToListAsync();
        }
    }
}
