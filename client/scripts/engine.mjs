// UI elemnts
const colorSlider = document.querySelector("#color-slider");
const colorIndicator = document.querySelector("#color-indicator");
const scoreUI = document.querySelector("#score-text");

// Canvas and context
let gameArea;
let context;

// props
const colors = ["red", "green", "blue", "yellow"];
// Holds all fallings blocks spawned
let spawnedBlocks = [];
// holds score
let score = 0;

// Game objects
const tileObj = {
  size: 32,
  rows: 12,
  columns: 18,
};

const gameAreaDimensions = {
  width: tileObj.size * tileObj.rows,
  height: tileObj.size * tileObj.columns,
};

const player = {
  color: "red",
  x: gameAreaDimensions.width / 2 - 64 / 2,
  y: gameAreaDimensions.height - tileObj.size * 5,
  width: tileObj.size * 2,
  height: tileObj.size * 2,
};

window.addEventListener("load", initGame);

// Runs on game load
function initGame() {
  gameArea = document.querySelector("#game-area");
  gameArea.width = gameAreaDimensions.width;
  gameArea.height = gameAreaDimensions.height;
  context = gameArea.getContext("2d");
  colorSlider.style.width = `${gameAreaDimensions.width * 0.5}px`;
  colorIndicator.style.width = `${gameAreaDimensions.width * 0.5}px`;

  setInterval(spawnFallingBlock, 2000);
  update();
}

// Runs every tick and clears prev canva frame
function update() {
  context.clearRect(0, 0, gameAreaDimensions.width, gameAreaDimensions.height);

  createPlayer();
  moveFallingBlock();

  // Event handlers
  colorSlider.addEventListener("input", changePlayerColor);

  requestAnimationFrame(update);
}

// Draw player
function createPlayer() {
  context.fillStyle = player.color;
  context.fillRect(player.x, player.y, player.width, player.height);
}

// Change player color RGBY & clear prev player color
function changePlayerColor(e) {
  context.clearRect(0, 0, gameAreaDimensions.width, gameAreaDimensions.height);

  const val = e.target.value;

  // RGBY draw new frame with appropriate color
  if (val >= 75) {
    player.color = "yellow";
    createPlayer();
  } else if (val >= 50) {
    player.color = "blue";
    createPlayer();
  } else if (val >= 25) {
    player.color = "green";
    createPlayer();
  } else {
    player.color = "red";
    createPlayer();
  }
}

// Draw box
function spawnFallingBlock() {
  const fallingBlock = {
    color: colors[Math.floor(Math.random() * colors.length)],
    x: gameAreaDimensions.width / 2 - 64 / 2,
    y: -tileObj.size * 2,
    width: tileObj.size * 2,
    height: tileObj.size * 2,
    speed: 1,
  };

  spawnedBlocks.push(fallingBlock);
}

function moveFallingBlock() {
  spawnedBlocks.forEach(function (block, index) {
    block.y += block.speed;

    if (block.y > gameAreaDimensions.height + tileObj.size * 2) {
      spawnedBlocks.splice(index, 1);
    } else {
      context.fillStyle = block.color;
      context.fillRect(block.x, block.y, block.width, block.height);

      if (onCollision(block, player)) {
        if (player.color === block.color) {
          spawnedBlocks.splice(index, 1);
          ++score;
          updateScoring(score);
        } else {
          spawnedBlocks = [];
          score = 0;
          updateScoring(score);
        }
      }
    }
  });
}

function updateScoring(score) {
  scoreUI.textContent = `score: ${score}`;
}

function onCollision(box1, box2) {
  // get the coordinates and dimensions of both boxes
  var box1Left = box1.x;
  var box1Right = box1.x + box1.width;
  var box1Top = box1.y;
  var box1Bottom = box1.y + box1.height;

  var box2Left = box2.x;
  var box2Right = box2.x + box2.width;
  var box2Top = box2.y;
  var box2Bottom = box2.y + box2.height;

  // check if the boxes overlap on both the x and y axis
  if (
    box1Left < box2Right &&
    box1Right > box2Left &&
    box1Top < box2Bottom &&
    box1Bottom > box2Top
  ) {
    return true;
  } else {
    return false;
  }
}
