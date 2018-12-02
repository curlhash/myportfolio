(function () {
	var prom1,prom2;
	window.requestAnimFrame = (function(callback) {
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
			function(callback) {
				prom1 = setTimeout(callback, 1000 / 60);
			};
	})();

	// random selection of the experiment
	var EXPERIMENTS = {
		spiral: 'SPIRAL',
		explosion: 'EXPLOSION'
	};
	var arbitor = false;
	var DECIDING_ARR = ['SPIRAL', 'EXPLOSION'];
	var EXPERIMENT_COUNT = 2;
	var settings = {
		spiral: [
			{
				omega: 0.09,
				isOmegaResRandom: true,
				omegaResistance: 0.00001,
				radiusResistance: 20,
				thetaResistanceX: 0.02,
				thetaResistanceY: 0.02,
				particleRad: 3,
				particleOp: 1,
				fillStyleOp: 0.07,
				particleCount: 100
			},
			{
				omega: 0.09,
				isOmegaResRandom: false,
				omegaResistance: 0.00001,
				radiusResistance: 20,
				thetaResistanceX: 0.02,
				thetaResistanceY: 0.02,
				particleRad: 3,
				particleOp: 1,
				fillStyleOp: 0.07,
				particleCount: 100
			},
			{
				omega: 0.09,
				isOmegaResRandom: false,
				omegaResistance: 5,
				radiusResistance: 10,
				thetaResistanceX: 0.02,
				thetaResistanceY: 0.02,
				particleRad: 3,
				particleOp: 1,
				fillStyleOp: 0.07,
				particleCount: 60
			},
			{
				omega: 0.009,
				isOmegaResRandom: false,
				omegaResistance: 0.001,
				radiusResistance: 20,
				thetaResistanceX: 0.02,
				thetaResistanceY: 0.02,
				particleRad: 3,
				particleOp: 1,
				fillStyleOp: 0.07,
				particleCount: 100
			},
			{
				omega: 0.009,
				isOmegaResRandom: false,
				omegaResistance: 0.001,
				radiusResistance: 20,
				thetaResistanceX: 0.05,
				thetaResistanceY: 0.01,
				particleRad: 3,
				particleOp: 1,
				fillStyleOp: 0.07,
				particleCount: 100
			},
			{
				omega: 0.05,
				isOmegaResRandom: false,
				omegaResistance: 0.00009,
				radiusResistance: 20,
				thetaResistanceX: 0.02,
				thetaResistanceY: 0.02,
				particleRad: 3,
				particleOp: 1,
				fillStyleOp: 0.07,
				particleCount: 100
			},
			{
				omega: 0.09,
				isOmegaResRandom: false,
				omegaResistance: 0.001,
				radiusResistance: 20,
				thetaResistanceX: 0.02,
				thetaResistanceY: 0.02,
				particleRad: 3,
				particleOp: 1,
				fillStyleOp: 0.07,
				particleCount: 100
			},
			{
				omega: 0.09,
				isOmegaResRandom: false,
				omegaResistance: 0.005,
				radiusResistance: 20,
				thetaResistanceX: 0.02,
				thetaResistanceY: 0.02,
				particleRad: 3,
				particleOp: 1,
				fillStyleOp: 0.07,
				particleCount: 100
			}
		]
	};
	var colorPaletteArr = ['c96332', 'ec9e14', 'f1e4da', '00a2e4'];
	var colorPallete = generateColorPallete(colorPaletteArr);
	var chance = DECIDING_ARR[Math.floor(Math.random() * EXPERIMENT_COUNT)];
	var settingIndex = Math.floor(Math.random() * settings.spiral.length);
	var canvas = document.getElementById('myCanvas');
	var context = canvas.getContext('2d');

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
		if (!arbitor) {
			return;
		}
		// update
		for(var i = 0; i < arr.length; i++) {
			var time = ((new Date()).getTime() - startTime) / 2;
			var angularVelocity;
			if (settings.spiral[settingIndex].isOmegaResRandom) {
				angularVelocity = settings.spiral[settingIndex].omega - (i * Math.random() * settings.spiral[settingIndex].omegaResistance);
			} else {
				angularVelocity = settings.spiral[settingIndex].omega - (i * settings.spiral[settingIndex].omegaResistance);
			}
			var circleRadius = canvas.width/2 - (i * settings.spiral[settingIndex].radiusResistance);
			var centerX = canvas.width / 2;
			var centerY = canvas.height / 2;
			var theta = time * angularVelocity;
			var nextX = circleRadius * Math.cos(theta - (i * settings.spiral[settingIndex].thetaResistanceX)) + centerX;
			var nextY = circleRadius * Math.sin(theta - (i * settings.spiral[settingIndex].thetaResistanceY)) + centerY;
			arr[i].x = nextX;
			arr[i].y = nextY;
			//arr[i].radius = Math.floor(Math.random() * 10) + 3;
		}

		context.fillStyle = 'rgba(0, 0, 0, ' + settings.spiral[settingIndex].fillStyleOp + ')';
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
		prom2 = setTimeout(function() {
			arbitor = true;
			var startTime = (new Date()).getTime();
			callback(particlesArr, canvas, context, startTime);
		}, 1000);
	}

	function updateSettingForm (obj) {
		document.getElementById('omega').value = obj.omega;
		document.getElementById('isOmegaResRandom').value = obj.isOmegaResRandom;
		document.getElementById('omegaResistance').value = obj.omegaResistance;
		document.getElementById('radiusResistance').value = obj.radiusResistance;
		document.getElementById('thetaResistanceX').value = obj.thetaResistanceX;
		document.getElementById('thetaResistanceY').value = obj.thetaResistanceY;
		document.getElementById('particleRad').value = obj.particleRad;
		document.getElementById('particleOp').value = obj.particleOp;
		document.getElementById('fillStyleOp').value = obj.fillStyleOp;
		document.getElementById('particleCount').value = obj.particleCount;
	}

	function killPromises () {
		clearTimeout(prom1);
		clearTimeout(prom2);
	}

	function initExperiment () {
		context.fillStyle = 'rgba(0, 0, 0)';
		context.fillRect(0, 0, canvas.width, canvas.height);
		var particleCount, particlesArr;
		if (chance === EXPERIMENTS.spiral) {
			updateSettingForm(settings.spiral[settingIndex]);
			particleCount = settings.spiral[settingIndex].particleCount;
			particlesArr = initParticles(particleCount, settings.spiral[settingIndex].particleRad, settings.spiral[settingIndex].particleOp, false);
			drawParticle(particlesArr, context);
			setAnimation(animate, particlesArr, canvas, context);
		} else if (chance === EXPERIMENTS.explosion) {
			particleCount = 100;
			particlesArr = initExplosionParticles(particleCount, 10, 1, false);
			drawParticle(particlesArr, context);
			setAnimation(explosionAnimate, particlesArr, canvas, context);
		}
	}

	window.changeSetting = function () {
		var returnObj = {
			omega: Number(document.getElementById('omega').value) || 0,
			isOmegaResRandom: Number(document.getElementById('isOmegaResRandom').value) || 0,
			omegaResistance: Number(document.getElementById('omegaResistance').value) || 0,
			radiusResistance: Number(document.getElementById('radiusResistance').value) || 0,
			thetaResistanceX: Number(document.getElementById('thetaResistanceX').value) || 0,
			thetaResistanceY: Number(document.getElementById('thetaResistanceY').value) || 0,
			particleRad: Number(document.getElementById('particleRad').value) || 0,
			particleOp: Number(document.getElementById('particleOp').value) || 0,
			fillStyleOp: Number(document.getElementById('fillStyleOp').value) || 0,
			particleCount: Number(document.getElementById('particleCount').value) || 0
		};
		colorPallete = generateColorPallete(colorPaletteArr);
		settings = {
			spiral: [returnObj]
		};
		settingIndex = 0;
		killPromises();
		arbitor = false;
		setTimeout(function () {
			initExperiment();
		}, 1000);
	};
	window.addColor = function () {
		colorPaletteArr.push(document.getElementById('favcolor') && document.getElementById('favcolor').value || '#ffffff');
		document.getElementById('fcolor').innerHTML += ',' + colorPaletteArr[colorPaletteArr.length - 1];
	};
	window.clearColor = function () {
		colorPaletteArr = [];
		document.getElementById('fcolor').innerHTML = '';
		document.getElementById('favcolor').valueOf = '';
	};
	function debugBase64(base64URL){
		var win = window.open();
		win.document.write('<img src="' + base64URL  + '">');
	}
	window.downloadImg = function () {
		debugBase64(canvas.toDataURL('image/png', 1.0));
	};
	initExperiment();
})();
