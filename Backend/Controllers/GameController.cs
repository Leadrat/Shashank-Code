using Backend.DTOs;
using Backend.Models;
using Backend.Repositories;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class GameController : ControllerBase
    {
        private readonly IGameService _gameService;
        private readonly IGameRepository _gameRepository;
        private readonly IScoreRepository _scoreRepository;

        public GameController(
            IGameService gameService,
            IGameRepository gameRepository,
            IScoreRepository scoreRepository)
        {
            _gameService = gameService;
            _gameRepository = gameRepository;
            _scoreRepository = scoreRepository;
        }

        [HttpPost("play")]
        public async Task<ActionResult<GameMoveDto>> PlayGame([FromBody] GameMoveDto move)
        {
            var playerId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(playerId))
                return Unauthorized();

            var result = "";

            // Check for win/draw conditions
            result = _gameService.CheckWinner(move.Board);

            // If playing against AI and no winner yet, let AI make a move
            if (move.Mode == "AI" && string.IsNullOrEmpty(result))
            {
                var aiResponse = _gameService.MakeAIMove(move.Board);
                move.Board = aiResponse.Board;
                result = aiResponse.Result;
            }

            move.Result = result;

            // Save game to database
            var game = new Game
            {
                PlayerId = playerId,
                Mode = move.Mode,
                Result = MapResult(result ?? "", move.Mode),
                BoardState = JsonSerializer.Serialize(move.Board),
                CreatedAt = DateTime.UtcNow
            };

            await _gameRepository.SaveGameAsync(game);

            // Update score if game has ended
            if (!string.IsNullOrEmpty(result) && result != "")
            {
                await UpdateScoreAsync(playerId, result, move.Mode);
            }

            return Ok(move);
        }

        [HttpGet("replay")]
        public async Task<ActionResult<GameMoveDto>> ReplayLatestGame()
        {
            var playerId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(playerId))
                return Unauthorized();

            var game = await _gameRepository.GetLatestGameAsync(playerId);
            if (game == null)
                return NotFound(new { message = "No game found" });

            var board = JsonSerializer.Deserialize<string[]>(game.BoardState);
            
            return Ok(new GameMoveDto
            {
                Board = board ?? new string[9],
                Mode = game.Mode,
                Result = MapReplayResult(game.Result)
            });
        }

        private async Task UpdateScoreAsync(string playerId, string result, string mode)
        {
            if (mode == "TwoPlayer")
                return; // Don't update scores for two-player mode

            var score = await _scoreRepository.GetScoreByPlayerIdAsync(playerId);
            
            if (score == null)
            {
                score = new Score
                {
                    PlayerId = playerId,
                    Wins = 0,
                    Losses = 0,
                    Draws = 0
                };
            }

            switch (result)
            {
                case "PlayerWin":
                    score.Wins++;
                    break;
                case "AIWin":
                    score.Losses++;
                    break;
                case "Draw":
                    score.Draws++;
                    break;
            }

            await _scoreRepository.CreateOrUpdateScoreAsync(score);
        }

        private string MapResult(string result, string mode)
        {
            if (mode == "TwoPlayer")
            {
                return result switch
                {
                    "PlayerWin" => "X", // In two-player mode, return the winning symbol
                    "AIWin" => "O",     // AIWin means 'O' won in two-player mode
                    _ => result          // For Draw or empty string, return as is
                };
            }

            // For AI mode
            return result switch
            {
                "PlayerWin" => "Win",
                "AIWin" => "Loss",
                "Draw" => "Draw",
                _ => ""
            };
        }

        private string MapReplayResult(string result)
        {
            return result switch
            {
                "Win" => "PlayerWin",
                "Loss" => "AIWin",
                "Draw" => "Draw",
                _ => ""
            };
        }
    }
}
