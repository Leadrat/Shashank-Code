# Backend API Documentation

## .NET 8 Web API

### Running the Backend

```bash
cd Backend
dotnet restore
dotnet ef database update
dotnet run
```

API will be available at: `http://localhost:5000`

### Swagger Documentation

Once running, visit: `http://localhost:5000/swagger`

### Database Migrations

```bash
# Create a new migration
dotnet ef migrations add MigrationName

# Apply migrations to database
dotnet ef database update

# Remove last migration
dotnet ef migrations remove
```

### Required Packages

All packages are already configured in `Backend.csproj`:
- Microsoft.AspNetCore.Authentication.JwtBearer
- Microsoft.AspNetCore.Identity.EntityFrameworkCore
- Microsoft.EntityFrameworkCore.Design
- Microsoft.EntityFrameworkCore.Tools
- Npgsql.EntityFrameworkCore.PostgreSQL
- System.IdentityModel.Tokens.Jwt

### Project Structure

- **Controllers/**: API endpoints
- **Models/**: Entity models (User, Game, Score)
- **DTOs/**: Data transfer objects for API requests/responses
- **Services/**: Business logic (Game AI algorithm)
- **Repositories/**: Data access layer
- **Data/**: DbContext configuration
