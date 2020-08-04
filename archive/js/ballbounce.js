var canvas = document.getElementById("bounce-ball-canvas");
var context = canvas.getContext('2d');

// physical constants
var g = .1; // gravity
var fac = .9; // reduce velocity by fac every bounce
var radius = 20; // ball radius
var color = "#ffaf00"; // ball color

// initialize position and velocity of ball
var x = 50;
var y = 50; 
var vx = 2;
var vy = 0;

window.onload = init;

function init() {
	setInterval(update, 1000 / 60.0); // 60 frams per second
}

function update() {
	// update velocity
	vy += g;
	// update position
	x += vx;
	y += vy;
	// bounce if necessary
	if (y > canvas.height - radius) {
		y = canvas.height - radius;
		vy *= -1 * fac;
	}
	if (x > canvas.width + radius) {
		x = -radius;
	}
	drawBall();
}

function drawBall() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = color;
	context.beginPath();
	context.arc(x, y, radius, 0, 2 * Math.PI, true);
	context.closePath();
	context.fill();
}
