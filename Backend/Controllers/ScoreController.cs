using Backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ScoreController : ControllerBase
    {
        private readonly IScoreRepository _scoreRepository;

        public ScoreController(IScoreRepository scoreRepository)
        {
            _scoreRepository = scoreRepository;
        }

        [HttpGet("user")]
        public async Task<ActionResult> GetUserScore()
        {
            var playerId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(playerId))
                return Unauthorized();

            var score = await _scoreRepository.GetScoreByPlayerIdAsync(playerId);
            
            if (score == null)
            {
                return Ok(new { wins = 0, losses = 0, draws = 0 });
            }

            return Ok(new
            {
                wins = score.Wins,
                losses = score.Losses,
                draws = score.Draws
            });
        }

        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> GetAllScores()
        {
            var scores = await _scoreRepository.GetAllScoresAsync();
            
            var result = scores.Select(s => new
            {
                playerId = s.PlayerId,
                username = s.Player?.UserName ?? "Unknown",
                wins = s.Wins,
                losses = s.Losses,
                draws = s.Draws
            });

            return Ok(result);
        }
    }
}
