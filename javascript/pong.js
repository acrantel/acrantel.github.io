var canvas = document.getElementById("pong-canvas");
var context = canvas.getContext("2d");

// display variables
var playLeft = canvas.width / 16;
var playRight = canvas.width - playLeft;
var playTop = canvas.height / 12;
var playBottom = canvas.height - playTop;
const dividerDashes = 25;
const dividerWidth = 3;
const bitNums = [4187593119, 286331153, 4045375631, 4170156175, 2577338641, 4170125599, 2291112351, 4044427537, 4187986335, 4187951377]; // stores how to display the digits 0 to 9

// game variables
var gameOn = false;
var computer = true;
var score1 = 0;
var score2 = 0;

// ball variables
var ballx = canvas.width / 2;
var bally = canvas.height / 2;

// paddle variables
var paddle1x = canvas.width / 6;
var paddle1y = canvas.height / 2;
var paddle2x = canvas.width - paddle1x;
var paddle2y = canvas.width - paddle2y;

function update() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = "darkslategray";
	context.fillRect(0, 0, canvas.width, canvas.height);
	drawDivider();
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
function drawScores() {

}
update();