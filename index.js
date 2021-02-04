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

  move(canvas) {
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

class Paddle {
  constructor(canvas) {
    this.color = '#0095DD';
    this.width = 75;
    this.height = 10;
    this.x = (canvas.width - this.width) / 2;
  }

  drawPaddle(canvas, ctx, rightPressed, leftPressed) {
    if (rightPressed && this.x < canvas.width - this.width) {
      this.x -= 7;
    } else if (leftPressed && this.x > 0) {
      this.x += 7;
    }

    ctx.beginPath();
    ctx.rect(this.x, canvas.height - this.height, this.width, this.height);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

/* CONSTANTS */
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

/* INIT CLASS OBJECTS */
const ball = new Ball();
const paddle = new Paddle();

// BRICK VALUES
const brickRowCount = 5;
const brickColumnCount = 3;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
const bricks = [];
for (let c = 0; c < brickColumnCount; c += 1) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r += 1) {
    const brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
    const brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;
    bricks[c][r] = new Brick(brickX, brickY, 1);
  }
}

let rightPressed = false;
let leftPressed = false;

/* EVENT LISTENER FUNCTIONS */
function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddle.x = relativeX - paddle.width / 2;
  }
}

function keyDownHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = true;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = false;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = false;
  }
}

/* KEY/MOUSE EVENT LISTENERS */
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);

function renderGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ball.drawBall(ctx);
  ball.move(canvas);

  for (let c = 0; c < brickColumnCount; c += 1) {
    for (let r = 0; r < brickRowCount; r += 1) {
      if (bricks[c][r].status === 1) {
        bricks[c][r].drawBrick(ctx);

        bricks[c][r].detectCollision(ball);
      }
    }
  }

  paddle.drawPaddle(canvas, ctx, leftPressed, rightPressed);
  ball.determineLoss(canvas, paddle);
}
setInterval(renderGame, 10);
