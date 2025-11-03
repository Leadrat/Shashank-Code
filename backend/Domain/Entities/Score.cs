namespace GameApi.Domain.Entities;

public class Score
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public int Wins { get; set; }
    public int Losses { get; set; }
    public int Draws { get; set; }
    public DateTime RecordedAt { get; set; } = DateTime.UtcNow;

    public User? User { get; set; }
}
