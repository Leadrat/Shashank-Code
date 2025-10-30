using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("users")]
        public async Task<ActionResult> GetAllUsers()
        {
            var users = await _context.Users.ToListAsync();

            var result = new List<AdminUserDto>();

            foreach (var user in users)
            {
                var score = await _context.Scores.FirstOrDefaultAsync(s => s.PlayerId == user.Id);
                var totalGames = await _context.Games
                    .Where(g => g.PlayerId == user.Id)
                    .CountAsync();

                result.Add(new AdminUserDto
                {
                    Id = user.Id,
                    Username = user.UserName ?? "Unknown",
                    Email = user.Email ?? "Unknown",
                    Role = user.Role,
                    Wins = score?.Wins ?? 0,
                    Losses = score?.Losses ?? 0,
                    Draws = score?.Draws ?? 0,
                    TotalGames = totalGames
                });
            }

            return Ok(result);
        }

        [HttpGet("scores")]
        public async Task<ActionResult> GetAllScores()
        {
            var scores = await _context.Scores
                .Include(s => s.Player)
                .ToListAsync();

            var result = scores.Select(s => new
            {
                playerId = s.PlayerId,
                username = s.Player?.UserName ?? "Unknown",
                totalGames = s.Wins + s.Losses + s.Draws,
                wins = s.Wins,
                losses = s.Losses,
                draws = s.Draws
            });

            return Ok(result);
        }

        [HttpPost("{userId}/make-admin")]
        public async Task<ActionResult> MakeUserAdmin(string userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return NotFound();

            user.Role = "Admin";
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"User {user.UserName} is now an admin" });
        }
    }
}
