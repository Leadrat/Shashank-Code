import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  games: defineTable({
    roomId: v.string(),
    players: v.array(v.object({
      userId: v.id("users"),
      username: v.string(),
      symbol: v.union(v.literal("X"), v.literal("O")),
    })),
    board: v.array(v.union(v.literal("X"), v.literal("O"), v.null())),
    currentTurn: v.union(v.literal("X"), v.literal("O")),
    status: v.union(
      v.literal("waiting"),
      v.literal("playing"),
      v.literal("finished")
    ),
    winner: v.optional(v.union(v.literal("X"), v.literal("O"), v.literal("draw"))),
    moveHistory: v.array(v.object({
      position: v.number(),
      symbol: v.union(v.literal("X"), v.literal("O")),
      timestamp: v.number(),
    })),
    createdAt: v.number(),
    finishedAt: v.optional(v.number()),
  })
    .index("by_room_id", ["roomId"])
    .index("by_status", ["status"]),

  userStats: defineTable({
    userId: v.id("users"),
    wins: v.number(),
    losses: v.number(),
    draws: v.number(),
    totalGames: v.number(),
  })
    .index("by_user_id", ["userId"]),

  matches: defineTable({
    gameId: v.id("games"),
    players: v.array(v.object({
      userId: v.id("users"),
      username: v.string(),
      result: v.union(v.literal("win"), v.literal("loss"), v.literal("draw")),
    })),
    winner: v.optional(v.union(v.literal("X"), v.literal("O"), v.literal("draw"))),
    moveHistory: v.array(v.object({
      position: v.number(),
      symbol: v.union(v.literal("X"), v.literal("O")),
      timestamp: v.number(),
    })),
    duration: v.number(),
    createdAt: v.number(),
  })
    .index("by_player", ["players"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
