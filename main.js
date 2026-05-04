const ludo = document.getElementById("board");
const diceText = document.getElementById("dice");
const playerText = document.getElementById("current-p");

const players = ["P1", "P2", "P3", "P4"];
const playerNames = { P1: "Blue", P2: "Orange", P3: "Green", P4: "Yellow" };
let turnIndex = 0;
let currentPlayer = players[turnIndex];

// 4 Players, 4 pieces each. -1 means the piece is in the yard.
let positions = { 
  P1: [-1, -1, -1, -1], 
  P2: [-1, -1, -1, -1], 
  P3: [-1, -1, -1, -1], 
  P4: [-1, -1, -1, -1] 
};

let lastRoll = 0;
let canMove = false;
let earnedBonus = false; 

// The 52-step shared circuit [col, row]
const commonPath = [
  [1,6],[2,6],[3,6],[4,6],[5,6],[6,5],[6,4],[6,3],[6,2],[6,1],[6,0],
  [7,0],[8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[9,6],[10,6],[11,6],
  [12,6],[13,6],[14,6],[14,7],[14,8],[13,8],[12,8],[11,8],[10,8],
  [9,8],[8,9],[8,10],[8,11],[8,12],[8,13],[8,14],[7,14],[6,14],
  [6,13],[6,12],[6,11],[6,10],[6,9],[5,8],[4,8],[3,8],[2,8],[1,8],[0,8],[0,7],[0,6]
];

// How many steps offset each player starts at on the common path
const startOffsets = { P1: 0, P2: 13, P3: 26, P4: 39 };

// The private 6-step lanes to the center
const homePaths = {
  P1: [[1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7]], // Blue
  P2: [[7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [7, 6]], // Orange
  P3: [[13, 7], [12, 7], [11, 7], [10, 7], [9, 7], [8, 7]], // Green
  P4: [[7, 13], [7, 12], [7, 11], [7, 10], [7, 9], [7, 8]]  // Yellow
};

// Safe squares where pieces cannot be captured
const safetyZones = [0, 8, 13, 21, 26, 34, 39, 47];

// Exact coordinates for the 4 circles in each home yard
const yards = {
  P1: [[1.5, 1.5], [3.5, 1.5], [1.5, 3.5], [3.5, 3.5]], // Blue
  P2: [[10.5, 1.5], [12.5, 1.5], [10.5, 3.5], [12.5, 3.5]], // Orange
  P3: [[10.5, 10.5], [12.5, 10.5], [10.5, 12.5], [12.5, 12.5]], // Green
  P4: [[1.5, 10.5], [3.5, 10.5], [1.5, 12.5], [3.5, 12.5]] // Yellow
};

const tokens = { P1: [], P2: [], P3: [], P4: [] };

function init() {
  players.forEach(p => {
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
  updateStacking();
}

function getBoardIndex(player, steps) {
  if (steps === -1 || steps > 51) return -1;
  return (steps + startOffsets[player]) % 52;
}

function render(p, i) {
  const steps = positions[p][i];
  let coords;
  
  if (steps === -1) coords = yards[p][i];
  else if (steps <= 51) coords = commonPath[getBoardIndex(p, steps)];
  else coords = homePaths[p][steps - 52];

  tokens[p][i].style.left = `${(coords[0] + 0.5) * (100 / 15)}%`;
  tokens[p][i].style.top = `${(coords[1] + 0.5) * (100 / 15)}%`;
  tokens[p][i].classList.remove("highlight");
}

function updateStacking() {
  const cells = {};
  
  players.forEach(p => {
    for(let i=0; i<4; i++) {
      if(positions[p][i] === -1) continue; 
      
      const el = tokens[p][i];
      const key = el.style.left + '-' + el.style.top;
      if(!cells[key]) cells[key] = [];
      cells[key].push(el);
    }
  });

  for(const key in cells) {
    const group = cells[key];
    if(group.length === 1) {
      group[0].style.transform = `translate(-50%, -50%) scale(1)`;
    } else {
      group.forEach((el, index) => {
        const shiftX = (index - (group.length - 1) / 2) * 10;
        el.style.transform = `translate(calc(-50% + ${shiftX}px), -50%) scale(0.85)`;
      });
    }
  }
}

function rollDice() {
  if (canMove) return;
  lastRoll = Math.floor(Math.random() * 6) + 1;
  diceText.innerText = "Dice: " + ["⚀","⚁","⚂","⚃","⚄","⚅"][lastRoll-1];
  
  if (!positions[currentPlayer].some((_, i) => canPieceMove(i))) {
    setTimeout(nextTurn, 800);
  } else {
    canMove = true;
    positions[currentPlayer].forEach((_, i) => {
      if (canPieceMove(i)) tokens[currentPlayer][i].classList.add("highlight");
    });
  }
}

function canPieceMove(i) {
  const steps = positions[currentPlayer][i];
  if (steps === -1 && lastRoll !== 6) return false;
  if (steps !== -1 && steps + lastRoll > 57) return false;
  return true;
}

function handleMove(p, i) {
  if (!canMove || p !== currentPlayer || !canPieceMove(i)) return;
  
  if (positions[p][i] === -1) {
    positions[p][i] = 0;
  } else {
    positions[p][i] += lastRoll;
  }

  if (positions[p][i] === 57) earnedBonus = true;

  render(p, i);
  checkKill(i);
  updateStacking(); 
  canMove = false;

  if (positions[p].every(step => step === 57)) {
    alert(playerNames[p] + " WINS!");
    location.reload();
  } else if (lastRoll === 6 || earnedBonus) {
    diceText.innerText += " (Bonus Roll!)";
    earnedBonus = false; 
  } else {
    nextTurn();
  }
}

function checkKill(i) {
  const mySteps = positions[currentPlayer][i];
  const myBoardIndex = getBoardIndex(currentPlayer, mySteps);
  
  if (myBoardIndex === -1 || safetyZones.includes(myBoardIndex)) return;
  
  players.forEach(opp => {
    if (opp !== currentPlayer) {
      positions[opp].forEach((oppSteps, idx) => {
        const oppBoardIndex = getBoardIndex(opp, oppSteps);
        
        if (oppBoardIndex === myBoardIndex) {
          positions[opp][idx] = -1; 
          render(opp, idx);
          earnedBonus = true; 
        }
      });
    }
  });
}

function nextTurn() {
  turnIndex = (turnIndex + 1) % players.length;
  currentPlayer = players[turnIndex];
  
  if (positions[currentPlayer].every(step => step === 57)) {
    nextTurn(); 
    return;
  }
  
  playerText.innerText = "Turn: P" + (turnIndex + 1) + " (" + playerNames[currentPlayer] + ")";
  canMove = false;
  document.querySelectorAll(".highlight").forEach(e => e.classList.remove("highlight"));
}

document.getElementById("roll").onclick = rollDice;
init();
