const ludo = document.getElementById("board");
const diceText = document.getElementById("dice");
const playerText = document.getElementById("current-p");

let currentPlayer = "P1";
let positions = { P1: -1, P2: -1 };

// The 52-step shared circuit [col, row]
const path = [
  [1,6],[2,6],[3,6],[4,6],[5,6],         // Blue Entrance
  [6,5],[6,4],[6,3],[6,2],[6,1],[6,0],   // Up
  [7,0],[8,0],                           // Top Turn
  [8,1],[8,2],[8,3],[8,4],[8,5],         // Down
  [9,6],[10,6],[11,6],[12,6],[13,6],[14,6], // Right
  [14,7],[14,8],                         // Right Turn
  [13,8],[12,8],[11,8],[10,8],[9,8],     // Left
  [8,9],[8,10],[8,11],[8,12],[8,13],[8,14], // Down
  [7,14],[6,14],                         // Bottom Turn
  [6,13],[6,12],[6,11],[6,10],[6,9],     // Up
  [5,8],[4,8],[3,8],[2,8],[1,8],[0,8],   // Left
  [0,7],[0,6]                            // Return
];

// Center coordinates for the starting yards
const yards = {
  P1: [2.5, 2.5], // Blue yard center
  P2: [11.5, 11.5] // Green yard center
};

const tokens = {
  P1: createToken("P1"),
  P2: createToken("P2")
};

function createToken(player) {
  const piece = document.createElement("div");
  piece.className = "player-piece";
  piece.setAttribute("player-id", player);
  ludo.appendChild(piece);
  return piece;
}

function updateVisuals(player) {
  const pos = positions[player];
  const coords = pos === -1 ? yards[player] : path[pos];
  
  // Apply grid formula
  tokens[player].style.left = `${(coords[0] + 0.5) * (100 / 15)}%`;
  tokens[player].style.top = `${(coords[1] + 0.5) * (100 / 15)}%`;
}

function rollDice() {
  const dice = Math.floor(Math.random() * 6) + 1;
  const icons = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
  diceText.innerText = "Dice: " + icons[dice - 1];

  let pos = positions[currentPlayer];

  if (pos === -1) {
    if (dice === 6) {
      positions[currentPlayer] = 0;
    } else {
      switchPlayer();
      return;
    }
  } else {
    const newPos = pos + dice;
    if (newPos >= path.length) {
      alert(currentPlayer + " Wins!");
      resetGame();
      return;
    }
    positions[currentPlayer] = newPos;
  }

  updateVisuals(currentPlayer);
  checkCollision();
  
  // Player gets another turn if they roll a 6
  if (dice !== 6) {
    switchPlayer();
  }
}

function checkCollision() {
  if (positions.P1 !== -1 && positions.P1 === positions.P2) {
    const victim = currentPlayer === "P1" ? "P2" : "P1";
    positions[victim] = -1;
    updateVisuals(victim);
    console.log(victim + " was captured and sent home!");
  }
}

function switchPlayer() {
  currentPlayer = currentPlayer === "P1" ? "P2" : "P1";
  playerText.innerText = currentPlayer === "P1" ? "P1 (Blue)" : "P2 (Green)";
}

function resetGame() {
  positions = { P1: -1, P2: -1 };
  currentPlayer = "P1";
  updateVisuals("P1");
  updateVisuals("P2");
  playerText.innerText = "P1 (Blue)";
  diceText.innerText = "Dice: ⚀";
}

// Bind Events
document.getElementById("roll").onclick = rollDice;
document.getElementById("reset").onclick = resetGame;

// Initial placement execution
updateVisuals("P1");
updateVisuals("P2");
