// PLAYER POSITIONS
let player1Pos = 0;
let player2Pos = 0;

// TURN
let currentPlayer = 1;

// PATH
const path = [
0,1,2,3,4,
9,14,19,24,
23,22,21,20,
15,10,5
];

// SAFE ZONES
const safeZones = [0, 8, 13];

// FINAL POSITION
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

// SAFE ZONE MARK
if (safeZones.includes(path.indexOf(i))) {
  cell.style.border = "3px solid gold";
}

// FINAL HOME MARK
if (path[finalIndex] === i) {
  cell.style.border = "3px solid white";
}

// PLAYER 1
if (path[player1Pos] === i) {
  let p1 = document.createElement("div");
  p1.className = "player p1";
  cell.appendChild(p1);
}

// PLAYER 2
if (path[player2Pos] === i) {
  let p2 = document.createElement("div");
  p2.className = "player p2";
  cell.appendChild(p2);
}

board.appendChild(cell);

}

document.getElementById("turnText").innerText =
currentPlayer === 1 ? "🔴 Player 1 Turn" : "🔵 Player 2 Turn";
}

// DICE
function rollDice() {
let dice = Math.floor(Math.random() * 6) + 1;
document.getElementById("diceResult").innerText = "Dice: " + dice;

if (currentPlayer === 1) {

// EXACT RULE CHECK
if (player1Pos + dice > finalIndex) {
  alert("❌ Need exact number to finish!");
  currentPlayer = 2;
  createBoard();
  return;
}

player1Pos += dice;

if (player1Pos === finalIndex) {
  alert("🏆 Player 1 Wins!");
  resetGame();
  return;
}

checkKill(1);
currentPlayer = 2;

} else {

if (player2Pos + dice > finalIndex) {
  alert("❌ Need exact number to finish!");
  currentPlayer = 1;
  createBoard();
  return;
}

player2Pos += dice;

if (player2Pos === finalIndex) {
  alert("🏆 Player 2 Wins!");
  resetGame();
  return;
}

checkKill(2);
currentPlayer = 1;

}

createBoard();
}

// KILL SYSTEM
function checkKill(player) {
if (player1Pos === player2Pos) {

if (safeZones.includes(player1Pos)) return;

if (player === 1) {
  player2Pos = 0;
  alert("💥 Player 1 killed Player 2!");
} else {
  player1Pos = 0;
  alert("💥 Player 2 killed Player 1!");
}

}
}

// RESET
function resetGame() {
player1Pos = 0;
player2Pos = 0;
currentPlayer = 1;
createBoard();
}

// INIT
createBoard();
