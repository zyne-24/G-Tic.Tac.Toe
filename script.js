const board = document.getElementById("board");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restartBtn");

let cells = Array(9).fill(null);
let currentPlayer = "X";
let gameOver = false;
let mode = null; // "1P" atau "2P"

function startGame(selectedMode) {
  mode = selectedMode;
  document.getElementById("menu").style.display = "none";
  board.style.display = "grid";
  restartBtn.style.display = "inline-block";
  drawBoard();
}

function drawBoard() {
  board.innerHTML = "";
  cells.forEach((cell, index) => {
    const cellDiv = document.createElement("div");
    cellDiv.classList.add("cell");
    cellDiv.textContent = cell;
    cellDiv.addEventListener("click", () => handleClick(index));
    board.appendChild(cellDiv);
  });
  if (!gameOver) {
    statusText.textContent = `Giliran: ${currentPlayer}`;
  }
}

function handleClick(index) {
  if (cells[index] || gameOver) return;

  cells[index] = currentPlayer;
  drawBoard();

  if (checkWin(currentPlayer)) {
    statusText.textContent = `${currentPlayer} menang!`;
    gameOver = true;
    return;
  }

  if (cells.every(cell => cell !== null)) {
    statusText.textContent = "Seri!";
    gameOver = true;
    return;
  }

  if (mode === "2P") {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Giliran: ${currentPlayer}`;
  } else if (mode === "1P") {
    currentPlayer = "O";
    setTimeout(aiMove, 500);
  }
}

function aiMove() {
  const bestMove = getBestMove();
  cells[bestMove] = "O";
  drawBoard();

  if (checkWin("O")) {
    statusText.textContent = "Komputer menang!";
    gameOver = true;
    return;
  }

  if (cells.every(cell => cell !== null)) {
    statusText.textContent = "Seri!";
    gameOver = true;
    return;
  }

  currentPlayer = "X";
  statusText.textContent = "Giliran: X";
}

function getBestMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 9; i++) {
    if (!cells[i]) {
      cells[i] = "O";
      let score = minimax(cells, 0, false);
      cells[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(boardState, depth, isMaximizing) {
  if (checkWin("O", boardState)) return 10 - depth;
  if (checkWin("X", boardState)) return depth - 10;
  if (boardState.every(cell => cell !== null)) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!boardState[i]) {
        boardState[i] = "O";
        let score = minimax(boardState, depth + 1, false);
        boardState[i] = null;
        best = Math.max(best, score);
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!boardState[i]) {
        boardState[i] = "X";
        let score = minimax(boardState, depth + 1, true);
        boardState[i] = null;
        best = Math.min(best, score);
      }
    }
    return best;
  }
}

function checkWin(player, boardState = cells) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontal
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertical
    [0, 4, 8], [2, 4, 6],            // diagonal
  ];
  return winPatterns.some(pattern =>
    pattern.every(index => boardState[index] === player)
  );
}

function restartGame() {
  cells = Array(9).fill(null);
  currentPlayer = "X";
  gameOver = false;
  drawBoard();
}
