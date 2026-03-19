// PLAYERS
let players = [
{ tokens: [-1, -1], color: "p1" },
{ tokens: [-1, -1], color: "p2" },
{ tokens: [-1, -1], color: "p3" },
{ tokens: [-1, -1], color: "p4" }
];

let currentPlayer = 0;
let selectedToken = 0;

// PATH
const path = [
0,1,2,3,4,
9,14,19,24,
23,22,21,20,
15,10,5
];

const safeZones = [0, 8, 13];
const finalIndex = path.length - 1;

// CREATE BOARD
function createBoard() {
  let board = document.getElementById("board");
  if (!board) return;

  board.innerHTML = "";

  // 15x15 grid
  for (let i = 0; i < 225; i++) {
    let cell = document.createElement("div");
    cell.className = "cell";

    let row = Math.floor(i / 15);
    let col = i % 15;

    // CROSS SHAPE (real Ludo style)
    if (
      (col >= 6 && col <= 8) || 
      (row >= 6 && row <= 8)
    ) {
      cell.classList.add("white");
    } else {
      cell.style.visibility = "hidden"; // hide corners
    }

    // SAFE ZONES (example positions)
    if (i === 112 || i === 97 || i === 127) {
      cell.style.background = "#aaa";
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
  updateTurnText();
  }
        }

function updateTurnText() {
  let names = ["🔴 P1", "🟢 P2", "🟡 P3", "🔵 P4"];
  let el = document.getElementById("turnText");
  if (el) {
    el.innerText = names[currentPlayer] + " | Token: " + (selectedToken + 1);
  }
            }

// SWITCH TOKEN
function switchToken() {
selectedToken = (selectedToken + 1) % 2;
createBoard();
}

// DICE
function rollDice() {
let diceBox = document.getElementById("diceBox");

diceBox.classList.add("roll");

setTimeout(() => {
let dice = Math.floor(Math.random() * 6) + 1;
diceBox.innerText = "Dice: " + dice;
diceBox.classList.remove("roll");

playTurn(dice);

}, 300);
}

function moveTokenSmooth(player, tokenIndex, steps, callback) {
let moveCount = 0;

function stepMove() {
if (moveCount >= steps) {
callback();
return;
}

player.tokens[tokenIndex]++;
moveCount++;

createBoard();

setTimeout(stepMove, 250); // speed (lower = faster)

}

stepMove();
}

// GAME LOGIC
function playTurn(dice) {
let player = players[currentPlayer];
let pos = player.tokens[selectedToken];

if (pos === -1) {
if (dice === 6) {
player.tokens[selectedToken] = 0;
} else {
nextTurn();
createBoard();
return;
}
} else {
if (pos + dice > finalIndex) {
nextTurn();
createBoard();
return;
}

moveTokenSmooth(player, selectedToken, dice, () => {

if (player.tokens[selectedToken] === finalIndex) {
alert("🏆 Player ${currentPlayer + 1} Wins!");
resetGame();
return;
}

checkKill(currentPlayer);

if (dice !== 6) nextTurn();

createBoard();
});
return;

if (player.tokens[selectedToken] === finalIndex) {
  alert(`🏆 Player ${currentPlayer + 1} Wins!`);
  resetGame();
  return;
}

checkKill(currentPlayer);

}

if (dice !== 6) nextTurn();

createBoard();
}

// NEXT TURN
function nextTurn() {
currentPlayer = (currentPlayer + 1) % 4;
selectedToken = 0;
}

// KILL
function checkKill(playerIndex) {
players.forEach((p, i) => {
if (i !== playerIndex) {
p.tokens.forEach((pos, ti) => {
let myPos = players[playerIndex].tokens[selectedToken];

    if (pos !== -1 && pos === myPos) {
      if (safeZones.includes(pos)) return;

      p.tokens[ti] = -1;
      alert(`💥 Player ${playerIndex + 1} killed Player ${i + 1}`);
    }
  });
}

});
}

// RESET
function resetGame() {
players.forEach(p => p.tokens = [-1, -1]);
currentPlayer = 0;
selectedToken = 0;
createBoard();
}

// START
createBoard();
