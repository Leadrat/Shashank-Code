using GameApi.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GameApi.Presentation.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AdminController(AppDbContext db) : ControllerBase
{
    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        var users = await db.Users
            .Select(u => new { u.Id, u.UserName, u.Email, u.Role, u.CreatedAt })
            .OrderBy(u => u.UserName)
            .ToListAsync();
        return Ok(users);
    }

    [HttpGet("scores")]
    public async Task<IActionResult> GetAllScores()
    {
        var scores = await db.Scores
            .OrderByDescending(s => s.RecordedAt)
            .ToListAsync();
        return Ok(scores);
    }

    [HttpDelete("user/{id}")]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        var user = await db.Users.FindAsync(id);
        if (user == null) return NotFound();
        db.Users.Remove(user);
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPut("reset-scores")]
    public async Task<IActionResult> ResetScores()
    {
        db.Scores.RemoveRange(db.Scores);
        await db.SaveChangesAsync();
        return Ok();
    }

    [HttpGet("summary")]
    public async Task<IActionResult> Summary()
    {
        var totalUsers = await db.Users.CountAsync();
        var totalMatches = await db.Scores.CountAsync();
        var top = await db.Scores
            .GroupBy(s => s.UserId)
            .Select(g => new { UserId = g.Key, Wins = g.Sum(x => x.Wins) })
            .OrderByDescending(x => x.Wins)
            .FirstOrDefaultAsync();

        var topPlayerName = top == null ? null : await db.Users.Where(u => u.Id == top.UserId).Select(u => u.UserName).FirstOrDefaultAsync();

        return Ok(new { totalUsers, totalMatches, topPlayer = topPlayerName, topWins = top?.Wins ?? 0 });
    }
}
