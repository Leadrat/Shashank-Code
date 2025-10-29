import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Generate a random room ID
function generateRoomId(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Check for win condition
function checkWinner(board: (string | null)[]): string | null {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  if (board.every(cell => cell !== null)) {
    return "draw";
  }

  return null;
}

export const createGame = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    const roomId = generateRoomId();
    
    const gameId = await ctx.db.insert("games", {
      roomId,
      players: [{
        userId,
        username: user.name || user.email || "Player",
        symbol: "X",
      }],
      board: Array(9).fill(null),
      currentTurn: "X",
      status: "waiting",
      moveHistory: [],
      createdAt: Date.now(),
    });

    return { gameId, roomId };
  },
});

export const joinGame = mutation({
  args: { roomId: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    const game = await ctx.db
      .query("games")
      .withIndex("by_room_id", (q) => q.eq("roomId", args.roomId))
      .filter((q) => q.eq(q.field("status"), "waiting"))
      .first();

    if (!game) throw new Error("Game not found or already started");
    
    if (game.players.length >= 2) throw new Error("Game is full");
    
    if (game.players.some(p => p.userId === userId)) {
      throw new Error("Already in this game");
    }

    await ctx.db.patch(game._id, {
      players: [
        ...game.players,
        {
          userId,
          username: user.name || user.email || "Player",
          symbol: "O",
        }
      ],
      status: "playing",
    });

    return game._id;
  },
});

export const makeMove = mutation({
  args: { 
    gameId: v.id("games"), 
    position: v.number() 
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const game = await ctx.db.get(args.gameId);
    if (!game) throw new Error("Game not found");

    if (game.status !== "playing") throw new Error("Game not in progress");

    const player = game.players.find(p => p.userId === userId);
    if (!player) throw new Error("Not a player in this game");

    if (game.currentTurn !== player.symbol) {
      throw new Error("Not your turn");
    }

    if (game.board[args.position] !== null) {
      throw new Error("Position already taken");
    }

    const newBoard = [...game.board];
    newBoard[args.position] = player.symbol;

    const newMoveHistory = [
      ...game.moveHistory,
      {
        position: args.position,
        symbol: player.symbol,
        timestamp: Date.now(),
      }
    ];

    const winner = checkWinner(newBoard);
    const nextTurn = player.symbol === "X" ? "O" : "X";

    const updates: any = {
      board: newBoard,
      moveHistory: newMoveHistory,
    };

    if (winner) {
      updates.status = "finished";
      updates.winner = winner;
      updates.finishedAt = Date.now();

      // Update user stats and create match record
      await updateUserStats(ctx, game, winner);
      await createMatchRecord(ctx, game, newMoveHistory, winner);
    } else {
      updates.currentTurn = nextTurn;
    }

    await ctx.db.patch(args.gameId, updates);
  },
});

async function updateUserStats(ctx: any, game: any, winner: string) {
  for (const player of game.players) {
    let stats = await ctx.db
      .query("userStats")
      .withIndex("by_user_id", (q: any) => q.eq("userId", player.userId))
      .first();

    if (!stats) {
      stats = await ctx.db.insert("userStats", {
        userId: player.userId,
        wins: 0,
        losses: 0,
        draws: 0,
        totalGames: 0,
      });
      stats = await ctx.db.get(stats);
    }

    const isWinner = winner === player.symbol;
    const isDraw = winner === "draw";

    await ctx.db.patch(stats._id, {
      wins: stats.wins + (isWinner ? 1 : 0),
      losses: stats.losses + (!isDraw && !isWinner ? 1 : 0),
      draws: stats.draws + (isDraw ? 1 : 0),
      totalGames: stats.totalGames + 1,
    });
  }
}

async function createMatchRecord(ctx: any, game: any, moveHistory: any[], winner: string) {
  const players = game.players.map((player: any) => ({
    userId: player.userId,
    username: player.username,
    result: winner === "draw" ? "draw" : 
            winner === player.symbol ? "win" : "loss"
  }));

  await ctx.db.insert("matches", {
    gameId: game._id,
    players,
    winner: winner === "draw" ? "draw" : winner,
    moveHistory,
    duration: Date.now() - game.createdAt,
    createdAt: Date.now(),
  });
}

export const getGame = query({
  args: { gameId: v.id("games") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.gameId);
  },
});

export const getGameByRoomId = query({
  args: { roomId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("games")
      .withIndex("by_room_id", (q) => q.eq("roomId", args.roomId))
      .first();
  },
});

export const getUserStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    return await ctx.db
      .query("userStats")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();
  },
});

export const getUserMatches = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const matches = await ctx.db
      .query("matches")
      .collect();

    return matches
      .filter(match => match.players.some(p => p.userId === userId))
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 20);
  },
});
