using GameApi.Application.DTOs;
using GameApi.Domain.Entities;
using GameApi.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace GameApi.Presentation.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ScoresController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetLeaderboard()
    {
        var leaderboard = await db.Scores
            .GroupBy(s => s.UserId)
            .Select(g => new {
                UserId = g.Key,
                Wins = g.Sum(x => x.Wins),
                Losses = g.Sum(x => x.Losses),
                Draws = g.Sum(x => x.Draws),
                UserName = db.Users.Where(u => u.Id == g.Key).Select(u => u.UserName).FirstOrDefault()!
            })
            .OrderByDescending(x => x.Wins)
            .ThenBy(x => x.Losses)
            .ToListAsync();
        return Ok(leaderboard);
    }

public record SubmitResultRequest(string Result);

    [HttpPost]
    [Authorize(Roles = "User,Admin")]
    public async Task<IActionResult> SubmitScore([FromBody] SubmitResultRequest req)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var userExists = await db.Users.AnyAsync(u => u.Id == userId);
        if (!userExists) return NotFound("User not found");

        var score = new Score
        {
            UserId = userId,
            Wins = req.Result.Equals("Win", StringComparison.OrdinalIgnoreCase) ? 1 : 0,
            Losses = req.Result.Equals("Loss", StringComparison.OrdinalIgnoreCase) ? 1 : 0,
            Draws = req.Result.Equals("Draw", StringComparison.OrdinalIgnoreCase) ? 1 : 0,
            RecordedAt = DateTime.UtcNow
        };
        db.Scores.Add(score);
        await db.SaveChangesAsync();
        return Ok(new { message = "Recorded" });
    }

    [HttpGet("user/{id}")]
    [Authorize(Roles = "User,Admin")]
    public async Task<IActionResult> GetUserScores([FromRoute] Guid id)
    {
        var scores = await db.Scores
            .Where(s => s.UserId == id)
            .OrderByDescending(s => s.RecordedAt)
            .ToListAsync();
        return Ok(scores);
    }
}
