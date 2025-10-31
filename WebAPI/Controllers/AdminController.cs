using Application.Abstractions.Persistence;
using Application.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IScoreRepository _scoreRepository;
        private readonly IGameRepository _gameRepository;

        public AdminController(
            IUserRepository userRepository,
            IScoreRepository scoreRepository,
            IGameRepository gameRepository)
        {
            _userRepository = userRepository;
            _scoreRepository = scoreRepository;
            _gameRepository = gameRepository;
        }

        [HttpGet("users")]
        public async Task<ActionResult> GetAllUsers()
        {
            var users = await _userRepository.GetAllAsync();
            var result = new List<AdminUserDto>();

            foreach (var user in users)
            {
                var score = await _scoreRepository.GetScoreByPlayerIdAsync(user.Id);
                var totalGames = (await _gameRepository.GetAllGamesByPlayerAsync(user.Id)).Count;

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
            var scores = await _scoreRepository.GetAllScoresAsync();

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
            var user = await _userRepository.FindByIdAsync(userId);
            if (user == null)
                return NotFound();

            user.Role = "Admin";
            await _userRepository.UpdateAsync(user);

            return Ok(new { message = $"User {user.UserName} is now an admin" });
        }
    }
}
