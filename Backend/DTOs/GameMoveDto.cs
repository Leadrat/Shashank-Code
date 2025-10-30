namespace Backend.DTOs
{
    public class GameMoveDto
    {
        public string[] Board { get; set; } = new string[9];
        public string Mode { get; set; } = string.Empty;
        public string? Result { get; set; }
    }
}
