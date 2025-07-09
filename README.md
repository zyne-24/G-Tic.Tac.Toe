# Documentation: Tic Tac Toe | zyne-24
## Overview - 📌
This is Tic Tac Toe web-based game with 2 modes :
- Single Player with 2 difficulty levels: EZ mode and Impossible🗿 (Minimax AI)
- Two Players for playing locally with a friend

## How to Play - ❔

Visit this site [Tic Tac Toe | zyne](https://zyne-24.github.io/G-Tic.Tac.Toe/)

1. **Choose a game mode:**
   - Click **Single-Player** to play against the AI.
   - Click **2-Player** to play with a friend on the same device.

2. **If you choose Single-Player:**
   - Select the difficulty level:
     - **Impossible🗿** — AI plays perfectly using the Minimax algorithm.
     - **EZ mode** — AI makes random moves for an easier challenge.
   - The game randomly decides who starts first — you or the AI.

3. **Gameplay:**
   - The board is a 3x3 grid.
   - Players take turns placing their symbol:
     - Player 1 uses **X**.
     - Player 2 or AI uses **O**.
   - Click an empty cell to place your mark during your turn.

4. **Winning the game:**
   - The first player to get 3 of their marks in a row — horizontally, vertically, or diagonally — wins.
   - If all cells are filled without a winner, the game ends in a draw.

5. **Restart or go back to menu:**
   - After the game ends, click **Menu** to return to the main menu and start a new game.

Enjoy playing Tic Tac Toe!



## 1. HTML & CSS - ⚙️
### Features :
- Responsive design using Bulma framework
- Google Font: Poppins
- Game board grid (3x3) styled with custom CSS
- Colored X/O styles:
  - X: Red (#AF0404)
  - O: Cyan (#00FFF5)
- Button styles for game modes and actions
- Animated hover effects on board cells

### UI Elements :
- Title and subtitle
- Menu with buttons for game modes
- Mode selector (difficulty)
- 3x3 game board
- Status text (e.g., current turn, result)
- Restart/Menu button

### Style :
- Dark Theme ```#222831```
- CSS Grid :
  ``` CSS
  #board {
  display: grid;
  grid-template-columns: repeat(3, 100px);
  grid-template-rows: repeat(3, 100px);
  }
- Custom styles for ```X``` and ```O``` symbols

## 2. Flow - 🔁
1. User chooses Single Player or 2 Player from the main menu
2. If 1P is selected, user chooses difficulty:
   - EZ Mode → AI makes random moves
   - - Impossible Mode → AI uses Minimax algorithm
3. If 2P is selected, user play with local friend
4. User back to menu when game is over

## 3. JavaScript - 🧠
### Key Variables :
| Variable        | Purpose                                      |
|-----------------|----------------------------------------------|
| `cells`         | Array representing 9 game cells              |
| `currentPlayer` | Either `'X'` or `'O'`                        |
| `gameOver`      | Flag to indicate if the game has ended       |
| `mode`          | Current game mode: `'2P'`, `'1P-easy'`, or `'1P-normal'` |
| `humanPlayer`   | Symbol assigned to the human player (`'X'` or `'O'`) |
| `aiPlayer`      | Symbol assigned to the AI player             |

### Game Start - 🎮
```startGame(mode)```
- Sets up the board
- Randomizes turn for 1P
- Shows board, hides menu
- If AI goes first, triggers aiMove()

### Uer Interaction
```drawBoard()```
- Renders the game board using DOM
- Applies ```.player-x``` or ```.player-o``` to each cell
- Adds click listeners to empty cells

  ```handleClick(index)```
  - Ignores clicks if:
    - Game is over
    - Cell already filled
    - It's AI's turn
  - Sets ```cells[index]``` = currentPlayer
  - Updates board and checks for:
      - Win → show result
      - Draw → show "Draw!"
      - Else → switch turns and call aiMove() if AI's turn

📣 updateStatus()
  - Shows whose turn it is
  - Displays "Your Turn" / "AI Turn" in 1P mode

AI Logic

aiMove()

    Called when it is the AI's turn.

    If mode is Easy (EZ), AI chooses a random empty cell using getRandomMove().

    If mode is Impossible (Normal), AI chooses the best move using Minimax via getBestMove().

    Updates the board with the chosen move and redraws it.

    Checks if AI won or if the game is a draw.

    If game is not over, switches turn back to the human player.

getRandomMove()

    Finds all empty cells on the board.

    Returns one random index from those empty cells.

    Used for easy AI mode to make random moves.

getBestMove()

    Iterates over all empty cells.

    Simulates placing the AI's move in each empty cell.

    Uses the minimax() function to evaluate the potential outcome of each move.

    Selects and returns the move with the highest score.

minimax(boardState, depth, isMaximizing)

    A recursive function implementing the Minimax algorithm.

    Base cases:

        Returns 10 - depth if AI wins.

        Returns depth - 10 if human wins.

        Returns 0 if the game is a draw.

    If isMaximizing is true, tries to maximize the score (AI's turn).

    If isMaximizing is false, tries to minimize the score (human's turn).

    Explores all possible moves and their outcomes to find the optimal move.

Win Checking and Restart

checkWin(player, boardState = cells)

    Checks all possible winning combinations:

        Rows: [0,1,2], [3,4,5], [6,7,8]

        Columns: [0,3,6], [1,4,7], [2,5,8]

        Diagonals: [0,4,8], [2,4,6]

    Returns true if the specified player has any winning pattern, otherwise false.

restartGame()

    Resets all game variables and states to initial values.

    Clears the board and hides the game interface.

    Shows the main menu again to select a game mode.

    Clears the status text and hides the restart button.

