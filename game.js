// PLAYER POSITION
let position = 0;

// LUDO PATH (movement path)
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

// PLAYER POSITION
if (path[position] === i) {
  let player = document.createElement("div");
  player.className = "player";
  cell.appendChild(player);
}

board.appendChild(cell);

}
}

// DICE ROLL
function rollDice() {
let dice = Math.floor(Math.random() * 6) + 1;
document.getElementById("diceResult").innerText = "Dice: " + dice;

position += dice;

if (position >= path.length) {
alert("🏆 You Win!");
position = 0;
}

createBoard();
}

// INITIAL LOAD
createBoard();
