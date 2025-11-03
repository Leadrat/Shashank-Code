namespace GameApi.Domain.Entities;

public enum UserRole
{
    User = 0,
    Admin = 1
}

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string UserName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public byte[] PasswordHash { get; set; } = Array.Empty<byte>();
    public byte[] PasswordSalt { get; set; } = Array.Empty<byte>();
    public UserRole Role { get; set; } = UserRole.User;
    public string? AvatarUrl { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Match> Matches { get; set; } = new List<Match>();
    public ICollection<Score> Scores { get; set; } = new List<Score>();
}
