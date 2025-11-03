namespace GameApi.Application.DTOs;

public record SubmitScoreRequest(Guid UserId, int Wins, int Losses, int Draws);
