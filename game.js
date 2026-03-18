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

// SAFE ZONES (indexes of path)
const safeZones = [0, 8, 13]; // start + 2 points

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

// MARK SAFE ZONE
if (safeZones.includes(path.indexOf(i))) {
  cell.style.border = "3px solid gold";
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
player1Pos += dice;

if (player1Pos >= path.length) {
  alert("🏆 Player 1 Wins!");
  resetGame();
  return;
}

checkKill(1);
currentPlayer = 2;

} else {
player2Pos += dice;

if (player2Pos >= path.length) {
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
let p1Index = player1Pos;
let p2Index = player2Pos;

// SAME POSITION
if (p1Index === p2Index) {

// CHECK SAFE ZONE
if (safeZones.includes(p1Index)) return;

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
