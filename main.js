const ludo = document.querySelector(".ludo");
const diceText = document.querySelector("#dice");
const playerText = document.querySelector("#player");

let currentPlayer = "P1";
let positions = {
  P1: -1,
  P2: -1
};

let path = [
  {x:50, y:350}, {x:100, y:350}, {x:150, y:350}, {x:200, y:350},
  {x:250, y:350}, {x:300, y:350}, {x:350, y:350},

  {x:350, y:300}, {x:350, y:250}, {x:350, y:200},
  {x:350, y:150}, {x:350, y:100}, {x:350, y:50},

  {x:300, y:50}, {x:250, y:50}, {x:200, y:50},
  {x:150, y:50}, {x:100, y:50}, {x:50, y:50},

  {x:50, y:100}, {x:50, y:150}, {x:50, y:200},
  {x:50, y:250}, {x:50, y:300}
];

let tokens = {
  P1: createToken("P1"),
  P2: createToken("P2")
};

function createToken(player) {
  const piece = document.createElement("div");
  piece.classList.add("player-piece");
  piece.setAttribute("player-id", player);

  piece.style.display = "none";
  ludo.appendChild(piece);

  return piece;
}

function rollDice() {
  let dice = Math.floor(Math.random() * 6) + 1;
  diceText.innerText = "Dice: " + dice;

  moveToken(currentPlayer, dice);
}

function moveToken(player, dice) {
  let pos = positions[player];

  // NEED 6 TO START
  if (pos === -1) {
    if (dice === 6) {
      positions[player] = 0;
      tokens[player].style.display = "block";
      updatePosition(player);
    } else {
      switchPlayer();
    }
    return;
  }

  let newPos = pos + dice;

  if (newPos >= path.length) {
    switchPlayer();
    return;
  }

  positions[player] = newPos;
  updatePosition(player);

  if (dice !== 6) {
    switchPlayer();
  }
}

function updatePosition(player) {
  let pos = positions[player];
  let cell = path[pos];

  tokens[player].style.left = cell.x + "px";
  tokens[player].style.top = cell.y + "px";
}

function switchPlayer() {
  currentPlayer = currentPlayer === "P1" ? "P2" : "P1";
  playerText.innerText = "Player: " + currentPlayer;
}

// BUTTON EVENTS
document.querySelector("#roll").onclick = rollDice;

document.querySelector("#reset").onclick = () => {
  positions = { P1: -1, P2: -1 };

  tokens.P1.style.display = "none";
  tokens.P2.style.display = "none";

  currentPlayer = "P1";
  playerText.innerText = "Player: P1";
  diceText.innerText = "Dice: -";
};
