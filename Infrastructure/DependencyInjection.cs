using Application.Abstractions.Persistence;
using Domain.Entities;
using Infrastructure.Persistence;
using Infrastructure.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? $"Data Source={Path.Combine(Directory.GetCurrentDirectory(), "tictactoe.db")}";

            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlite(connectionString));

            services
                .AddIdentity<User, IdentityRole>(options =>
                {
                    options.Password.RequireDigit = true;
                    options.Password.RequireLowercase = true;
                    options.Password.RequireUppercase = false;
                    options.Password.RequireNonAlphanumeric = false;
                    options.Password.RequiredLength = 6;
                })
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            services.AddScoped<IGameRepository, GameRepository>();
            services.AddScoped<IScoreRepository, ScoreRepository>();
            services.AddScoped<IUserRepository, UserRepository>();

            return services;
        }
    }
}
