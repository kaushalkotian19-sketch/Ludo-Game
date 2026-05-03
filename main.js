const ludo = document.getElementById("board");
const diceText = document.getElementById("dice");
const playerText = document.getElementById("current-p");

let currentPlayer = "P1";
let positions = { P1: [-1, -1, -1, -1], P2: [-1, -1, -1, -1] };
let lastRoll = 0;
let canMove = false;

// 52-step common circular path
const commonPath = [
  [1,6],[2,6],[3,6],[4,6],[5,6],[6,5],[6,4],[6,3],[6,2],[6,1],[6,0],
  [7,0],[8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[9,6],[10,6],[11,6],
  [12,6],[13,6],[14,6],[14,7],[14,8],[13,8],[12,8],[11,8],[10,8],
  [9,8],[8,9],[8,10],[8,11],[8,12],[8,13],[8,14],[7,14],[6,14],
  [6,13],[6,12],[6,11],[6,10],[6,9],[5,8],[4,8],[3,8],[2,8],[1,8],[0,8],[0,7],[0,6]
];

// Private Home Lanes (6 steps each)
const homePaths = {
  P1: [[1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7]], // Blue
  P2: [[13, 7], [12, 7], [11, 7], [10, 7], [9, 7], [8, 7]] // Green
};

const safetyZones = [0, 8, 13, 21, 26, 34, 39, 47];
const yards = {
  P1: [[1.5, 1.5], [3.5, 1.5], [1.5, 3.5], [3.5, 3.5]], 
  P2: [[10.5, 10.5], [12.5, 10.5], [10.5, 12.5], [12.5, 12.5]]
};

const tokens = { P1: [], P2: [] };

function init() {
  ["P1", "P2"].forEach(p => {
    for (let i = 0; i < 4; i++) {
      const el = document.createElement("div");
      el.className = "player-piece";
      el.setAttribute("player-id", p);
      el.onclick = () => handleMove(p, i);
      ludo.appendChild(el);
      tokens[p].push(el);
      render(p, i);
    }
  });
}

function render(p, i) {
  const step = positions[p][i];
  let coords;
  if (step === -1) coords = yards[p][i];
  else if (step <= 51) coords = commonPath[step];
  else coords = homePaths[p][step - 52];

  tokens[p][i].style.left = `${(coords[0] + 0.5) * (100 / 15)}%`;
  tokens[p][i].style.top = `${(coords[1] + 0.5) * (100 / 15)}%`;
  tokens[p][i].classList.remove("highlight");
}

function rollDice() {
  if (canMove) return;
  lastRoll = Math.floor(Math.random() * 6) + 1;
  diceText.innerText = "Dice: " + ["⚀","⚁","⚂","⚃","⚄","⚅"][lastRoll-1];
  
  if (!positions[currentPlayer].some((_, i) => canPieceMove(i))) {
    setTimeout(nextTurn, 1000);
  } else {
    canMove = true;
    positions[currentPlayer].forEach((_, i) => {
      if (canPieceMove(i)) tokens[currentPlayer][i].classList.add("highlight");
    });
  }
}

function canPieceMove(i) {
  const pos = positions[currentPlayer][i];
  if (pos === -1 && lastRoll !== 6) return false;
  if (pos !== -1 && pos + lastRoll > 57) return false; // 51 common + 6 home
  return true;
}

function handleMove(p, i) {
  if (!canMove || p !== currentPlayer || !canPieceMove(i)) return;
  
  if (positions[p][i] === -1) positions[p][i] = 0;
  else positions[p][i] += lastRoll;

  render(p, i);
  checkKill(i);
  canMove = false;

  if (positions[p].every(pos => pos === 57)) {
    alert(p + " Wins!");
    location.reload();
  } else if (lastRoll !== 6) {
    nextTurn();
  }
}

function checkKill(i) {
  const pos = positions[currentPlayer][i];
  if (pos === -1 || pos > 51 || safetyZones.includes(pos)) return;
  const opp = currentPlayer === "P1" ? "P2" : "P1";
  positions[opp].forEach((oPos, idx) => {
    if (oPos === pos) {
      positions[opp][idx] = -1;
      render(opp, idx);
    }
  });
}

function nextTurn() {
  currentPlayer = currentPlayer === "P1" ? "P2" : "P1";
  playerText.innerText = currentPlayer === "P1" ? "P1 (Blue)" : "P2 (Green)";
  canMove = false;
  document.querySelectorAll(".highlight").forEach(e => e.classList.remove("highlight"));
}

document.getElementById("roll").onclick = rollDice;
init();
