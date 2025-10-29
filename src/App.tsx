import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { GameLobby } from "./components/GameLobby";
import { useState } from "react";

export default function App() {
  return (    
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm h-16 flex justify-between items-center border-b border-blue-200 shadow-sm px-4">
        <h2 className="text-2xl font-bold text-blue-600">Tic-Tac-Toe</h2>
        <Authenticated>
          <SignOutButton />
        </Authenticated>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl mx-auto">
          <Content />
        </div>
      </main>
      <Toaster />
    </div>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const [currentView, setCurrentView] = useState<"lobby" | "game">("lobby");

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <Unauthenticated>
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-blue-600 mb-4">Tic-Tac-Toe</h1>
          <p className="text-xl text-gray-600 mb-8">
            Play real-time multiplayer Tic-Tac-Toe with friends around the world
          </p>
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
            <SignInForm />
          </div>
        </div>
      </Unauthenticated>

      <Authenticated>
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-blue-600 mb-4">Welcome back!</h1>
          <p className="text-xl text-gray-600">
            Ready to play?
          </p>
        </div>
        <GameLobby />
      </Authenticated>
    </div>
  );
}
