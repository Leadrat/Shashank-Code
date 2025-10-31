using Microsoft.AspNetCore.Identity;

namespace Domain.Entities
{
    public class User : IdentityUser
    {
        public string Role { get; set; } = "Player";
        public ICollection<Game> Games { get; set; } = new List<Game>();
        public Score? Score { get; set; }
    }
}
