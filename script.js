// Ambil elemen
const board = document.getElementById("board");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restartBtn");

const menuDiv = document.getElementById("menu");
const modeSelectDiv = document.getElementById("modeSelect");

const btn1P = document.getElementById("btn1P");
const btn2P = document.getElementById("btn2P");
const btnNormal = document.getElementById("btnNormal");
const btnEasy = document.getElementById("btnEasy");
const btnBack = document.getElementById("btnBack");

let cells = Array(9).fill(null);
let currentPlayer = null;
let gameOver = false;
let mode = null;
let aiPlayer = null;
let humanPlayer = null;

// Event listeners menu
btn1P.addEventListener("click", () => {
  menuDiv.style.display = "none";
  modeSelectDiv.style.display = "block";
});

btn2P.addEventListener("click", () => {
  startGame("2P");
});

btnNormal.addEventListener("click", () => {
  startGame("1P-normal");
});

btnEasy.addEventListener("click", () => {
  startGame("1P-easy");
});

btnBack.addEventListener("click", () => {
  modeSelectDiv.style.display = "none";
  menuDiv.style.display = "block";
});

restartBtn.addEventListener("click", () => {
  restartGame();
});

function startGame(selectedMode) {
  mode = selectedMode;
  cells = Array(9).fill(null);
  gameOver = false;
  board.style.display = "grid";
  restartBtn.style.display = "inline-block";
  statusText.textContent = "";

  menuDiv.style.display = "none";
  modeSelectDiv.style.display = "none";

  // Tentukan giliran pertama acak
  currentPlayer = Math.random() < 0.5 ? "X" : "O";

  if (mode.startsWith("1P")) {
    humanPlayer = "X"; // Kita set selalu human "X"
    aiPlayer = "O";    // AI selalu "O"
    currentPlayer = Math.random() < 0.5 ? humanPlayer : aiPlayer;
  } else {
    humanPlayer = null;
    aiPlayer = null;
  }

  drawBoard();
  updateStatus();

  // Kalau AI yang mulai dulu, langsung gerak
  if (mode.startsWith("1P") && currentPlayer === aiPlayer) {
    setTimeout(aiMove, 500);
  }
}

function drawBoard() {
  board.innerHTML = "";
  cells.forEach((cell, index) => {
    const cellDiv = document.createElement("div");
    cellDiv.classList.add("cell");
    cellDiv.textContent = cell ? cell : "";
    if (cell === "X") cellDiv.classList.add("player-x");
    if (cell === "O") cellDiv.classList.add("player-o");

    cellDiv.addEventListener("click", () => handleClick(index));
    board.appendChild(cellDiv);
  });
}

function handleClick(index) {
  if (cells[index] || gameOver) return;

  // Kalau 1P dan giliran AI, jangan bisa klik
  if (mode.startsWith("1P") && currentPlayer === aiPlayer) return;

  // Isi cell dengan player sekarang
  cells[index] = currentPlayer;
  drawBoard();

  if (checkWin(currentPlayer)) {
    statusText.textContent = (mode.startsWith("1P") && currentPlayer === aiPlayer) 
      ? "Komputer menang!" 
      : `${currentPlayer} menang!`;
    gameOver = true;
    return;
  }

  if (cells.every(cell => cell !== null)) {
    statusText.textContent = "Seri!";
    gameOver = true;
    return;
  }

  // Ganti giliran
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateStatus();

  // Kalau 1P dan giliran AI, jalankan AI move
  if (mode.startsWith("1P") && currentPlayer === aiPlayer && !gameOver) {
    setTimeout(aiMove, 500);
  }
}

function updateStatus() {
  if (gameOver) return;

  if (mode === "2P") {
    statusText.textContent = `Giliran: ${currentPlayer}`;
  } else if (mode.startsWith("1P")) {
    if (currentPlayer === humanPlayer) {
      statusText.textContent = "Giliran Anda";
    } else {
      statusText.textContent = "Giliran Komputer";
    }
  }
}

function aiMove() {
  if (gameOver) return;

  let move;
  if (mode === "1P-easy") {
    move = getRandomMove();
  } else {
    move = getBestMove();
  }

  cells[move] = aiPlayer;
  drawBoard();

  if (checkWin(aiPlayer)) {
    statusText.textContent = "Komputer menang!";
    gameOver = true;
    return;
  }

  if (cells.every(cell => cell !== null)) {
    statusText.textContent = "Seri!";
    gameOver = true;
    return;
  }

  currentPlayer = humanPlayer;
  updateStatus();
}

function getRandomMove() {
  const available = [];
  cells.forEach((cell, i) => {
    if (!cell) available.push(i);
  });
  return available[Math.floor(Math.random() * available.length)];
}

function getBestMove() {
  let bestScore = -Infinity;
  let move = -1;
  for (let i = 0; i < 9; i++) {
    if (!cells[i]) {
      cells[i] = aiPlayer;
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
  if (checkWin(aiPlayer, boardState)) return 10 - depth;
  if (checkWin(humanPlayer, boardState)) return depth - 10;
  if (boardState.every(cell => cell !== null)) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!boardState[i]) {
        boardState[i] = aiPlayer;
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
        boardState[i] = humanPlayer;
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
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return winPatterns.some(pattern =>
    pattern.every(i => boardState[i] === player)
  );
}

function restartGame() {
  cells = Array(9).fill(null);
  currentPlayer = null;
  gameOver = false;
  mode = null;
  humanPlayer = null;
  aiPlayer = null;
  board.style.display = "none";
  restartBtn.style.display = "none";
  statusText.textContent = "";
  menuDiv.style.display = "block";
}
