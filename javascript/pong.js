var canvas = document.getElementById("pong-canvas");
var context = canvas.getContext("2d");

// listeners
window.addEventListener('mousemove', function(e) {
  // player uses the mouse to control paddle 2
  paddle2y = e.y;
  paddle1y = e.y;
  // TODO change paddleVeloc
});

// display variables
var playTop = canvas.height / 12;
var playBottom = canvas.height - playTop;
var playLeft = (canvas.width - (playBottom - playTop) * 1.1) / 2;
var playRight = canvas.width - playLeft;
const dividerDashes = 25;
const dividerWidth = 4;
const unitLength = dividerWidth * 2;
const bitNums = [4187593119, 286331153, 4045375631, 4045345055, 2577338641, 4170125599, 2291112351, 4044427537, 4187986335, 4187951377]; // stores how to display the digits 0 to 9

// game variables
var gameOn = false;
var computer = true;
var score1 = 0;
var score2 = 0;
var maxScore = 15;

// paddle variables
var paddle1x = playLeft + unitLength;
var paddle1y = canvas.height / 2;
var paddle2x = playRight - unitLength;
var paddle2y = paddle1y;
var paddleVeloc = 0;
var prevPaddle1Time = 0;
var prevPaddle2Time = 0;

// ball variables
var ballx = (playLeft + playRight) / 2;
var bally = (playTop + playBottom) / 2;
var ballvx = 50; // in pixels per second
var ballvy = 40;
var ballfps = 60;


function updateDisplay() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "darkslategray";
  context.fillRect(0, 0, canvas.width, canvas.height);
  drawDivider();
  drawScores();
  drawPaddles();
  drawBorder();
	drawBall();
}

function drawDivider() {
  context.fillStyle = "white";
  let dashLength = (playBottom - playTop) / (dividerDashes * 2);
  let actualDividerX = (canvas.width / 2) - (dividerWidth / 2);
  let i;
  for (i = 0; i < dividerDashes; i++) {
    context.fillRect(actualDividerX, playTop + dashLength / 2 + i * 2 * dashLength, dividerWidth, dashLength);
  }
}

function drawPaddles() {
  context.fillStyle = "white";

  context.fillRect(paddle1x - unitLength, paddle1y - unitLength * 2, unitLength, unitLength * 4);
  context.fillRect(paddle2x, paddle2y - unitLength * 2, unitLength, unitLength * 4);
}

function drawBorder() {
  context.fillStyle = "green";
  context.fillRect(0, 0, playLeft, canvas.height);
  context.fillRect(playRight, 0, canvas.width - playRight + 3, canvas.height);
  context.fillRect(0, 0, canvas.width, playTop);
  context.fillRect(0, playBottom, canvas.width, canvas.height - playBottom + 3);
}

function drawScores() {
  // draw left score
  draw2dNum(score1, paddle1x, playTop + unitLength, unitLength);
  // draw right score
  draw2dNum(score2, paddle2x - 3 * (unitLength * 4), playTop + unitLength, unitLength);
}

function draw2dNum(num, x, y, unit) {
  let digits = "" + num;
  if (digits.length == 1) {
    drawDigit(digits[0] - '0', x + 2 * (unitLength * 4), y, unitLength);
  } else if (digits.length >= 2) {
    drawDigit(digits[0] - '0', x, y, unitLength);
    drawDigit(digits[1] - '0', x + 2 * (unitLength * 4), y, unitLength);
  }
}

function drawDigit(digit, x, y, unit) {
  // draws a 4x8 (wxh) digit
  context.fillStyle = "white";
  let mask = 1 << 31; // start with 0b100...0
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 4; j++) {
      if ((bitNums[digit] & mask) != 0) {
        context.fillRect(x + j * unit, y + i * unit, j < 3 ? unit + 1 : unit, unit);
      }
      mask = mask >>> 1; // zero fill right shift
    }
  }
}
function drawBall() {
	context.fillStyle = "white";
  context.fillRect(ballx, bally, unitLength, unitLength);
}

function updateBall() {
	if (gameOn) {
    var newX = ballx + ballvx/ballfps;
    var newY = bally + ballvy/ballfps;
    if (newY <= playTop) {
      newY = playTop;
      ballvy = -ballvy;
    } else if (newY >= playBottom - unitLength) {
      newY = playBottom - unitLength;
      ballvy = -ballvy;
    }
    if (newX <= playLeft+unitLength && newX >= playLeft+unitLength/2 && 
        (newY > paddle1y-unitLength*3-1 && newY < paddle1y+unitLength*2-1)) {
      newX = playLeft+unitLength;
      ballvx = -ballvx;
    } else if (newX >= playRight-2*unitLength && newX < playRight-3*unitLength/2 && 
        (newY >= paddle2y-unitLength*3-1 && newY <= paddle2y+unitLength*2-1)) {
      newX = playRight-2*unitLength;
      ballvx = -ballvx;
    }
    ballx = newX;
    bally = newY;
    window.setTimeout(updateBall, 1000/ballfps);
  }
}

function nextSet() {
  // start the next set
  ballx = (playLeft + playRight) / 2;
  bally = Math.floor(Math.random()*(playBottom-playTop-10)+playTop);
  ballvy = Math.random()*20+1;
}

function mainLoop(time) {
	if (gameOn) {
    updateDisplay();
    // check if ball has passed the sides, and if yes and if player hasn't won, go to next set
    var startNew = false;
    if (ballx < 0-unitLength) {
      score2++;
      startNew = true;
    }  else if (ballx > canvas.width) {
      score1++;
      startNew = true;
    }
    if (score1 >= maxScore || score2 >= maxScore) {
      gameOn = false;
      updateDisplay();
    } else if (startNew) {
    	nextSet();
    	window.requestAnimationFrame(mainLoop);
    } else {
    	window.requestAnimationFrame(mainLoop);
    }
  }
}
gameOn = true;
window.requestAnimationFrame(mainLoop);
updateBall();