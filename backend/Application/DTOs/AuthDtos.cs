namespace GameApi.Application.DTOs;

public record RegisterRequest(string UserName, string Email, string Password);
public record LoginRequest(string Email, string Password);
public record AuthResponse(string Token, string UserName, string Email, string Role);
