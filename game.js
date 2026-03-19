// PLAYERS
let players = [
  { tokens: [-1, -1], color: "p1" },
  { tokens: [-1, -1], color: "p2" },
  { tokens: [-1, -1], color: "p3" },
  { tokens: [-1, -1], color: "p4" }
];

let currentPlayer = 0;
let selectedToken = 0;

// FIXED PATH (WORKING)
const path = [
  6,7,8,23,38,53,68,83,98,113,128,129,130,
  131,132,117,102,87,72,57,42,27,12,13,14,
  29,44,59,74,89,104,105,106,107,108,123,
  138,153,168,183,198,213,212,211,210,209,
  194,179,164,149,134
];

// CREATE BOARD
function createBoard() {
  let board = document.getElementById("board");
  board.innerHTML = "";

  for (let i = 0; i < 225; i++) {
    let cell = document.createElement("div");
    cell.className = "cell";

    let row = Math.floor(i / 15);
    let col = i % 15;

    cell.style.visibility = "hidden";

    // HOMES
    if (row >= 1 && row <= 4 && col >= 1 && col <= 4) {
      cell.style.visibility = "visible";
      cell.classList.add("home-red");
    }
    else if (row >= 1 && row <= 4 && col >= 10 && col <= 13) {
      cell.style.visibility = "visible";
      cell.classList.add("home-green");
    }
    else if (row >= 10 && row <= 13 && col >= 10 && col <= 13) {
      cell.style.visibility = "visible";
      cell.classList.add("home-yellow");
    }
    else if (row >= 10 && row <= 13 && col >= 1 && col <= 4) {
      cell.style.visibility = "visible";
      cell.classList.add("home-blue");
    }

    // PATH
    else if ((col >= 6 && col <= 8) || (row >= 6 && row <= 8)) {
      cell.style.visibility = "visible";
      cell.classList.add("white");
    }

    // ENTRY COLORS
    if (col === 7 && row >= 1 && row <= 5) cell.style.background = "#ef4444";
    if (row === 7 && col >= 9 && col <= 13) cell.style.background = "#22c55e";
    if (col === 7 && row >= 9 && row <= 13) cell.style.background = "#eab308";
    if (row === 7 && col >= 1 && col <= 5) cell.style.background = "#3b82f6";

    // CENTER
    if (row >= 6 && row <= 8 && col >= 6 && col <= 8) {
      cell.classList.add("center");
      cell.style.background = "";
    }

    // TOKENS
    players.forEach((p) => {
      p.tokens.forEach((pos) => {
        if (pos !== -1 && path[pos] === i) {
          let token = document.createElement("div");
          token.className = "player " + p.color;
          cell.appendChild(token);
        }
      });
    });

    board.appendChild(cell);
  }

  updateTurnText();
}

// TURN TEXT
function updateTurnText() {
  let names = ["🔴 P1", "🟢 P2", "🟡 P3", "🔵 P4"];
  document.getElementById("turnText").innerText =
    names[currentPlayer] + " | Token: " + (selectedToken + 1);
}

// SWITCH TOKEN
function switchToken() {
  selectedToken = (selectedToken + 1) % 2;
  createBoard();
}

// DICE
function rollDice() {
  let dice = Math.floor(Math.random() * 6) + 1;
  document.getElementById("dice").innerText = "Dice: " + dice;

  let player = players[currentPlayer];
  let pos = player.tokens[selectedToken];

  if (pos === -1 && dice === 6) {
    player.tokens[selectedToken] = 0;
  }
  else if (pos !== -1) {
    let newPos = pos + dice;
    if (newPos < path.length) {
      player.tokens[selectedToken] = newPos;
    }
  }

  createBoard();

  if (dice !== 6) {
    currentPlayer = (currentPlayer + 1) % 4;
  }

  updateTurnText();
}

// START
window.onload = () => {
  createBoard();
};
