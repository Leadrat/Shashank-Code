# 🎮 Smart Tic Tac Toe - Full Stack Application

A modern, full-stack Tic Tac Toe game built with React, .NET 8, PostgreSQL, and Microsoft Identity authentication.

## ✨ Features

- **User Authentication**: Secure signup and login using Microsoft Identity with JWT tokens
- **Two Game Modes**:
  - 🤖 **Player vs AI**: Challenge an intelligent AI opponent
  - 👥 **Two Player Mode**: Play locally with a friend
- **Score Tracking**: Automatic tracking of wins, losses, and draws for logged-in users
- **Scoreboard**: View your personal statistics and win rate
- **Admin Panel**: Admins can view all users and their game statistics
- **Game Replay**: Replay your last completed game
- **Modern UI**: Beautiful gradient design with Tailwind CSS

## 🛠️ Tech Stack

### Backend
- **ASP.NET Core 8** Web API
- **PostgreSQL** Database
- **Entity Framework Core** ORM
- **Microsoft Identity** for authentication
- **JWT Bearer** tokens
- **Repository Pattern** with Dependency Injection

### Frontend
- **React 18** with Vite
- **React Router** for navigation
- **Axios** for API calls
- **Tailwind CSS** for styling
- **Local Storage** for token management

## 📋 Prerequisites

Before running this application, make sure you have installed:

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/) (v18 or higher)
- [PostgreSQL](https://www.postgresql.org/download/) (v14 or higher)
- npm or yarn

## 🚀 Setup Instructions

### 1. Database Setup

1. Install PostgreSQL if you haven't already
2. Create a new database:
   ```sql
   CREATE DATABASE TicTacToeDb;
   ```
3. Update the connection string in `Backend/appsettings.json`:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Host=localhost;Database=TicTacToeDb;Username=YOUR_USERNAME;Password=YOUR_PASSWORD"
   }
   ```

### 2. Backend Setup

1. Navigate to the Backend folder:
   ```bash
   cd Backend
   ```

2. Restore NuGet packages:
   ```bash
   dotnet restore
   ```

3. Apply database migrations:
   ```bash
   dotnet ef database update
   ```
   (If this is your first time, create migrations first with: `dotnet ef migrations add InitialCreate`)

4. Run the backend:
   ```bash
   dotnet run
   ```
   The API will start at `http://localhost:5000`

### 3. Frontend Setup

1. Open a new terminal and navigate to the Frontend folder:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   The frontend will start at `http://localhost:5173`

### 4. Access the Application

Open your browser and navigate to: `http://localhost:5173`

## 🎯 Usage

### Getting Started

1. **Sign Up**: Create a new account with your email and password
2. **Login**: Use your credentials to log in
3. **Play Games**: Choose between AI mode or Two Player mode
4. **View Stats**: Check your scoreboard to see your statistics

### Game Modes

#### Player vs AI 🤖
- Play against an intelligent AI opponent
- Scores are tracked and saved
- The AI uses a strategic algorithm:
  - First tries to win
  - Then blocks your winning moves
  - Takes center if available
  - Otherwise makes random valid moves

#### Two Player Mode 👥
- Play locally with a friend on the same device
- Scores are not tracked (for fairness)
- Players take turns alternating between X and O

### Admin Features

To access admin features:
1. An existing admin must promote you to admin role, OR
2. Manually update the database to set a user's role to "Admin"

Admin users can:
- View all registered users
- See complete game statistics for all players
- Monitor total games played by each user

## 📁 Project Structure

```
Cursor-TicTacToe/
├── Backend/
│   ├── Controllers/          # API Controllers (Auth, Game, Score, Admin)
│   ├── Models/               # Database models (User, Game, Score)
│   ├── Data/                 # DbContext and database configuration
│   ├── DTOs/                 # Data Transfer Objects
│   ├── Repositories/         # Repository pattern implementation
│   ├── Services/             # Business logic (Game AI)
│   ├── Program.cs            # Application startup and configuration
│   ├── appsettings.json      # Configuration file
│   └── Backend.csproj        # Project file
├── Frontend/
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── pages/            # Page components (Landing, Login, Game, etc.)
│   │   ├── services/         # API service layer
│   │   ├── App.jsx           # Main app component
│   │   └── main.jsx          # Entry point
│   ├── package.json          # NPM dependencies
│   ├── vite.config.js        # Vite configuration
│   └── tailwind.config.js    # Tailwind CSS configuration
└── README.md                 # This file
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/current` - Get current user info

### Game
- `POST /api/game/play` - Submit a move (AI makes move if mode is AI)
- `GET /api/game/replay` - Get the last played game

### Score
- `GET /api/score/user` - Get current user's score
- `GET /api/score/all` - Get all scores (Admin only)

### Admin
- `GET /api/admin/users` - Get all users (Admin only)
- `GET /api/admin/scores` - Get all scores (Admin only)
- `POST /api/admin/{userId}/make-admin` - Promote user to admin

## 🧠 AI Algorithm

The AI uses a strategic approach:
1. **Check for winning move**: If AI can win, it takes that position
2. **Block player**: If player is about to win, AI blocks
3. **Take center**: If center is available and no immediate threats, take it
4. **Random move**: Choose a random valid position

## 🎨 Features in Detail

### Authentication
- JWT-based authentication with secure token storage
- Password hashing using ASP.NET Identity
- Protected API endpoints using `[Authorize]` attribute
- Role-based access control (Player/Admin)

### Score Tracking
- Automatic score updates after AI games
- Wins, losses, and draws tracked separately
- Win rate calculation displayed on scoreboard

### Game Persistence
- All games saved to PostgreSQL database
- Board state stored as JSON
- Timestamp tracking for each game

## 🐛 Troubleshooting

### Backend Issues
- **Database connection error**: Check your PostgreSQL connection string in `appsettings.json`
- **Migration errors**: Run `dotnet ef migrations remove` then recreate
- **Port already in use**: Change port in `launchSettings.json`

### Frontend Issues
- **API connection error**: Ensure backend is running on port 5000
- **CORS errors**: Check CORS configuration in `Program.cs`
- **Build errors**: Delete `node_modules` and run `npm install` again

## 📝 License

This project is open source and available for educational purposes.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📧 Contact

For questions or support, please open an issue on the project repository.

---

**Enjoy playing Smart Tic Tac Toe! 🎮**
