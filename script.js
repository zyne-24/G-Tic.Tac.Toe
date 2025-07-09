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

let cells;
let currentPlayer;
let gameOver;
let mode;
let humanPlayer;
let aiPlayer;

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

  menuDiv.style.display = "none";
  modeSelectDiv.style.display = "none";

  if (mode.startsWith("1P")) {
    humanPlayer = "X";
    aiPlayer = "O";
    currentPlayer = Math.random() < 0.5 ? humanPlayer : aiPlayer;
  } else {
    humanPlayer = null;
    aiPlayer = null;
    currentPlayer = "X"; // default 2P mulai X
  }

  drawBoard();
  updateStatus();

  if (mode.startsWith("1P") && currentPlayer === aiPlayer) {
    setTimeout(aiMove, 500);
  }
}

function drawBoard() {
  board.innerHTML = "";
  cells.forEach((cell, idx) => {
    const cellDiv = document.createElement("div");
    cellDiv.classList.add("cell");
    if (cell === "X") cellDiv.classList.add("player-x");
    if (cell === "O") cellDiv.classList.add("player-o");
    cellDiv.textContent = cell ? cell : "";
    cellDiv.addEventListener("click", () => handleClick(idx));
    board.appendChild(cellDiv);
  });
}

function handleClick(idx) {
  if (gameOver) return;
  if (cells[idx]) return;
  if (mode.startsWith("1P") && currentPlayer === aiPlayer) return;

  cells[idx] = currentPlayer;
  drawBoard();

  if (checkWin(currentPlayer)) {
    statusText.textContent = mode.startsWith("1P") && currentPlayer === aiPlayer
      ? "Komputer menang!"
      : `${currentPlayer} menang!`;
    gameOver = true;
    return;
  }

  if (cells.every(c => c !== null)) {
    statusText.textContent = "Seri!";
    gameOver = true;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateStatus();

  if (mode.startsWith("1P") && currentPlayer === aiPlayer) {
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

  if (cells.every(c => c !== null)) {
    statusText.textContent = "Seri!";
    gameOver = true;
    return;
  }

  currentPlayer = humanPlayer;
  updateStatus();
}

function getRandomMove() {
  const emptyIndices = [];
  cells.forEach((c, i) => {
    if (!c) emptyIndices.push(i);
  });
  return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
}

function getBestMove() {
  let bestScore = -Infinity;
  let bestMove = -1;

  for (let i = 0; i < 9; i++) {
    if (!cells[i]) {
      cells[i] = aiPlayer;
      let score = minimax(cells, 0, false);
      cells[i] = null;
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  return bestMove;
}

function minimax(boardState, depth, isMaximizing) {
  if (checkWin(aiPlayer, boardState)) return 10 - depth;
  if (checkWin(humanPlayer, boardState)) return depth - 10;
  if (boardState.every(c => c !== null)) return 0;

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!boardState[i]) {
        boardState[i] = aiPlayer;
        let evalScore = minimax(boardState, depth + 1, false);
        boardState[i] = null;
        maxEval = Math.max(maxEval, evalScore);
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!boardState[i]) {
        boardState[i] = humanPlayer;
        let evalScore = minimax(boardState, depth + 1, true);
        boardState[i] = null;
        minEval = Math.min(minEval, evalScore);
      }
    }
    return minEval;
  }
}

function checkWin(player, boardState = cells) {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return wins.some(pattern => pattern.every(i => boardState[i] === player));
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
