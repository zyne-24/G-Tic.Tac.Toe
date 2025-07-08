const board = document.getElementById("board");
const statusText = document.getElementById("status");

let currentPlayer = "X";
let cells = Array(9).fill(null);
let gameOver = false;

function drawBoard() {
  board.innerHTML = "";
  cells.forEach((cell, index) => {
    const cellDiv = document.createElement("div");
    cellDiv.classList.add("cell");
    cellDiv.textContent = cell;
    cellDiv.addEventListener("click", () => handleClick(index));
    board.appendChild(cellDiv);
  });
  statusText.textContent = `Giliran: ${currentPlayer}`;
}

function handleClick(index) {
  if (cells[index] || gameOver) return;

  cells[index] = currentPlayer;
  drawBoard();

  if (checkWin()) {
    statusText.textContent = `${currentPlayer} menang!`;
    gameOver = true;
  } else if (!cells.includes(null)) {
    statusText.textContent = "Seri!";
    gameOver = true;
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Giliran: ${currentPlayer}`;
  }
}

function checkWin() {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  return winPatterns.some(pattern => {
    const [a, b, c] = pattern;
    return cells[a] && cells[a] === cells[b] && cells[a] === cells[c];
  });
}

function restartGame() {
  currentPlayer = "X";
  cells = Array(9).fill(null);
  gameOver = false;
  drawBoard();
}

drawBoard();
