namespace GameApi.Domain.Entities;

public enum MatchResult
{
    Win,
    Loss,
    Draw
}

public class Match
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public MatchResult Result { get; set; }
    public DateTime PlayedAt { get; set; } = DateTime.UtcNow;

    public User? User { get; set; }
}
