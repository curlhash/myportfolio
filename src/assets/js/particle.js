(function () {
	window.requestAnimFrame = (function(callback) {
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
			function(callback) {
				window.setTimeout(callback, 1000 / 60);
			};
	})();

	function initParticles(num) {
		var returnArr = [];
		var particleObj = {};
		for (var i = 0; i < num; i++) {
			particleObj = {
				x: canvas.width/2,
				y: canvas.height/2,
				radius: 8,
				opacity: 1
			};
			returnArr.push(particleObj)
		}
		return returnArr;
	}
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
	function animate(arr, canvas, context, startTime) {
		// update
		for(var i = 0; i < arr.length; i++) {
			var time = ((new Date()).getTime() - startTime) / 2;
			var angularVelocity = 0.01 - (i * 0.0005);
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

	var colorPallete = [convertHexColor('009ab0'), convertHexColor('82efee'), convertHexColor('cfbca6'), convertHexColor('128a08')];
	var canvas = document.getElementById('myCanvas');
	var context = canvas.getContext('2d');
	var particlesArr = initParticles(50);

//drawRectangle(myRectangle, context);
	context.fillStyle = 'rgba(0, 0, 0, 0.07)';
	context.fillRect(0, 0, canvas.width, canvas.height);
	drawParticle(particlesArr, context);




// wait one second before starting animation
	setTimeout(function() {
		var startTime = (new Date()).getTime();
		animate(particlesArr, canvas, context, startTime);
	}, 1000);
})();
