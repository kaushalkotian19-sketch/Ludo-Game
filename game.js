// PLAYER DATA
let players = [
{ pos: -1, color: "p1" }, // RED
{ pos: -1, color: "p2" }, // GREEN
{ pos: -1, color: "p3" }, // YELLOW
{ pos: -1, color: "p4" }  // BLUE
];

let currentPlayer = 0;

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

// SAFE ZONE
if (safeZones.includes(path.indexOf(i))) {
  cell.style.border = "3px solid gold";
}

// FINAL
if (path[finalIndex] === i) {
  cell.style.border = "3px solid white";
}

// ADD PLAYERS
players.forEach((p, index) => {
  if (p.pos !== -1 && path[p.pos] === i) {
    let token = document.createElement("div");
    token.className = "player " + p.color;
    cell.appendChild(token);
  }
});

board.appendChild(cell);

}

let names = ["🔴 P1", "🟢 P2", "🟡 P3", "🔵 P4"];
document.getElementById("turnText").innerText =
names[currentPlayer] + " Turn";
}

// DICE
function rollDice() {
let dice = Math.floor(Math.random() * 6) + 1;
document.getElementById("diceResult").innerText = "Dice: " + dice;

let player = players[currentPlayer];

// UNLOCK WITH 6
if (player.pos === -1) {
if (dice === 6) {
player.pos = 0;
} else {
nextTurn();
return;
}
} else {

// EXACT RULE
if (player.pos + dice > finalIndex) {
  nextTurn();
  return;
}

player.pos += dice;

// WIN
if (player.pos === finalIndex) {
  alert(`🏆 Player ${currentPlayer + 1} Wins!`);
  resetGame();
  return;
}

checkKill(currentPlayer);

}

// EXTRA TURN ON 6
if (dice !== 6) nextTurn();

createBoard();
}

// NEXT TURN
function nextTurn() {
currentPlayer = (currentPlayer + 1) % 4;
}

// KILL SYSTEM
function checkKill(playerIndex) {
players.forEach((p, i) => {
if (i !== playerIndex && p.pos !== -1) {

  if (p.pos === players[playerIndex].pos) {

    if (safeZones.includes(p.pos)) return;

    p.pos = -1;
    alert(`💥 Player ${playerIndex + 1} killed Player ${i + 1}!`);
  }
}

});
}

// RESET
function resetGame() {
players.forEach(p => p.pos = -1);
currentPlayer = 0;
createBoard();
}

// INIT
createBoard();
