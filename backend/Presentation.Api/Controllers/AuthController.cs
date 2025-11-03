using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using GameApi.Application.DTOs;
using GameApi.Application.Interfaces;
using GameApi.Domain.Entities;
using GameApi.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GameApi.Presentation.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(AppDbContext db, ITokenService tokens) : ControllerBase
{
    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest req)
    {
        if (await db.Users.AnyAsync(u => u.Email == req.Email)) return BadRequest("Email already used");
        CreatePasswordHash(req.Password, out var hash, out var salt);
        var user = new User
        {
            UserName = req.UserName,
            Email = req.Email,
            PasswordHash = hash,
            PasswordSalt = salt,
            Role = UserRole.User
        };
        db.Users.Add(user);
        await db.SaveChangesAsync();
        var token = tokens.CreateToken(user);
        return Ok(new AuthResponse(token, user.UserName, user.Email, user.Role.ToString()));
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest req)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
        if (user == null || !VerifyPasswordHash(req.Password, user.PasswordHash, user.PasswordSalt))
            return Unauthorized("Invalid credentials");
        var token = tokens.CreateToken(user);
        return Ok(new AuthResponse(token, user.UserName, user.Email, user.Role.ToString()));
    }

    [HttpPost("logout")]
    [Authorize]
    public IActionResult Logout()
    {
        // Stateless JWT: client drops token
        return Ok();
    }

    private static void CreatePasswordHash(string password, out byte[] hash, out byte[] salt)
    {
        using var hmac = new HMACSHA512();
        salt = hmac.Key;
        hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
    }

    private static bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
    {
        using var hmac = new HMACSHA512(storedSalt);
        var computed = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
        return computed.SequenceEqual(storedHash);
    }
}
