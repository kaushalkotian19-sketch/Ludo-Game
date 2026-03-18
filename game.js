// PLAYER POSITIONS
let player1Pos = 0;
let player2Pos = 0;

// TURN SYSTEM (1 or 2)
let currentPlayer = 1;

// PATH
const path = [
0,1,2,3,4,
9,14,19,24,
23,22,21,20,
15,10,5
];

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

// PLAYER 1 (RED)
if (path[player1Pos] === i) {
  let p1 = document.createElement("div");
  p1.className = "player p1";
  cell.appendChild(p1);
}

// PLAYER 2 (BLUE)
if (path[player2Pos] === i) {
  let p2 = document.createElement("div");
  p2.className = "player p2";
  cell.appendChild(p2);
}

board.appendChild(cell);

}

// SHOW TURN
document.getElementById("turnText").innerText =
currentPlayer === 1 ? "🔴 Player 1 Turn" : "🔵 Player 2 Turn";
}

// DICE ROLL
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

currentPlayer = 2;

} else {
player2Pos += dice;

if (player2Pos >= path.length) {
  alert("🏆 Player 2 Wins!");
  resetGame();
  return;
}

currentPlayer = 1;

}

createBoard();
}

// RESET GAME
function resetGame() {
player1Pos = 0;
player2Pos = 0;
currentPlayer = 1;
createBoard();
}

// INITIAL LOAD
createBoard();
