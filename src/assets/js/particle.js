(function () {
	window.requestAnimFrame = (function(callback) {
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
			function(callback) {
				window.setTimeout(callback, 1000 / 60);
			};
	})();

	function drawParticle(arr, context) {
		var colorRGB;
		colorRGB = colorPallete[Math.floor(Math.random() * colorPallete.length)] || '0,255,56';
		for (var i = 0; i < arr.length; i++) {
			context.beginPath();
			context.arc(arr[i].x, arr[i].y, arr[i].radius, 0, 2 * Math.PI);
			context.fillStyle = 'rgba(' + colorRGB + ', ' + arr[i].opacity + ')';
			context.fill();
			context.closePath();
		}
	}
	function convertHexColor (hex) {
		var hex = hex.replace('#', '');
		var r = parseInt(hex.substring(0, 2), 16);
		var g = parseInt(hex.substring(2, 4), 16);
		var b = parseInt(hex.substring(4, 6), 16);
		return r + ', ' + g + ', ' + b;
	}
	function generateColorPallete (hexArr) {
		var returnArr = [];
		for (var i = 0; i < hexArr.length; i++) {
			returnArr.push(convertHexColor(hexArr[i]));
		}
		return returnArr;
	}

	function initParticles(num, radius, opacity, isRandom) {
		var returnArr = [];
		var particleObj = {};
		radius = isRandom ? Math.floor(Math.random() * radius) + 4 : radius;
		opacity = isRandom ? Math.floor(Math.random() * opacity) : opacity;
		for (var i = 0; i < num; i++) {
			particleObj = {
				x: canvas.width/2,
				y: canvas.height/2,
				radius: radius || 10,
				opacity: opacity || 1
			};
			returnArr.push(particleObj)
		}
		return returnArr;
	}
	function animate(arr, canvas, context, startTime) {
		// update
		for(var i = 0; i < arr.length; i++) {
			var time = ((new Date()).getTime() - startTime) / 2;
			var angularVelocity = 0.009 - (i * 0.001);
			var circleRadius = canvas.width/2 - (i * 20);
			var centerX = canvas.width / 2;
			var centerY = canvas.height / 2;
			var theta = time * angularVelocity;
			var nextX = circleRadius * Math.cos(theta - (i * 0.02)) + centerX;
			var nextY = circleRadius * Math.sin(theta - (i * 0.02)) + centerY;
			arr[i].x = nextX;
			arr[i].y = nextY;
			//arr[i].radius = Math.floor(Math.random() * 10) + 3;
		}

		context.fillStyle = 'rgba(0, 0, 0, 0.05)';
		context.fillRect(0, 0, canvas.width, canvas.height);

		// draw
		drawParticle(arr, context);

		// request new frame
		requestAnimFrame(function() {
			animate(arr, canvas, context, startTime);
		});
	}

	function initExplosionParticles(num, radius, opacity, isRandom) {
		var theta = 0;
		var returnArr = [];
		var particleObj = {};
		var circleRadius = canvas.width/50;
		var centerX = canvas.width / 2;
		var centerY = canvas.height / 2;
		radius = isRandom ? Math.floor(Math.random() * radius) + 1 : radius;
		opacity = isRandom ? Math.floor(Math.random() * opacity) : opacity;
		for (var i = 0; i < num; i++) {
			particleObj = {
				x: circleRadius * Math.cos(theta) + centerX,
				y: circleRadius * Math.sin(theta) + centerY,
				radius: radius || 10,
				opacity: opacity || 1,
				theta: theta
			};
			returnArr.push(particleObj);
			theta += 2 * Math.PI / num;
		}
		return returnArr;
	}
	function explosionAnimate(arr, canvas, context, startTime) {
		// update
		for(var i = 0; i < arr.length; i++) {
			var time = (new Date()).getTime() - startTime + 1;
			var speed = 0.01;
			var distance = time * speed;
			var nextX = distance * Math.cos(arr[i].theta) + arr[i].x;
			var nextY = distance * Math.sin(arr[i].theta) + arr[i].y;
			arr[i].x = nextX;
			arr[i].y = nextY;
			arr[i].radius -= 0.12;
		}

		context.fillStyle = 'rgba(0, 0, 0, 0.5)';
		//context.fillRect(0, 0, canvas.width, canvas.height);

		// draw
		drawParticle(arr, context);

		// request new frame
		requestAnimFrame(function() {
			explosionAnimate(arr, canvas, context, startTime);
		});
	}

	function setAnimation (callback, particlesArr, canvas, context) {
		// wait one second before starting animation
		setTimeout(function() {
			var startTime = (new Date()).getTime();
			callback(particlesArr, canvas, context, startTime);
		}, 1000);
	}

	// random selection of the experiment
	var EXPERIMENTS = {
		spiral: 'SPIRAL',
		explosion: 'EXPLOSION'
	};
	var DECIDING_ARR = ['SPIRAL', 'EXPLOSION'];
	var EXPERIMENT_COUNT = 2;

	var colorPallete = generateColorPallete(['c96332', 'ec9e14', 'f1e4da', '00a2e4']);
	var canvas = document.getElementById('myCanvas');
	var context = canvas.getContext('2d');
	var chance = DECIDING_ARR[Math.floor(Math.random() * EXPERIMENT_COUNT)];
	var particleCount, particlesArr;
	if (chance === EXPERIMENTS.spiral) {
		particleCount = 50;
		particlesArr = initParticles(particleCount, 3, 1, false);
		drawParticle(particlesArr, context);
		setAnimation(animate, particlesArr, canvas, context);
	} else if (chance === EXPERIMENTS.explosion) {
		particleCount = 100;
		particlesArr = initExplosionParticles(particleCount, 10, 1, false);
		drawParticle(particlesArr, context);
		setAnimation(explosionAnimate, particlesArr, canvas, context);
	} else {
		particleCount = 50;
		particlesArr = initParticles(particleCount);
		drawParticle(particlesArr, context);
		setAnimation(animate, particlesArr, canvas, context);
	}
	context.fillStyle = 'rgba(0, 0, 0, 0.07)';
	context.fillRect(0, 0, canvas.width, canvas.height);
})();
