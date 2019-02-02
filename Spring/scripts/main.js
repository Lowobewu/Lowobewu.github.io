function getPosition(el) {
  var xPosition = 0;
  var yPosition = 0;
 
  while (el) {
    xPosition += (el.offsetLeft - el.scrollLeft + el.clientLeft);
    yPosition += (el.offsetTop - el.scrollTop + el.clientTop);
    el = el.offsetParent;
  }
  return {
    x: xPosition,
    y: yPosition
  };
}
function setMousePosition(e) {
  mousePos = {x:e.clientX-canvasPos.x,y:e.clientY-canvasPos.y}
} 
var canvas = document.getElementById('canvas');
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;
var centerX = canvasWidth/2;
var centerY = canvasHeight/2;
var context = canvas.getContext('2d');
var canvasPos = getPosition(canvas);
var mousePos = {};

canvas.addEventListener("mousemove", setMousePosition, false);

function sawPoints(pointA,pointB,numberOfPoints,sawWidth) {
	var vector = {};
	vector.x = pointB.x-pointA.x;
	vector.y = pointB.y-pointA.y;
	vector.m = Math.sqrt(Math.pow(vector.x, 2)+Math.pow(vector.y, 2));
	var unitVector = {};
	unitVector.x = vector.x/vector.m;
	unitVector.y = vector.y/vector.m;
	var perpendicular = [{x:unitVector.y*sawWidth,y:-unitVector.x*sawWidth},{x:-unitVector.y*sawWidth,y:unitVector.x*sawWidth}]
	var step = vector.m/numberOfPoints;
	_sawPoints = [];
	_sawPoints[0] = pointA
	for (var i=1;i<numberOfPoints ;i++){
		_sawPoints[i] = {}
		_sawPoints[i].x = _sawPoints[0].x + unitVector.x * step*i + perpendicular[i%2].x
		_sawPoints[i].y = _sawPoints[0].y + unitVector.y * step*i + perpendicular[i%2].y
	}
	_sawPoints[numberOfPoints] = pointB
	return _sawPoints
};

var ballVelocity = {
	x: 0,
	y: 0
};
var ballPosition = {
	x: centerX,
	y: centerY
};
var ball = {
	mass: 10,
	radi: 10,
	airResistance: 3
};

var spring = {
	k:50,
	restLength : 100
};

function draw() {
	var dt = performance.now()/1000 - t;
	t += dt //performance.now()
    context.clearRect(0, 0, canvasWidth, canvasHeight);
	/*
	context.fillText('dt = '+dt, 10, 25);
	context.fillText('fps : '+1/dt, 10, 40);
	*/
/*
	var x = centerX + 100*Math.sin(t)
	var y = centerY + 100*Math.cos(t)
*/
	mousePos.x = mousePos.x || 0;
	mousePos.y = mousePos.y || 0;
	
	var vectorDistance = {
		x: ballPosition.x-mousePos.x,
		y: ballPosition.y-mousePos.y
	};
	vectorDistance.m = Math.sqrt(Math.pow(vectorDistance.x, 2)+Math.pow(vectorDistance.y, 2));

	var vectorDistanceUnit = {
		x: vectorDistance.x/vectorDistance.m,
		y: vectorDistance.y/vectorDistance.m
	};
	var restVector = {
		x: mousePos.x+spring.restLength*vectorDistanceUnit.x,
		y: mousePos.y+spring.restLength*vectorDistanceUnit.y
	}
	var elongationVector = {
		x: ballPosition.x-restVector.x,
		y: ballPosition.y-restVector.y
	}
	var forceVector = {
		x: -spring.k*elongationVector.x-ballVelocity.x*ball.airResistance,
		y: -spring.k*elongationVector.y+100*ball.mass-ballVelocity.y*ball.airResistance
	}
	var ballAcceleration = {
		x: forceVector.x/ball.mass,
		y: forceVector.y/ball.mass
	}
	
	ballVelocity.x+= ballAcceleration.x * dt,
	ballVelocity.y+= ballAcceleration.y * dt

	ballPosition.x +=  ballVelocity.x* dt
	ballPosition.y +=  ballVelocity.y* dt
	
	saw = sawPoints({x:mousePos.x,y:mousePos.y},{x:ballPosition.x,y:ballPosition.y},20,5)
	
	context.beginPath();
	context.arc(ballPosition.x,ballPosition.y, ball.radi, 0, 2 * Math.PI, true);
	context.fillStyle = "#FF6A6A";
	context.fill();

	context.beginPath();
	context.moveTo(saw[0].x,saw[0].y);
	for (var i=1; i<saw.length;i++) {
		context.lineTo(saw[i].x,saw[i].y);
	}
	//context.lineTo(mousePos.x,mousePos.y);
	context.fillStyle = "#000000";
	context.stroke();

    requestAnimationFrame(draw);
}
var t = performance.now()/1000
draw()
//draw()
 