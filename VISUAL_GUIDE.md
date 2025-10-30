# 🎮 Smart Tic Tac Toe - Visual Guide

## 📸 Application Flow

```
┌─────────────────────────────────────────────────────────┐
│              LANDING PAGE                               │
│  🎮 Smart Tic Tac Toe                                   │
│  ┌─────────────────┐  ┌─────────────────┐             │
│  │  Play with AI   │  │ Two Player Mode │             │
│  └─────────────────┘  └─────────────────┘             │
│  ┌─────────────────┐  ┌─────────────────┐             │
│  │  Scoreboard     │  │ Admin Panel     │             │
│  └─────────────────┘  └─────────────────┘             │
│  ┌─────────────────┐                                   │
│  │  Login/Signup   │                                   │
│  └─────────────────┘                                   │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│           LOGIN/SIGNUP PAGE                             │
│  [Username Input]                                       │
│  [Email Input]                                          │
│  [Password Input]                                       │
│  ┌─────────────────┐                                   │
│  │  Register/Login │                                   │
│  └─────────────────┘                                   │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              GAME PAGE                                  │
│  ┌───┬───┬───┐                                         │
│  │ X │ O │ X │                                         │
│  ├───┼───┼───┤                                         │
│  │ O │ X │   │                                         │
│  ├───┼───┼───┤                                         │
│  │   │ O │ X │                                         │
│  └───┴───┴───┘                                         │
│  [New Game] [Replay] [Back to Home]                    │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│            SCOREBOARD PAGE                              │
│  Your Stats:                                            │
│  Wins: 5    Losses: 3    Draws: 2                      │
│  Win Rate: 50%                                          │
│  ┌─────────────────┐                                   │
│  │  Back to Home   │                                   │
│  └─────────────────┘                                   │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              ADMIN PANEL                                │
│  [Username] [Email] [Role] [Wins] [Losses] [Draws]     │
│  [Username] [Email] [Role] [Wins] [Losses] [Draws]     │
│  [Username] [Email] [Role] [Wins] [Losses] [Draws]     │
│  ┌─────────────────┐                                   │
│  │  Back to Home   │                                   │
│  └─────────────────┘                                   │
└─────────────────────────────────────────────────────────┘
```

## 🎨 UI Design Elements

### Color Scheme
- **Primary Gradient**: Purple (#667eea) → Blue (#764ba2)
- **Win**: Green (#10b981)
- **Loss**: Red (#ef4444)
- **Draw**: Yellow (#f59e0b)
- **Admin Badge**: Purple background
- **Player Badge**: Green background

### Components
- **Cards**: White with rounded corners (rounded-2xl)
- **Buttons**: Gradient backgrounds with hover effects
- **Board Cells**: Gradient from purple-100 to blue-100
- **Icons**: Emoji-based for modern feel

## 🔄 Game Flow Diagram

```
Start Game
    │
    ├─→ AI Mode
    │      │
    │      ├─→ Player makes move
    │      │      │
    │      │      └─→ Send to API
    │      │             │
    │      │             └─→ AI makes move
    │      │                    │
    │      │                    └─→ Return board
    │      │                           │
    │      └─→ Check winner ←──────────┘
    │             │
    │             ├─→ Win? → Update score (Wins++)
    │             ├─→ Lose? → Update score (Losses++)
    │             └─→ Draw? → Update score (Draws++)
    │
    └─→ Two Player Mode
           │
           ├─→ Player 1 (X) makes move
           │      │
           │      └─→ Check winner
           │             │
           ├─→ Player 2 (O) makes move
           │      │
           │      └─→ Check winner
           │             │
           └─→ Continue until win/draw
```

## 🔐 Authentication Flow

```
┌─────────────┐
│   Register  │
└──────┬──────┘
       │
       └─→ Create User in DB
             │
             └─→ Generate JWT Token
                   │
                   └─→ Store in localStorage
                         │
                         └─→ Redirect to Home

┌─────────────┐
│    Login    │
└──────┬──────┘
       │
       └─→ Verify Credentials
             │
             └─→ Generate JWT Token
                   │
                   └─→ Store in localStorage
                         │
                         └─→ Set User Context
                               │
                               └─→ Redirect to Home

Protected Route Access:
       │
       ├─→ Check localStorage for token
       │     │
       │     ├─→ Yes? → Verify with backend
       │     │           │
       │     │           └─→ Valid? → Allow access
       │     │                           │
       │     │                           └─→ Invalid? → Redirect to login
       │     │
       │     └─→ No? → Redirect to login
```

## 🗄️ Database Relationships

```
Users (Identity)
  │
  ├─→ Role: string (Player/Admin)
  │
  ├─→ Games (One-to-Many)
  │     │
  │     ├─→ Mode: string
  │     ├─→ Result: string
  │     ├─→ BoardState: string (JSON)
  │     └─→ CreatedAt: DateTime
  │
  └─→ Score (One-to-One)
        │
        ├─→ Wins: int
        ├─→ Losses: int
        └─→ Draws: int
```

## 🎯 API Request/Response Examples

### Register
```json
POST /api/auth/register
{
  "username": "player1",
  "email": "player1@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "message": "User registered successfully"
}
```

### Login
```json
POST /api/auth/login
{
  "email": "player1@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-id",
    "username": "player1",
    "email": "player1@example.com",
    "role": "Player"
  }
}
```

### Play Game
```json
POST /api/game/play
Headers: { "Authorization": "Bearer <token>" }
{
  "board": ["X", "O", "X", "O", "X", "", "", "", ""],
  "mode": "AI"
}

Response: 200 OK
{
  "board": ["X", "O", "X", "O", "X", "", "O", "", ""],
  "mode": "AI",
  "result": ""  // or "PlayerWin", "AIWin", "Draw"
}
```

### Get Score
```json
GET /api/score/user
Headers: { "Authorization": "Bearer <token>" }

Response: 200 OK
{
  "wins": 5,
  "losses": 3,
  "draws": 2
}
```

## 🎮 Game States

1. **Playing**: Game in progress, making moves
2. **Checking**: After move, checking for winner
3. **Won**: Game won by player or AI
4. **Lost**: Game lost to AI
5. **Draw**: Game ended in draw
6. **Replay**: Viewing last played game

Enjoy your Smart Tic Tac Toe game! 🎉
