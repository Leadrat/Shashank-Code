namespace Domain.Entities
{
    public class Score
    {
        public int Id { get; set; }
        public string PlayerId { get; set; } = string.Empty;
        public int Wins { get; set; } = 0;
        public int Losses { get; set; } = 0;
        public int Draws { get; set; } = 0;
        public User? Player { get; set; }
    }
}
