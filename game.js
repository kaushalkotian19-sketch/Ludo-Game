// PLAYERS WITH 2 TOKENS EACH
let players = [
{ tokens: [-1, -1], color: "p1" },
{ tokens: [-1, -1], color: "p2" },
{ tokens: [-1, -1], color: "p3" },
{ tokens: [-1, -1], color: "p4" }
];

let currentPlayer = 0;
let selectedToken = 0; // which token to move

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
board.innerHTML = "";

for (let i = 0; i < 25; i++) {
let cell = document.createElement("div");
cell.className = "cell";

// COLORS
if (i < 5) cell.classList.add("red");
else if (i < 10) cell.classList.add("green");
else if (i < 15) cell.classList.add("yellow");
else if (i < 20) cell.classList.add("blue");
else cell.classList.add("white");

// SAFE
if (safeZones.includes(path.indexOf(i))) {
  cell.style.border = "3px solid gold";
}

// FINAL
if (path[finalIndex] === i) {
  cell.style.border = "3px solid white";
}

// ADD TOKENS
players.forEach((p, pi) => {
  p.tokens.forEach((pos, ti) => {
    if (pos !== -1 && path[pos] === i) {
      let token = document.createElement("div");
      token.className = "player " + p.color;

      // small offset for multiple tokens
      token.style.margin = "2px";

      cell.appendChild(token);
    }
  });
});

board.appendChild(cell);

}

let names = ["🔴 P1", "🟢 P2", "🟡 P3", "🔵 P4"];
document.getElementById("turnText").innerText =
names[currentPlayer] + " Turn | Token: " + (selectedToken + 1);
}

// SWITCH TOKEN
function switchToken() {
selectedToken = (selectedToken + 1) % 2;
createBoard();
}

// DICE
let diceBox = document.getElementById("diceBox");

// animation
diceBox.classList.add("roll");

setTimeout(() => {
let dice = Math.floor(Math.random() * 6) + 1;
diceBox.innerText = "Dice: " + dice;
diceBox.classList.remove("roll");

playTurn(dice);

}, 300);

// UNLOCK
if (pos === -1) {
if (dice === 6) {
player.tokens[selectedToken] = 0;
} else {
nextTurn();
return;
}
} else {

if (pos + dice > finalIndex) {
  nextTurn();
  return;
}

player.tokens[selectedToken] += dice;

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
      alert(`💥 Player ${playerIndex + 1} killed Player ${i + 1}!`);
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

// INIT
createBoard();

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

player.tokens[selectedToken] += dice;

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
