# Quick Setup Guide

## Step-by-Step Setup

### 1. Install Prerequisites

**Windows:**
```powershell
# Install .NET 8 SDK
winget install Microsoft.DotNet.SDK.8

# Install Node.js
winget install OpenJS.NodeJS

# Install PostgreSQL
winget install PostgreSQL.PostgreSQL
```

### 2. PostgreSQL Setup

1. Start PostgreSQL service
2. Open pgAdmin or psql
3. Run:
```sql
CREATE DATABASE TicTacToeDb;
CREATE USER tictactoe_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE TicTacToeDb TO tictactoe_user;
```

4. Update `Backend/appsettings.json`:
```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Database=TicTacToeDb;Username=tictactoe_user;Password=your_password"
}
```

### 3. Backend Setup

```bash
cd Backend
dotnet restore
dotnet tool install --global dotnet-ef
dotnet ef migrations add InitialCreate
dotnet ef database update
dotnet run
```

### 4. Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

### 5. Access Application

Open: http://localhost:5173

## Create First Admin User

After starting the app:

1. Register a user through the web interface
2. Note the user ID from the database or logs
3. Run in database:
```sql
UPDATE "AspNetUsers" SET "Role" = 'Admin' WHERE "Email" = 'your@email.com';
```

Or use the Admin API endpoint after setting up your first admin.

## Troubleshooting

### Backend won't start
- Check PostgreSQL is running
- Verify connection string is correct
- Run: `dotnet clean` then `dotnet build`

### Frontend can't connect
- Ensure backend is running on port 5000
- Check CORS configuration in `Backend/Program.cs`
- Clear browser cache and localStorage

### Database migration errors
```bash
dotnet ef migrations remove
dotnet ef migrations add InitialCreate
dotnet ef database update --force
```
