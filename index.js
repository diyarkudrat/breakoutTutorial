/* eslint max-classes-per-file: ["error", 3] */
/* CLASSES */
class Ball {
  constructor() {
    this.x = 250;
    this.y = 160;
    this.dx = 2;
    this.dy = 2;
    this.ballRadius = 10;
    this.color = '#0095DD';
  }

  drawBall(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  move() {
    if (this.y + this.dy > canvas.height - this.ballRadius || this.y + this.dy < this.ballRadius) {
      this.dy = -(this.dy);
    }

    if (this.x + this.dx > canvas.width - this.ballRadius || this.x + this.dx < this.ballRadius) {
      this.dx = -(this.dx);
    }

    this.x += this.dx;
    this.y += this.dy;
  }

  determineLoss(canvas, paddle) {
    if (this.y + this.dy > canvas.height - this.ballRadius) {
      if (this.x > paddle.x && this.x < paddle.x + paddle.width) {
        this.dy = -(this.dy);
      } else {
        alert('GAME OVER'); // eslint-disable-line no-alert
        document.location.reload();
      }
    }
  }
}

class Brick {
  constructor(x, y, status) {
    this.x = x;
    this.y = y;
    this.status = status;
    this.color = '#0095DD';
    this.width = 75;
    this.height = 20;
  }

  drawBricks(ctx) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  collisionDetection(ball) {
    if (ball.x < this.x && ball.x < this.x + this.width
      && ball.y > this.y
      && ball.y < this.y + this.height) {
      ball.dy = -(ball.dy); // eslint-disable-line
      this.status = 0;
    }
  }
}

/* CONSTANTS */
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

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

const ARROW_RIGHT = 'ArrowRight';
const ARROW_LEFT = 'ArrowLeft';
const RIGHT = 'Right';
const LEFT = 'Left';

const fontStyle = '16px Arial';

/* VARIABLES */
let score = 0;
let lives = 3;
let paddleX = (canvasWidth - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;

/* GAME FUNCTIONS */
// function collisionDetection() {
//   for (let c = 0; c < brickColumnCount; c += 1) {
//     for (let r = 0; r < brickRowCount; r += 1) {
//       const b = bricks[c][r];
//       if (b.status === 1) {
//         if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
//           dy = -dy;
//           b.status = 0;
//           score += 1;
//           if (score === brickColumnCount * brickRowCount) {
//             alert('CONGRATULATIONS, YOU WIN'); // eslint-disable-line no-alert
//             document.location.reload();
//           }
//         }
//       }
//     }
//   }
// }

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
