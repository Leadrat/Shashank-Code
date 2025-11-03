# Data Model Documentation

## Core Entities

### 1. GameBoard

**Description**: Represents the game's grid state

**Properties**:
- `cells`: Cell[][] (3x3 grid)
- `currentPlayer`: Player
- `status`: GameStatus
- `winningCombination`: number[][] | null

**Validation Rules**:
- Grid must be 3x3
- Cells can only contain valid marks (X, O) or be empty
- Only one move can be made at a time
- Moves only allowed on empty cells

### 2. Player

**Description**: Represents a player in the game

**Properties**:
- `mark`: PlayerMark (X or O)
- `score`: number
- `isActive`: boolean

**Validation Rules**:
- Mark must be either X or O
- Score must be non-negative
- Only one player can be active at a time

### 3. Cell

**Description**: Represents a single cell in the game grid

**Properties**:
- `value`: PlayerMark | null
- `position`: Position
- `isWinning`: boolean

**Validation Rules**:
- Value can only be X, O, or null
- Position must be within 3x3 grid bounds
- isWinning only true when part of winning combination

### 4. GameState

**Description**: Represents the current state of the game

**Properties**:
- `status`: GameStatus
- `board`: GameBoard
- `players`: Player[]
- `moveHistory`: Move[]

**Validation Rules**:
- Must have exactly two players
- Status must be valid game state
- Move history must be sequential

## Type Definitions

```typescript
enum PlayerMark {
  X = 'X',
  O = 'O'
}

enum GameStatus {
  InProgress = 'IN_PROGRESS',
  Won = 'WON',
  Draw = 'DRAW'
}

interface Position {
  row: number;
  col: number;
}

interface Move {
  player: PlayerMark;
  position: Position;
  timestamp: number;
}
```

## State Transitions

1. **New Game**
   - Board cells initialized to null
   - Player X set as active
   - Status set to InProgress
   - Move history cleared
   - Scores preserved

2. **Make Move**
   - Cell updated with player mark
   - Active player switched
   - Win/draw condition checked
   - Move added to history

3. **Game End**
   - Status updated to Won/Draw
   - Winning combination marked (if won)
   - Winner's score incremented (if won)
   - Active player status cleared

## Data Flow

1. **User Interaction**
   ```
   Click Event → Position Validation → Move Processing → State Update → UI Update
   ```

2. **State Updates**
   ```
   State Change → Win Detection → Status Update → Score Update → Display Update
   ```

3. **Game Reset**
   ```
   Reset Trigger → State Reset → Board Clear → Turn Reset → Display Reset
   ```