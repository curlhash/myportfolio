
window.requestAnimFrame = (function(callback) {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
		function(callback) {
			window.setTimeout(callback, 1000/60);
		};
})();

function cleansingExitBubbles () {
	if (exitIndexArr.length > 1) {
		setTimeout(function () {
			exitIndexArr.pop();
		}, 2000);
	}
}

function getTheNextPointGivenD (dt, d, x, xf, y, yf) {
	if (d < 0.1) {
		return { x: xf, y: yf };
	} else {
		var t = dt/d;
		if (Math.abs(t) > 1) {
			return { x: xf, y: yf };
		}
	}
	var nextX = (1 - t) * x + t * xf;
	var nextY = (1 - t) * y + t * yf;
	// if ((nextX > xf && dt > 0) || (nextX < xf && dt < 0)) {
	// 	nextX = xf;
	// }
	// if ((nextY > yf && dt > 0) || (nextY < yf && dt < 0)) {
	// 	nextY = yf;
	// }
	return { x: nextX, y: nextY };
}

function toggleBubble (obj, target, isInFront, trackIndex) {
	var scaleFactor = target.factor;
	var d = distance(obj.x, target.x, obj.y, target.y);
	var easing = d * 0.1;
	if (isInFront) {
		easing = d * 0.2;
	} else {
		easing = 5; //(d > 0.5) ? 1/d : 0.1;
	}
	var nextCoOrd = getTheNextPointGivenD(easing, d, obj.x, target.x, obj.y, target.y);
	var radFactor = (target.radius - obj.radius) * 0.08;
	obj.radius += radFactor;
	if (exitIndexArr.indexOf(trackIndex) !== -1 && Math.abs(obj.radius/target.radC) >= 1) {
		obj.radius = target.radC;
	}
	if (exitIndexArr.indexOf(trackIndex) === -1 && Math.abs(obj.radius/300) >= 1) {
		obj.radius = 300;
	}
	obj.opacity = target.opacity;
	obj.x = nextCoOrd.x;
	obj.y = nextCoOrd.y;
	// if (obj.radius < (target.radius - 20)) {
	// 	obj.radius += scaleFactor;
	// } else if (obj.radius > (target.radius + 20)) {
	// 	obj.radius -= scaleFactor;
	// } else {
	// 	obj.radius = target.radius;
	// }
	// if (exitIndexArr.indexOf(trackIndex) === -1) {
	// 	scaleFactor = easing > 10 ? easing : 10;
	// }
	// if (obj.x < (target.x - 10)) {
	// 	obj.x += scaleFactor;
	// } else if (obj.x > (target.x + 10)) {
	// 	obj.x -= scaleFactor;
	// } else if (obj.x !== target.x) {
	// 	obj.x = target.x;
	// } else {
	// 	if (obj.y < (target.y - 10)) {
	// 		obj.y += scaleFactor;
	// 	} else if (obj.y > (target.y + 10)) {
	// 		obj.y -= scaleFactor;
	// 	} else {
	// 		obj.y = target.y;
	// 	}
	// }
	if (isInFront && (target.radius - Math.round(obj.radius) < 10) && (target.x - Math.round(obj.x) < 10)  && (target.y - Math.round(obj.y) < 10) && !clickInit && !reachedCenter && (exitIndexArr.indexOf(trackIndex) === -1)) {
		reachedCenter = true;
		projEl.style.opacity = 1;
		projEl.style.width = '296px';
		projEl.style.height = '296px';
		projEl.style.top = '202px';
		projEl.style.left = '202px';
		projEl.classList.add(obj.imgClass);
		cleansingExitBubbles();
	}
	return obj;
}

function calcTheta (xP, xC) {
	var r = getRadius(xP, xC);
	return (Math.PI - Math.acos((xC.x - xP.x) / r));
}
function getRadius (xP, xC) {
	return distance(xP.x, xC.x, xP.y, xP.y);
}
function togglePointer (i) {
	if (hoveringIndices.indexOf(i) !== -1) {
		hoveringIndices.splice(i, 1);
	}
}
function drawWithImage (arr, context, i) {
	context.save();
	context.beginPath();
	context.arc(arr[i].x, arr[i].y, arr[i].radius, 0, 2 * Math.PI);
	context.lineWidth = 15;
	context.strokeStyle = 'rgba(' + arr[i].colorRGB + ', ' + 0.5 + ')';
	context.fillStyle = 'rgba(255, 255, 255, 1)';
	context.fill();
	context.stroke();
	context.clip();
	context.drawImage(arr[i].img, arr[i].x - arr[i].radius, arr[i].y - arr[i].radius, 2 * arr[i].radius, 2 * arr[i].radius);
	context.beginPath();
	context.arc(arr[i].x, arr[i].y, arr[i].radius, 0, 2 * Math.PI);
	context.clip();
	context.closePath();
	context.restore();
}
function drawWithoutImage (arr, context, i) {
	context.beginPath();
	context.arc(arr[i].x, arr[i].y, arr[i].radius, 0, 2 * Math.PI);
	context.lineWidth = 5;
	context.strokeStyle = 'rgba(' + arr[i].colorRGB + ', ' + 0.5 + ')';
	//context.fillStyle = 'rgba(' + arr[i].colorRGB + ', ' + arr[i].opacity + ')';
	context.fillStyle = 'rgba(255, 255, 255, 1)';
	context.fill();
	context.stroke();
	context.closePath();
}
function drawParticle(arr, context) {
	var hack = false;
	hoveringIndices = [];
	for (var i = 0; i < arr.length; i++) {
		// checking hover
		if (projectBubbleArr.indexOf(i) === -1) {
			if (distance(mouse.x - canvasX, arr[i].x/2, mouse.y - canvasY, arr[i].y/2) < (arr[i].radius + 30) && arr[i].radC > 20) {
				if (distance(mouse.x - canvasX, arr[i].x/2, mouse.y - canvasY, arr[i].y/2) < arr[i].radius) {
					hoveringIndices.push(i);
					if (clickInit) {
						arr.push(arr.splice(i, 1)[0]);
						projectBubbleArr.push(arr.length - 1);
						hack = true;
						break;
					}
					arr[i].opacity = 0.3;
					if (arr[i].radius < arr[i].maxR) {
						arr[i].radius += scaleFactor;
					}
				} else {
					togglePointer(i);
					arr[i].opacity = 0.1;
					if (arr[i].radius > arr[i].radC) {
						arr[i].radius -= scaleFactor;
						arr[i].radius = arr[i].radius < arr[i].radC ? arr[i].radC : arr[i].radius;
					}

					// incremental radius when cursor comes closer
					// if (arr[i].radius < (arr[i].maxR - 10)) {
					// 	arr[i].radius += (scaleFactor / distance(mouse.x - canvasX, arr[i].x, mouse.y - canvasY, arr[i].y));
					// }
				}
			} else {
				togglePointer(i);
				arr[i].opacity = 0.1;
				if (arr[i].radius > arr[i].radC) {
					arr[i].radius -= scaleFactor;
					arr[i].radius = arr[i].radius < arr[i].radC ? arr[i].radC : arr[i].radius;
				}
			}
		} else if (projectBubbleArr.indexOf(i) !== -1) {
			var target, secI;
			if (projectBubbleArr.length > 1) {
				exitIndexArr.push((exitIndexArr.length ? exitIndexArr[exitIndexArr.length - 1] - 1 : arr.length - 2));
				secI = projectBubbleArr.splice(0, 1);
				clickInit = false;
			}
			target = {
				x: canvas.width/2,
				y: canvas.height/2,
				radius: 300,
				factor: 7,
				opacity: 0
			};
			arr[i] = toggleBubble(arr[i], target, true, i);
		}
		if (projectBubbleArr.indexOf(i) === -1 && arr[i].img) {
			if (arr[i].radC > 20) {
				drawWithImage(arr, context, i);
			} else {
				drawWithoutImage(arr, context, i);
			}
		} else {
			drawWithoutImage(arr, context, i);
		}
	}
	if (!hoveringIndices.length) {
		clickInit = false;
		el.style.cursor = 'default';
	} else {
		el.style.cursor = 'pointer';
	}
	if(hack) {
		hack = false;
		clickInit = false;
		drawParticle(arr, context);
	}
}
function convertHexColor (hex) {
	var hex = hex.replace('#', '');
	var r = parseInt(hex.substring(0, 2), 16);
	var g = parseInt(hex.substring(2, 4), 16);
	var b = parseInt(hex.substring(4, 6), 16);
	return r + ', ' + g + ', ' + b;
}
// define a vec class to make vector maths easier (simpler to read)
function vec (x,y) {
	this.length = function() {
		return Math.sqrt((this.x * this.x) + (this.y*this.y));
	};
	this.normalize = function() {
		var scale = this.length();
		this.x /= scale;
		this.y /= scale;
	};
	this.x = x;
	this.y = y;
}
function drawLine (center1_x, center1_y, radius1, center2_x, center2_y, radius2, context, colorRGB) {
	var betweenVec = new vec(center2_x - center1_x, center2_y - center1_y);
	betweenVec.normalize();

	var p1x = center1_x + (radius1 * betweenVec.x);
	var p1y = center1_y + (radius1 * betweenVec.y);

	var p2x = center2_x - (radius2 * betweenVec.x);
	var p2y = center2_y - (radius2 * betweenVec.y);

	context.beginPath();
	context.moveTo(p1x,p1y);
	context.lineTo(p2x,p2y);
	context.strokeStyle = 'rgba(' + colorRGB + ', ' + 0.1 + ')';
	context.lineWidth = 3;
	context.stroke();
}
function distance (x1, x2, y1, y2) {
	return Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));
}
function findGroup (arr, context) {
	var dotCoveredIndexArr = [];
	for (var i = 0; i < arr.length; i++) {
		for (var j = 0; j < arr.length; j++) {
			if (projectBubbleArr[0] !== i && projectBubbleArr[0] !== j) {
				if (distance(arr[i].x, arr[j].x, arr[i].y, arr[j].y) < 100 && dotCoveredIndexArr.indexOf(i) === -1 && arr[i].radius > 5) {
					drawLine(arr[i].x, arr[i].y, arr[i].radius, arr[j].x, arr[j].y, arr[j].radius, context, arr[i].colorRGB);
					dotCoveredIndexArr.push(j);
				}
			}
		}
	}
}
function initParticles(num) {
	var theta;
	var returnArr = [];
	var particleObj = {};
	var circleRadius;
	var centerX = canvas.width / 2;
	var centerY = canvas.height / 2;
	var bigCircleCount = 0;
	var imgEl;
	for (var i = 0; i < num; i++) {
		theta = (Math.random() + 0.5) * (2 * Math.PI);
		circleRadius = canvas.width/3 + (80 - Math.random() * 160);
		particleObj = {
			x: circleRadius * Math.cos(theta) + centerX,
			y: circleRadius * Math.sin(theta) + centerY,
			radius: Math.random() * (bigCircleCount < 10 ? 80 : 15) + 1,
			opacity: 0.1,
			theta: theta,
			colorRGB: colorPallete[Math.floor(Math.random() * colorPallete.length)] || '0,255,56',
			radiusChangeSign: '+',
			toggleRadiusChangeSign: function () {
				(this.radiusChangeSign === '+') ? (this.radius < (Math.random()*50 + 30) ? this.radiusChangeSign = '+' : this.radiusChangeSign = '-') : (this.radius > 2 ? this.radiusChangeSign = '-' : this.radiusChangeSign = '+');
			},
			toggleCircleRadiusChangeSign: function () {
				(this.radiusChangeSign === '+') ? (this.circleRadius < ((canvas.width/3) + 50) ? this.radiusChangeSign = '+' : this.radiusChangeSign = '-') : (this.circleRadius > ((canvas.width/3) - 50) ? this.radiusChangeSign = '-' : this.radiusChangeSign = '+');
			},
			circleRadius: circleRadius
		};
		particleObj.maxR = particleObj.radius + 20;
		particleObj.radC = particleObj.radius;
		particleObj.xC = particleObj.x;
		particleObj.yC = particleObj.y;
		if (particleObj.radius > 15) {
			bigCircleCount += 1;
			if (eyesElArr.length) {
				imgEl = eyesElArr.pop();
				particleObj.img = imgEl.el;
				particleObj.imgClass = imgEl.class;
			}
		}
		returnArr.push(particleObj);
		theta += 2 * Math.PI / particleCount;
	}
	return returnArr;
}
function animate(arr, canvas, context, startTime) {
	var circleRadius, centerX, centerY, nextX, nextY, target;
	// update
	for(var i = 0; i < arr.length; i++) {
		if (projectBubbleArr.indexOf(i) === -1) {
			// new radii
			if (arr[i].radiusChangeSign === '+') {
				arr[i].circleRadius += 0.2;
			} else {
				arr[i].circleRadius -= 0.4;
			}
			arr[i].toggleCircleRadiusChangeSign();
			circleRadius = arr[i].circleRadius;
			centerX = (canvas.width / 2);
			centerY = (canvas.height / 2);
			arr[i].theta += ((Math.random() * (i > 20 ? 20 : i) + 5) * 0.0001);
			nextX = circleRadius * Math.cos(arr[i].theta) + centerX;
			nextY = circleRadius * Math.sin(arr[i].theta) + centerY;
			if (exitIndexArr.indexOf(i) === -1) {
				arr[i].x = nextX;
				arr[i].y = nextY;
			} else {
				target = {
					x: nextX,
					y: nextY,
					radius: arr[i].radC,
					factor: 2,
					opacity: 0.1
				};
				arr[i] = toggleBubble(arr[i], target, false, i);
			}
		}
	}

	context.fillStyle = 'rgba(255, 255, 255, 1)';
	context.fillRect(0, 0, canvas.width, canvas.height);
	findGroup(arr, context);
	// draw
	drawParticle(arr, context);

	// request new frame
	requestAnimFrame(function() {
		animate(arr, canvas, context, startTime);
	});
}


var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var eyesElArr = [
	{
		el: document.getElementById('eyes'),
		class: 'me'
	},
	{
		el: document.getElementById('linkedin'),
		class: 'linkedin'
	},
	{
		el: document.getElementById('insta'),
		class: 'insta'
	},
	{
		el: document.getElementById('github'),
		class: 'github'
	},
	{
		el: document.getElementById('angel'),
		class: 'angel'
	},
	{
		el: document.getElementById('resume'),
		class: 'resume'
	},
	{
		el: document.getElementById('surprise'),
		class: 'surprise'
	}
];
var exitIndexArr = [];
var reachedCenter = false;
var el, projEl, elCanvas, canvasX, canvasY ,scaleFactor = 2, hoveringIndices = [];
el = document.getElementById('myCanvas');
projEl = document.getElementsByClassName('project')[0];
elCanvas = el.getBoundingClientRect();
canvasX = elCanvas.left;
canvasY = elCanvas.top;
var centerY = elCanvas.top + canvas.height/2;
var centerX = elCanvas.left + canvas.width/2;
var mouse = {
	x: 0,
	y: 0
};
var clickInit = false;
var colorPallete = [convertHexColor('430c05'), convertHexColor('d46f4d'), convertHexColor('ffbf66'), convertHexColor('08c5d1'), convertHexColor('00353f'), convertHexColor('4776b9'), convertHexColor('60ccd9'), convertHexColor('3a4e7a')];
var particleCount = 100;
var projectBubbleArr = [particleCount - 1];
var particlesArr = initParticles(particleCount);

drawParticle(particlesArr, context);


setTimeout(function() {
	var startTime = (new Date()).getTime();
	animate(particlesArr, canvas, context, startTime);
}, 100);

document.addEventListener("mousemove", function(e) {
	mouse.x = e.x;
	mouse.y = e.y;
}, false);

canvas.addEventListener('click', function(e) {
	clickInit = true;
	reachedCenter = false;
	projEl.style.opacity = 0;
	projEl.style.width = '0px';
	projEl.style.height = '0px';
	projEl.style.top = '0px';
	projEl.style.left = '0px';

}, false);
