// PLAYERS
let players = [
  { tokens: [-1, -1], color: "p1" },
  { tokens: [-1, -1], color: "p2" },
  { tokens: [-1, -1], color: "p3" },
  { tokens: [-1, -1], color: "p4" }
];

let currentPlayer = 0;
let selectedToken = 0;

// SIMPLE PATH
const path = [
  91,92,93,94,95,80,65,50,35,20,5,6,7,
  8,9,24,39,54,69,84,99,98,97,96,95,110,
  125,140,155,170,185,200,199,198,197,196,
  181,166,151,136,121,106,107,108,109,110,
  111,112,127,142,157,172
];
const finalIndex = path.length - 1;

// CREATE BOARD
function createBoard() {
  let board = document.getElementById("board");
  board.innerHTML = "";

  for (let i = 0; i < 225; i++) {
    let cell = document.createElement("div");
    cell.className = "cell";

    let row = Math.floor(i / 15);
    let col = i % 15;

    // CROSS PATH
    // DEFAULT HIDDEN
cell.style.visibility = "hidden";

// HOME AREAS
// RED HOME (INNER 4x4)
if (row >= 1 && row <= 4 && col >= 1 && col <= 4) {
  cell.style.visibility = "visible";
  cell.classList.add("home-red");
}

// GREEN HOME
else if (row >= 1 && row <= 4 && col >= 10 && col <= 13) {
  cell.style.visibility = "visible";
  cell.classList.add("home-green");
}

// YELLOW HOME
else if (row >= 10 && row <= 13 && col >= 10 && col <= 13) {
  cell.style.visibility = "visible";
  cell.classList.add("home-yellow");
}

// BLUE HOME
else if (row >= 10 && row <= 13 && col >= 1 && col <= 4) {
  cell.style.visibility = "visible";
  cell.classList.add("home-blue");
}

// CROSS PATH (WHITE)
else if ((col >= 6 && col <= 8) || (row >= 6 && row <= 8)) {
  cell.style.visibility = "visible";
  cell.classList.add("white");
}

// ENTRY PATH (PERFECT POSITIONS)

// RED (top → center) → stop at row 5
if (col === 7 && row >= 1 && row <= 5) {
  cell.style.background = "#ef4444";
}

// GREEN (right → center) → stop at col 13
if (row === 7 && col >= 9 && col <= 13) {
  cell.style.background = "#22c55e";
}

// YELLOW (bottom → center) → stop at row 13
if (col === 7 && row >= 9 && row <= 13) {
  cell.style.background = "#eab308";
}

// BLUE (left → center) → stop at col 5
if (row === 7 && col >= 1 && col <= 5) {
  cell.style.background = "#3b82f6";
}
// CENTER
if (row >= 6 && row <= 8 && col >= 6 && col <= 8) {
  cell.classList.add("center");
}

// NEVER override center
if (row >= 6 && row <= 8 && col >= 6 && col <= 8) {
  cell.classList.add("center");
  cell.style.background = "";
}    
    
    // TOKENS
    players.forEach((p) => {
      p.tokens.forEach((pos) => {
        if (pos !== -1 && pos === i) {
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

  // ENTER GAME only on 6
  if (pos === -1 && dice === 6) {
    player.tokens[selectedToken] = 0;
  }
  // MOVE token
  else if (pos !== -1) {
    let newPos = pos + dice;

    if (newPos < path.length) {
      player.tokens[selectedToken] = newPos;
    }
  }

  createBoard();

  // SWITCH TURN (only if not 6)
  if (dice !== 6) {
    currentPlayer = (currentPlayer + 1) % players.length;
  }

  updateTurnText();
}

// NEXT TURN
function nextTurn() {
  currentPlayer = (currentPlayer + 1) % 4;
  selectedToken = 0;
}

// START
createBoard();
