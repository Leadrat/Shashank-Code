export interface Move {
  player: 'X' | 'O';
  position: number;
}

export interface GameData {
  id: string;
  moves: Move[];
  winner: 'X' | 'O' | 'tie';
  date: string;
  gameMode: 'ai' | 'human';
  player1Name: string;
  player2Name: string;
}

const DB_NAME = 'TicTacToeDB';
const DB_VERSION = 2; // Increased version for schema update
const STORE_NAME = 'games';

let db: IDBDatabase | null = null;

export const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error('Failed to open database'));
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const store = database.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('date', 'date', { unique: false });
        store.createIndex('gameMode', 'gameMode', { unique: false });
      }
    };
  });
};

export const saveGame = async (gameData: GameData): Promise<void> => {
  const database = await openDB();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(gameData);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(new Error('Failed to save game'));
  });
};

export const getGameHistory = async (): Promise<GameData[]> => {
  const database = await openDB();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const games = request.result as GameData[];
      // Add default values for older games that don't have the new fields
      const updatedGames = games.map(game => ({
        ...game,
        gameMode: game.gameMode || 'ai',
        player1Name: game.player1Name || (game.gameMode === 'human' ? 'Player 1' : 'You'),
        player2Name: game.player2Name || (game.gameMode === 'human' ? 'Player 2' : 'AI'),
      }));
      // Sort by date, newest first
      updatedGames.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      resolve(updatedGames);
    };
    
    request.onerror = () => reject(new Error('Failed to get game history'));
  });
};

export const clearAllGames = async (): Promise<void> => {
  const database = await openDB();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(new Error('Failed to clear games'));
  });
};

export const getGame = async (id: string): Promise<GameData | null> => {
  const database = await openDB();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => {
      resolve(request.result || null);
    };
    
    request.onerror = () => reject(new Error('Failed to get game'));
  });
};
