/* CONSTANTS */
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

const ballRadius = 10;

const paddleHeight = 10;
const paddleWidth = 75;

const bricks = [];
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

const color = '#0095DD';

const ARROW_RIGHT = 'ArrowRight';
const ARROW_LEFT = 'ArrowLeft';
const RIGHT = 'Right';
const LEFT = 'Left';

const fontStyle = '16px Arial';

/* VARIABLES */
let x = canvasWidth / 2;
let y = canvasHeight - 30;
let dx = 2;
let dy = -2;
let score = 0;
let lives = 3;
let paddleX = (canvasWidth - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;

/* GAME FUNCTIONS */
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c += 1) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r += 1) {
      const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
      const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
      bricks[c][r] = { x: brickX, y: brickY, status: 1 };
      if (bricks[c][r].status === 1) {
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c += 1) {
    for (let r = 0; r < brickRowCount; r += 1) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          b.status = 0;
          score += 1;
          if (score === brickColumnCount * brickRowCount) {
            alert('CONGRATULATIONS, YOU WIN'); // eslint-disable-line no-alert
            document.location.reload();
          }
        }
      }
    }
  }
}

function drawScore() {
  ctx.font = fontStyle;
  ctx.fillStyle = color;
  ctx.fillText(`Score: ${score}`, 8, 20);
}

function drawLives() {
  ctx.font = fontStyle;
  ctx.fillStyle = color;
  ctx.fillText(`Lives: ${lives}`, canvasWidth - 65, 20);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvasHeight - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = '#2824KG';
  ctx.fill();
  ctx.closePath();
}

function moveBall() {
  x += dx;
  y += dy;
}

function collisionPaddle() {
  if (x > paddleX && x < paddleX + paddleWidth) {
    dy = -dy;
  } else {
    lives -= 1;
    if (!lives) {
      alert('GAME OVER'); // eslint-disable-line no-alert
      document.location.reload();
    } else {
      x = canvasWidth / 2;
      y = canvasHeight - 30;
      dx = 3;
      dy = -3;
      paddleX = (canvasWidth - paddleWidth) / 2;
    }
  }
}

function collisionCanvas() {
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvasHeight - ballRadius) {
    collisionPaddle();
  }

  if (x + dx > canvasWidth - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
}

function checkKeys() {
  if (rightPressed) {
    paddleX += 7;
    if (paddleX + paddleWidth > canvasWidth) {
      paddleX = canvasWidth - paddleWidth;
    }
  } else if (leftPressed) {
    paddleX -= 7;
    if (paddleX < 0) {
      paddleX = 0;
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  drawBricks();
  drawBall();
  collisionDetection();
  drawPaddle();
  drawScore();
  drawLives();

  collisionCanvas();

  moveBall();

  checkKeys();

  requestAnimationForm(draw); // eslint-disable-line no-undef
}

/* EVENT LISTENER FUNCTIONS */
function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvasWidth) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

function keyDownHandler(e) {
  if (e.key === RIGHT || e.key === ARROW_RIGHT) {
    rightPressed = true;
  } else if (e.key === LEFT || e.key === ARROW_LEFT) {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === RIGHT || e.key === ARROW_RIGHT) {
    rightPressed = false;
  } else if (e.key === LEFT || e.key === ARROW_LEFT) {
    leftPressed = false;
  }
}

/* KEY/MOUSE EVENT LISTENERS */
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);

/* INITIALIZE GAME */
draw();
