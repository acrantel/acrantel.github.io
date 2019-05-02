var canvas = document.getElementById("pong-canvas");
var context = canvas.getContext("2d");

// listeners
window.addEventListener('mousemove', function(e) {
	// player uses the mouse to control paddle 2
    paddle2y = e.y;
    queuePointer = (queuePointer + 1) % queueLen;
    circQueue[queuePointer] = paddle2y;
});
window.addEventListener('keydown', function (e) {
	if (e.key == "ArrowDown") {
		downArrow = true;
	} else if (e.key == "ArrowUp") {
		upArrow = true;
	}
});
window.addEventListener('keyup', function (e) {
	if (e.key == "ArrowDown") {
		downArrow = false;
	} else if (e.key = "ArrowUp") {
		upArrow = false;
	}
});
window.addEventListener('mouseup', function (e) {
    if (!gameOn) {
        start();
    }
})
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
var score1 = 0;
var score2 = 0;
var maxScore = 15;


// ball variables
var ballx = (playLeft + playRight) / 2;
var bally = (playTop + playBottom) / 2;
var ballvx = 300; // in pixels per second
var ballvy = 40;
var ballfps = 60;

// paddle variables
var paddle1x = playLeft + unitLength;
var paddle1y = canvas.height / 2;
var paddle2x = playRight - unitLength;
var paddle2y = paddle1y;
var upArrow = false; // flag for up arrow being pressed
var downArrow = false; // flag for down arrow being pressed
// paddle speed calculation variables
var queueLen = 40;
var circQueue = [];
var queuePointer = 0;
for (let q = 0; q < queueLen; q++) {
    circQueue.push(paddle2y);
}

// ai variables
var maxPaddleSpeed = ballvx * .6; // px/sec
var AIps = 60; // the number of times to call the ai per second

function updateDisplay() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = "darkslategray";
	context.fillRect(0, 0, canvas.width, canvas.height);;
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
		context.fillRect(actualDividerX,
			playTop + dashLength / 2 + i * 2 * dashLength, dividerWidth, dashLength);
	}
}

function drawPaddles() {
	context.fillStyle = "white";

	context.fillRect(paddle1x - unitLength, paddle1y - unitLength * 2, unitLength, unitLength * 4);
	context.fillRect(paddle2x, paddle2y - unitLength * 2, unitLength, unitLength * 4);
}

function drawBorder() {
	context.fillStyle = "darkslategray";
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
		let newX = ballx + ballvx/ballfps;
		let newY = bally + ballvy/ballfps;
		if (newY <= playTop) {
			newY = playTop;
			ballvy = -ballvy;
		} else if (newY >= playBottom - unitLength) {
			newY = playBottom - unitLength;
			ballvy = -ballvy;
		}
		if (newX <= playLeft + unitLength && newX >= playLeft &&
				(newY > paddle1y - unitLength * 3 - 1 && newY < paddle1y + unitLength * 2 - 1)) {
			newX = playLeft+unitLength;
			ballvx = -ballvx;
		} else if (newX >= playRight-2*unitLength && newX < playRight-unitLength && 
				(newY >= paddle2y-unitLength*3-1 && newY <= paddle2y+unitLength*2-1)) {
			newX = playRight-2*unitLength;
			ballvx = -ballvx;
            ballvy += circQueue[queuePointer] - circQueue[(queuePointer+1) % queueLen]; // (current y val in queue - next yval in queue)
		}
		ballx = newX;
		bally = newY;
		window.setTimeout(updateBall, 1000/ballfps);
	}
}

function runAI() {
    if (gameOn) {
        if (ballx < playLeft || ballx > playRight) {
            if (paddle1y > (playTop + playBottom) / 2) {
                paddle1y += Math.max((playTop + playBottom) / 2 + unitLength / 2 - paddle1y, -maxPaddleSpeed / AIps);
            } else {
                paddle1y += Math.min((playTop + playBottom) / 2 + unitLength / 2 - paddle1y, maxPaddleSpeed / AIps);
            }
        }
        else if (bally > paddle1y) {
            paddle1y += Math.min(bally + unitLength / 2 - paddle1y, maxPaddleSpeed / AIps);
        } else {
            paddle1y += Math.max(bally + unitLength / 2 - paddle1y, -maxPaddleSpeed / AIps);
        }

        // check for player's paddle moving at the same time (this is bad)
        if (downArrow && !upArrow) {
            paddle2y = Math.min(playBottom, paddle2y + 2 * maxPaddleSpeed / AIps);
            queuePointer = (queuePointer + 1) % queueLen;
            circQueue[queuePointer] = paddle2y;
        }
        else if (upArrow && !downArrow) {
            paddle2y = Math.max(0, paddle2y - 2 * maxPaddleSpeed / AIps);
            queuePointer = (queuePointer + 1) % queueLen;
            circQueue[queuePointer] = paddle2y;
        }

        window.setTimeout(runAI, 1000 / AIps);
    }
}

function nextSet() {
	// start the next set
	ballx = (playLeft + playRight) / 2;
	bally = Math.floor(Math.random()*(playBottom-playTop-10)+playTop);
	ballvy = Math.random() * ballvx / 2 + 1;
	ballvx = -ballvx;
}

function mainLoop(time) {
	if (gameOn) {
        updateDisplay();
        // check if ball has passed the sides, and if yes and if player hasn't won, go to next set
        let startNew = false;
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
function start() {
    gameOn = true;
    score1 = 0;
    score2 = 0;
    // ball variables
    ballx = (playLeft + playRight) / 2;
    bally = (playTop + playBottom) / 2;
    ballvx = 300; // in pixels per second
    ballvy = 40;
    
    // paddle variables
    paddle1x = playLeft + unitLength;
    paddle2x = playRight - unitLength;
    upArrow = false; // flag for up arrow being pressed
    downArrow = false; // flag for down arrow being pressed
    // paddle speed calculation variables
    circQueue = [];
    queuePointer = 0;
    for (let q = 0; q < queueLen; q++) {
        circQueue.push(paddle2y);
    }
    window.requestAnimationFrame(mainLoop);
    updateBall();
    runAI();
};
start();