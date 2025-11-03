namespace Domain.Entities
{
    public class Game
    {
        public int Id { get; set; }
        public string PlayerId { get; set; } = string.Empty;
        public string Mode { get; set; } = string.Empty; // "AI" or "TwoPlayer"
        public string Result { get; set; } = string.Empty; // "Win", "Loss", "Draw" or X/O for two-player mapping
        public string BoardState { get; set; } = string.Empty; // JSON string of board
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public User? Player { get; set; }
    }
}
