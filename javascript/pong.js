var canvas = document.getElementById("pong-canvas");
var context = canvas.getContext("2d");

// listeners
window.addEventListener('mousemove', function (e) {
	// player uses the mouse to control paddle 2
	paddle2y = e.y;
	update();
});

// display variables
var playTop = canvas.height / 12;
var playBottom = canvas.height - playTop;
var playLeft = (canvas.width - (playBottom-playTop)*1.1)/2;
var playRight = canvas.width - playLeft;
const dividerDashes = 25;
const dividerWidth = 4;
const unitLength = dividerWidth * 2;
const bitNums = [4187593119, 286331153, 4045375631, 4045345055, 2577338641, 4170125599, 2291112351, 4044427537, 4187986335, 4187951377]; // stores how to display the digits 0 to 9

// game variables
var gameOn = false;
var computer = true;
var score1 = 82;
var score2 = 18;

// ball variables
var ballx = (playLeft + playRight) / 2;
var bally = (playTop + playBottom) / 2;
var ballvx = 0;
var ballvy = 0;

// paddle variables
var paddle1x = playLeft+unitLength;
var paddle1y = canvas.height / 2;
var paddle1v = 0; // velocity of paddle
var paddle2x = playRight-unitLength;
var paddle2y = canvas.width - paddle2y;
var paddle2v = 0; 

function updateDisplay() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = "darkslategray";
	context.fillRect(0, 0, canvas.width, canvas.height);
	drawDivider();
	drawScores();
	drawPaddles();
	drawBorder();
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

	context.fillRect(paddle1x-unitLength, paddle1y - unitLength*2, unitLength, unitLength * 4);
	context.fillRect(paddle2x, paddle2y - unitLength*2, unitLength, unitLength * 4);
}
function drawBorder() {
	context.fillStyle = "pink";
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
function updateBall() {
	var newX = ballx + ballvx;
	var newY = bally + ballvy;
	//TODO
}

function mainLoop(time) {
	updateDisplay();
	window.requestAnimationFrame(mainLoop);
}
window.requestAnimationFrame(mainLoop);
window.setTimeout()