# RealTime Tic Tac Toe — Clean Architecture Refactor

This project has been refactored to follow Clean Architecture while preserving all existing API routes, authentication, game logic, and SQLite database.

## Solution Structure

- Domain
  - Entities: `User`, `Game`, `Score`
  - Pure domain models, no external dependencies
- Application
  - DTOs: `RegisterDto`, `LoginDto`, `GameMoveDto`, `AdminUserDto`
  - Abstractions: `IGameRepository`, `IScoreRepository`, `IUserRepository`
  - Services: `IGameService` (AI + winner checker)
- Infrastructure
  - Persistence: `ApplicationDbContext` (EF Core Sqlite + ASP.NET Identity)
  - Repositories: `GameRepository`, `ScoreRepository`, `UserRepository`
  - DI: `AddInfrastructure(IConfiguration)` to wire DbContext, Identity, Repos
- WebAPI
  - Controllers: `AuthController`, `GameController`, `ScoreController`, `AdminController`
  - Program.cs: Swagger, CORS, JWT, DI setup, migrate-on-startup

Dependencies flow: WebAPI -> Application -> Domain and WebAPI -> Infrastructure -> Application/Domain. No direct references from Application to Infrastructure (only via interfaces).

## Database & Identity

- Database: SQLite (kept)
- Identity: Microsoft ASP.NET Identity using the domain `User` entity
- Connection string in `WebAPI/appsettings.json` (`DefaultConnection`)
- Automatic migrations on startup (`Database.Migrate()`). Initial migrations generated under `Infrastructure/Migrations`.

## API Routes (unchanged)

- Auth
  - POST `/api/auth/register`
  - POST `/api/auth/login`
  - POST `/api/auth/logout` (auth required)
  - GET `/api/auth/current` (auth required)
- Game (auth required)
  - POST `/api/game/play`
  - GET `/api/game/replay`
- Score (auth required)
  - GET `/api/score/user`
  - GET `/api/score/all` (Admin)
- Admin (Admin role required)
  - GET `/api/admin/users`
  - GET `/api/admin/scores`
  - POST `/api/admin/{userId}/make-admin`

## Run Locally

1. Prereqs: .NET SDK 9+, PowerShell
2. Restore and build
   - `dotnet restore`
   - `dotnet build`
3. Apply migrations (first run only)
   - `dotnet ef database update --project Infrastructure --startup-project WebAPI`
4. Run WebAPI
   - `dotnet run --project WebAPI`
5. Swagger UI
   - Open `http://localhost:5218/swagger` (port may vary; see console output)

## Configuration

- `WebAPI/appsettings.json` contains:
  - `ConnectionStrings:DefaultConnection` pointing to `tictactoe.db`
  - `JwtSettings` (SecretKey, Issuer, Audience, ExpirationMinutes)
  - `AllowedOrigins` for CORS

## Notes on CQRS

- The Application project is ready to adopt CQRS with MediatR. Current controllers call Application services/repositories directly to preserve behavior quickly. You can incrementally introduce Commands/Queries and handlers without changing routes.

## Testing Flow (example)

1. Register: POST `/api/auth/register` with `{ email, password, username }`
2. Login: POST `/api/auth/login` => copy `token`
3. Authorize in Swagger: `Bearer {token}`
4. Play game: POST `/api/game/play` with `{ board: ["","",...], mode: "AI" }`
5. Replay: GET `/api/game/replay`
6. Score: GET `/api/score/user`
7. Admin (optional): Promote a user then access admin endpoints

## Frontend Compatibility

- All routes and response shapes remain the same. CORS allows localhost dev ports.

## Folder Mapping from Old Backend

- Backend/Models -> Domain/Entities
- Backend/DTOs -> Application/DTOs
- Backend/Data -> Infrastructure/Persistence
- Backend/Repositories -> Infrastructure/Repositories (+ Application abstractions)
- Backend/Services -> Application/Services
- Backend/Controllers -> WebAPI/Controllers

## Security

- Do not commit real JWT secrets. Keep `SecretKey` strong and externalized in production.
