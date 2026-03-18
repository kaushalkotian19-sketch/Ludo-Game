function createBoard() {
let board = document.getElementById("board");
board.innerHTML = "";

for (let i = 0; i < 25; i++) {
let cell = document.createElement("div");
cell.className = "cell";

// COLOR PATTERN
if (i < 5) cell.classList.add("red");
else if (i < 10) cell.classList.add("green");
else if (i < 15) cell.classList.add("yellow");
else if (i < 20) cell.classList.add("blue");
else cell.classList.add("white");

if (i === position) {
  let player = document.createElement("div");
  player.className = "player";
  cell.appendChild(player);
}

board.appendChild(cell);

}
}
