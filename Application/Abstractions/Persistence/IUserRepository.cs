using Domain.Entities;

namespace Application.Abstractions.Persistence
{
    public interface IUserRepository
    {
        Task<List<User>> GetAllAsync();
        Task<User?> FindByIdAsync(string userId);
        Task UpdateAsync(User user);
    }
}
