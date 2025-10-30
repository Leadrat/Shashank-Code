# Quick Start Guide

## 🚀 Fastest Way to Run

### Option 1: Using PowerShell Script (Windows)

```powershell
# Run this in PowerShell from the project root
.\start.ps1
```

### Option 2: Manual Start

#### Terminal 1 - Backend:
```bash
cd Backend
dotnet restore
dotnet ef database update
dotnet run
```

#### Terminal 2 - Frontend:
```bash
cd Frontend
npm install
npm run dev
```

### Option 3: Using Bash Script (Mac/Linux)

```bash
chmod +x start.sh
./start.sh
```

## 📋 Quick Checklist

- [ ] PostgreSQL is running
- [ ] Database `TicTacToeDb` exists
- [ ] Connection string in `Backend/appsettings.json` is correct
- [ ] Backend is running on port 5000
- [ ] Frontend is running on port 5173

## 🌐 Access

Open your browser: http://localhost:5173

## 🎮 First Steps

1. **Sign Up** - Create your account
2. **Login** - Enter your credentials
3. **Play** - Choose "Play with AI" or "Two Player Mode"
4. **Scoreboard** - Check your stats

## 👑 Admin Access

After registering, manually set yourself as admin in the database:

```sql
UPDATE "AspNetUsers" 
SET "Role" = 'Admin' 
WHERE "Email" = 'your@email.com';
```

Then refresh the page and you'll see the "Admin Panel" button!

---

**Need help?** Check the full README.md for detailed instructions.
