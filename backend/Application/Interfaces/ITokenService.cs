using GameApi.Domain.Entities;

namespace GameApi.Application.Interfaces;

public interface ITokenService
{
    string CreateToken(User user);
}
