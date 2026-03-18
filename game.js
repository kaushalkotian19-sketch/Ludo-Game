let position = 0;

function createBoard() {
let board = document.getElementById("board");
board.innerHTML = "";

for (let i = 0; i < 25; i++) {
let cell = document.createElement("div");
cell.className = "cell";

if (i === position) {
  let player = document.createElement("div");
  player.className = "player";
  cell.appendChild(player);
}

board.appendChild(cell);

}
}

function rollDice() {
let dice = Math.floor(Math.random() * 6) + 1;
document.getElementById("diceResult").innerText = "Dice: " + dice;

position += dice;

if (position >= 24) {
alert("🏆 You Win!");
position = 0;
}

createBoard();
}

createBoard();
