using GameApi.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GameApi.Infrastructure.Persistence;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Score> Scores => Set<Score>();
    public DbSet<Match> Matches => Set<Match>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(e =>
        {
            e.HasIndex(u => u.Email).IsUnique();
            e.Property(u => u.UserName).HasMaxLength(64);
            e.Property(u => u.Email).HasMaxLength(128);
            e.HasMany(u => u.Matches)
                .WithOne(m => m.User!)
                .HasForeignKey(m => m.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            e.HasMany(u => u.Scores)
                .WithOne(s => s.User!)
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Score>(e =>
        {
            e.HasIndex(s => new { s.UserId, s.RecordedAt });
        });

        modelBuilder.Entity<Match>(e =>
        {
            e.HasIndex(m => new { m.UserId, m.PlayedAt });
        });
    }
}
