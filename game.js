// PLAYERS
let players = [
  { tokens: [-1, -1], color: "p1" },
  { tokens: [-1, -1], color: "p2" },
  { tokens: [-1, -1], color: "p3" },
  { tokens: [-1, -1], color: "p4" }
];

let currentPlayer = 0;
let selectedToken = 0;

// AUTO PATH
let path = [];

// CREATE BOARD
function createBoard() {
  let board = document.getElementById("board");
  board.innerHTML = "";

  path = []; // reset path every time

  for (let i = 0; i < 225; i++) {
    let cell = document.createElement("div");
    cell.className = "cell";

    let row = Math.floor(i / 15);
    let col = i % 15;

    // DEFAULT HIDDEN
    cell.style.visibility = "hidden";

    // HOME AREAS
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

    // CROSS PATH (AUTO PATH BUILD)
    else if ((col >= 6 && col <= 8) || (row >= 6 && row <= 8)) {
      cell.style.visibility = "visible";
      cell.classList.add("white");

      // 🔥 IMPORTANT: build path automatically
      path.push(i);
    }

    // ENTRY COLORS
    if (col === 7 && row >= 1 && row <= 5) {
      cell.style.background = "#ef4444";
    }

    if (row === 7 && col >= 9 && col <= 13) {
      cell.style.background = "#22c55e";
    }

    if (col === 7 && row >= 9 && row <= 13) {
      cell.style.background = "#eab308";
    }

    if (row === 7 && col >= 1 && col <= 5) {
      cell.style.background = "#3b82f6";
    }

    // CENTER FIX
    if (row >= 6 && row <= 8 && col >= 6 && col <= 8) {
      cell.classList.add("center");
      cell.style.background = "";
    }

    // TOKENS (FIXED)
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

// DICE + MOVEMENT
function rollDice() {
  let dice = Math.floor(Math.random() * 6) + 1;
  document.getElementById("dice").innerText = "Dice: " + dice;

  let player = players[currentPlayer];
  let pos = player.tokens[selectedToken];

  // ENTER GAME only on 6
  if (pos === -1 && dice === 6) {
    player.tokens[selectedToken] = 0;
  }
  // MOVE
  else if (pos !== -1) {
    let newPos = pos + dice;

    if (newPos < path.length) {
      player.tokens[selectedToken] = newPos;
    }
  }

  createBoard();

  // SWITCH TURN
  if (dice !== 6) {
    currentPlayer = (currentPlayer + 1) % players.length;
  }

  updateTurnText();
}

// START
createBoard();
