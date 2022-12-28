const canvas = document.querySelector("canvas");
const counter = document.querySelector("#counter");
const score = document.querySelector("#score");
const restartButton = document.querySelector("button");

canvas.height = 800;
canvas.width = 600;

let level = 3;

let interval;
let countdown = 3;
let pipePassed = 0;

let gravity = 0;
let velocity = 0.2;

const pipeWidth = 70;
const pipeGapHeight = 250;
const pipeGapWidth = (canvas.width - 2 * pipeWidth) / 3 + pipeWidth;
const minPipeHeight = 50;

let birdSize = 20;
let birdX = 100;
let birdY = 250;

const pipes = [];

const ctx = canvas.getContext("2d");

function generatePipes() {
  for (let i = 0; i < 3; i++) {
    drawPipe(i * pipeGapWidth + 200);
  }
}

function animate() {
  interval = requestAnimationFrame(animate);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updatePipe();
  updateBird();
  checkCollison(pipes[0], { x: birdX, y: birdY });
}

function drawPipe(gap) {
  let upperPipeHeight = Math.floor(
    Math.random() * (canvas.height - pipeGapHeight * 2) + minPipeHeight
  );

  let lowerPipeY = upperPipeHeight + pipeGapHeight;
  let lowerPipeHeight = canvas.height - upperPipeHeight - pipeGapHeight;
  let upperPipeY = 0;
  let upperPipeX = canvas.width - pipeWidth + gap;

  let lowerPipeX = canvas.width - pipeWidth + gap;

  pipes.push({
    upperPipeHeight,
    lowerPipeY,
    lowerPipeHeight,
    upperPipeX,
    upperPipeY,
    lowerPipeX,
  });
}

function updatePipe() {
  pipes.forEach((pipe) => {
    // draw pipes
    ctx.fillStyle = "white";
    ctx.fillRect(
      pipe.upperPipeX,
      pipe.upperPipeY,
      pipeWidth,
      pipe.upperPipeHeight
    );
    ctx.fillRect(
      pipe.lowerPipeX,
      pipe.lowerPipeY,
      pipeWidth,
      pipe.lowerPipeHeight
    );

    // update positions
    pipe.upperPipeX -= level;
    pipe.lowerPipeX -= level;
  });

  // shift first element when it goes out of screen and add new one at the end
  if (pipes[0].upperPipeX < pipeWidth * -1) {
    pipes.shift();
    drawPipe(pipeWidth);
    pipePassed++;
    score.innerText = pipePassed;

    // make game harder progressively after 5 pipes
    if (pipePassed !== 0 && pipePassed % 5 === 0) {
      level += 0.2;
    }
  }
}
function updateBird() {
  ctx.font = "50px Arial";
  ctx.fillText("🐤", birdX - 15, birdY + 30);

  ctx.fillStyle = "red";
  ctx.fillRect(birdX, birdY, 25, 25);

  gravity += velocity;

  birdY += gravity;

  if (birdY < birdSize * -1) {
    birdY = 0;
  }
}

function checkCollison(pipeCoor, birdCoor) {
  if (
    birdCoor.x + 20 >= pipeCoor.upperPipeX &&
    birdCoor.x + 20 <= pipeCoor.upperPipeX + pipeWidth &&
    birdCoor.y <= pipeCoor.upperPipeHeight
  ) {
    gameOver();
  }
  if (
    birdCoor.x + 20 >= pipeCoor.lowerPipeX &&
    birdCoor.x + 20 <= pipeCoor.lowerPipeX + pipeWidth &&
    birdCoor.y + 20 >= pipeCoor.lowerPipeY
  ) {
    gameOver();
  }

  if (birdCoor.y + 20 >= canvas.height) {
    gameOver();
  }

  if (birdCoor.y <= 0) {
    gameOver();
  }
}

function gameOver() {
  ctx.font = "200px Arial";
  ctx.fillText("☠️", 200, 300);
  cancelAnimationFrame(interval);
  restartButton.style.display = "block";
}

function startGame() {
  generatePipes();
  animate();
}

const countdownInterval = setInterval(() => {
  counter.textContent = countdown--;
  if (countdown === -1) {
    counter.textContent = "";
    startGame();
    clearInterval(countdownInterval);
  }
}, 1000);

window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    gravity = -5;
  }
});

canvas.addEventListener("touchstart", (e) => {
  gravity = -5;
});
