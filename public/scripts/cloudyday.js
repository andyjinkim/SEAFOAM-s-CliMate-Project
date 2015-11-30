
var weatherAnimate = {
  cloudyDay: function(){
    var engine = new CloudyDay({
      // particleCount: 50,
      image: backgroundImage,
      // fps: 33
    }, document.getElementById('canvas'));
    console.log(this)
  }
}

//SET BACKGROUND IMAGE TO CANVAS
var backgroundImage = new Image();
backgroundImage.src = "./winter_day.jpg"
backgroundImage.crossOrigin = 'anonymous';

//CloudyDay Object Constructor
function CloudyDay(options, canvas) {

	if (this === window) { //if *this* is the window object, start over with a *new* object
		return new CloudyDay(options, canvas);
	}

	this.img = options.image;
	var defaults = {
		// particleCount: 30,
		// maxVelocity: 2,
		opacity: 1,
		blur: 10,
		crop: [0, 0, this.img.naturalWidth, this.img.naturalHeight],
		enableSizeChange: true,
		parentElement: document.getElementsByTagName('body')[0],
		fps: 33,//can use to pass to function in particle functions
		width: this.img.clientWidth,
		height: this.img.clientHeight,
		position: 'absolute',
		top: 0,
		left: 0
	};

	// add the defaults to options
	for (var option in defaults) {
		if (typeof options[option] === 'undefined') {
			options[option] = defaults[option];
		}
	}
	this.options = options;

	// prepare canvas elements
	this.canvas = canvas || this.prepareCanvas();
	this.prepareBackground();
	this.prepareGlass();

  //run Cloudy Day render
  // this.cloudyDayRender();

	// set polyfill of requestAnimationFrame
	this.setRequestAnimFrame();

	console.log(this)
}

// /**
//  * Create the main canvas over a given element
//  * @returns HTMLElement the canvas
//  */
CloudyDay.prototype.prepareCanvas = function() {
	var canvas = document.createElement('canvas');
	canvas.style.position = this.options.position;
	canvas.style.top = this.options.top;
	canvas.style.left = this.options.left;
	canvas.width = this.options.width;
	canvas.height = this.options.height;
	this.options.parentElement.appendChild(canvas);
	if (this.options.enableSizeChange) {
		this.setResizeHandler();
	}
	return canvas;
};


CloudyDay.prototype.setResizeHandler = function() {
	// use setInterval if oneresize event already use by other.
	if (window.onresize !== null) {
		window.setInterval(this.checkSize.bind(this), 100);
	} else {
		window.onresize = this.checkSize.bind(this);
		window.onorientationchange = this.checkSize.bind(this);
	}
};

// /**
//  * Periodically check the size of the underlying element
//  */
CloudyDay.prototype.checkSize = function() {
	var clientWidth = this.img.clientWidth;
	var clientHeight = this.img.clientHeight;
	var clientOffsetLeft = this.img.offsetLeft;
	var clientOffsetTop = this.img.offsetTop;
	var canvasWidth = this.canvas.width;
	var canvasHeight = this.canvas.height;
	var canvasOffsetLeft = this.canvas.offsetLeft;
	var canvasOffsetTop = this.canvas.offsetTop;

	if (canvasWidth !== clientWidth || canvasHeight !== clientHeight) {
		this.canvas.width = clientWidth;
		this.canvas.height = clientHeight;
		this.prepareBackground();
		this.glass.width = this.canvas.width;
		this.glass.height = this.canvas.height;
		this.prepareReflections();
	}
	if (canvasOffsetLeft !== clientOffsetLeft || canvasOffsetTop !== clientOffsetTop) {
		this.canvas.offsetLeft = clientOffsetLeft;
		this.canvas.offsetTop = clientOffsetTop;
	}
};

//Polyfill for the requestAnimationFrame on other browsers
CloudyDay.prototype.setRequestAnimFrame = function() {
 var fps = this.options.fps;
 window.requestAnimFrame = (function() {
   return window.requestAnimationFrame ||
     window.webkitRequestAnimationFrame ||
     window.mozRequestAnimationFrame ||
     function(callback) {
       window.setTimeout(callback, 1000 / fps);
     };
 })();
};

//Create the glass canvas
CloudyDay.prototype.prepareGlass = function() {
 this.glass = document.createElement('canvas');
 this.glass.width = this.canvas.width;
 this.glass.height = this.canvas.height;
 this.context = this.glass.getContext('2d');


};

/**
 * Resizes canvas, draws original image and applies blurring algorithm.
 */
CloudyDay.prototype.prepareBackground = function() {
	this.background = document.createElement('canvas');
	this.background.width = this.canvas.width;
	this.background.height = this.canvas.height;

	this.clearbackground = document.createElement('canvas');
	this.clearbackground.width = this.canvas.width;
	this.clearbackground.height = this.canvas.height;

	var context = this.background.getContext('2d');
	context.clearRect(0, 0, this.canvas.width, this.canvas.height);

	context.drawImage(this.img, this.options.crop[0], this.options.crop[1], this.options.crop[2], this.options.crop[3], 0, 0, this.canvas.width, this.canvas.height);

	context = this.clearbackground.getContext('2d');
	context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	context.drawImage(this.img, this.options.crop[0], this.options.crop[1], this.options.crop[2], this.options.crop[3], 0, 0, this.canvas.width, this.canvas.height);

	if (!isNaN(this.options.blur) && this.options.blur >= 1) {
		this.stackBlurCanvasRGB(this.canvas.width, this.canvas.height, this.options.blur);
	}
};

/**
 * Implements the Stack Blur Algorithm (@see http://www.quasimondo.com/StackBlurForCanvas/StackBlurDemo.html).
 * param width width of the canvas
 * param height height of the canvas
 * param radius blur radius
 */
CloudyDay.prototype.stackBlurCanvasRGB = function(width, height, radius) {

	var shgTable = [
		[0, 9],
		[1, 11],
		[2, 12],
		[3, 13],
		[5, 14],
		[7, 15],
		[11, 16],
		[15, 17],
		[22, 18],
		[31, 19],
		[45, 20],
		[63, 21],
		[90, 22],
		[127, 23],
		[181, 24]
	];

	var mulTable = [
		512, 512, 456, 512, 328, 456, 335, 512, 405, 328, 271, 456, 388, 335, 292, 512,
		454, 405, 364, 328, 298, 271, 496, 456, 420, 388, 360, 335, 312, 292, 273, 512,
		482, 454, 428, 405, 383, 364, 345, 328, 312, 298, 284, 271, 259, 496, 475, 456,
		437, 420, 404, 388, 374, 360, 347, 335, 323, 312, 302, 292, 282, 273, 265, 512,
		497, 482, 468, 454, 441, 428, 417, 405, 394, 383, 373, 364, 354, 345, 337, 328,
		320, 312, 305, 298, 291, 284, 278, 271, 265, 259, 507, 496, 485, 475, 465, 456,
		446, 437, 428, 420, 412, 404, 396, 388, 381, 374, 367, 360, 354, 347, 341, 335,
		329, 323, 318, 312, 307, 302, 297, 292, 287, 282, 278, 273, 269, 265, 261, 512,
		505, 497, 489, 482, 475, 468, 461, 454, 447, 441, 435, 428, 422, 417, 411, 405,
		399, 394, 389, 383, 378, 373, 368, 364, 359, 354, 350, 345, 341, 337, 332, 328,
		324, 320, 316, 312, 309, 305, 301, 298, 294, 291, 287, 284, 281, 278, 274, 271,
		268, 265, 262, 259, 257, 507, 501, 496, 491, 485, 480, 475, 470, 465, 460, 456,
		451, 446, 442, 437, 433, 428, 424, 420, 416, 412, 408, 404, 400, 396, 392, 388,
		385, 381, 377, 374, 370, 367, 363, 360, 357, 354, 350, 347, 344, 341, 338, 335,
		332, 329, 326, 323, 320, 318, 315, 312, 310, 307, 304, 302, 299, 297, 294, 292,
		289, 287, 285, 282, 280, 278, 275, 273, 271, 269, 267, 265, 263, 261, 259
	];

	radius |= 0;

	var context = this.background.getContext('2d');
	var imageData = context.getImageData(0, 0, width, height);
	var pixels = imageData.data;
	var x,
		y,
		i,
		p,
		yp,
		yi,
		yw,
		rSum,
		gSum,
		bSum,
		rOutSum,
		gOutSum,
		bOutSum,
		rInSum,
		gInSum,
		bInSum,
		pr,
		pg,
		pb,
		rbs;
	var radiusPlus1 = radius + 1;
	var sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2;

	var stackStart = new BlurStack();
	var stackEnd = new BlurStack();
	var stack = stackStart;
	for (i = 1; i < 2 * radius + 1; i++) {
		stack = stack.next = new BlurStack();
		if (i === radiusPlus1) {
			stackEnd = stack;
		}
	}
	stack.next = stackStart;
	var stackIn = null;
	var stackOut = null;

	yw = yi = 0;

	var mulSum = mulTable[radius];
	var shgSum;
	for (var ssi = 0; ssi < shgTable.length; ++ssi) {
		if (radius <= shgTable[ssi][0]) {
			shgSum = shgTable[ssi - 1][1];
			break;
		}
	}

	for (y = 0; y < height; y++) {
		rInSum = gInSum = bInSum = rSum = gSum = bSum = 0;

		rOutSum = radiusPlus1 * (pr = pixels[yi]);
		gOutSum = radiusPlus1 * (pg = pixels[yi + 1]);
		bOutSum = radiusPlus1 * (pb = pixels[yi + 2]);

		rSum += sumFactor * pr;
		gSum += sumFactor * pg;
		bSum += sumFactor * pb;

		stack = stackStart;

		for (i = 0; i < radiusPlus1; i++) {
			stack.r = pr;
			stack.g = pg;
			stack.b = pb;
			stack = stack.next;
		}

		for (i = 1; i < radiusPlus1; i++) {
			p = yi + ((width - 1 < i ? width - 1 : i) << 2);
			rSum += (stack.r = (pr = pixels[p])) * (rbs = radiusPlus1 - i);
			gSum += (stack.g = (pg = pixels[p + 1])) * rbs;
			bSum += (stack.b = (pb = pixels[p + 2])) * rbs;

			rInSum += pr;
			gInSum += pg;
			bInSum += pb;

			stack = stack.next;
		}

		stackIn = stackStart;
		stackOut = stackEnd;
		for (x = 0; x < width; x++) {
			pixels[yi] = (rSum * mulSum) >> shgSum;
			pixels[yi + 1] = (gSum * mulSum) >> shgSum;
			pixels[yi + 2] = (bSum * mulSum) >> shgSum;

			rSum -= rOutSum;
			gSum -= gOutSum;
			bSum -= bOutSum;

			rOutSum -= stackIn.r;
			gOutSum -= stackIn.g;
			bOutSum -= stackIn.b;

			p = (yw + ((p = x + radius + 1) < (width - 1) ? p : (width - 1))) << 2;

			rInSum += (stackIn.r = pixels[p]);
			gInSum += (stackIn.g = pixels[p + 1]);
			bInSum += (stackIn.b = pixels[p + 2]);

			rSum += rInSum;
			gSum += gInSum;
			bSum += bInSum;

			stackIn = stackIn.next;

			rOutSum += (pr = stackOut.r);
			gOutSum += (pg = stackOut.g);
			bOutSum += (pb = stackOut.b);

			rInSum -= pr;
			gInSum -= pg;
			bInSum -= pb;

			stackOut = stackOut.next;

			yi += 4;
		}
		yw += width;
	}

	for (x = 0; x < width; x++) {
		gInSum = bInSum = rInSum = gSum = bSum = rSum = 0;

		yi = x << 2;
		rOutSum = radiusPlus1 * (pr = pixels[yi]);
		gOutSum = radiusPlus1 * (pg = pixels[yi + 1]);
		bOutSum = radiusPlus1 * (pb = pixels[yi + 2]);

		rSum += sumFactor * pr;
		gSum += sumFactor * pg;
		bSum += sumFactor * pb;

		stack = stackStart;

		for (i = 0; i < radiusPlus1; i++) {
			stack.r = pr;
			stack.g = pg;
			stack.b = pb;
			stack = stack.next;
		}

		yp = width;

		for (i = 1; i < radiusPlus1; i++) {
			yi = (yp + x) << 2;

			rSum += (stack.r = (pr = pixels[yi])) * (rbs = radiusPlus1 - i);
			gSum += (stack.g = (pg = pixels[yi + 1])) * rbs;
			bSum += (stack.b = (pb = pixels[yi + 2])) * rbs;

			rInSum += pr;
			gInSum += pg;
			bInSum += pb;

			stack = stack.next;

			if (i < (height - 1)) {
				yp += width;
			}
		}

		yi = x;
		stackIn = stackStart;
		stackOut = stackEnd;
		for (y = 0; y < height; y++) {
			p = yi << 2;
			pixels[p] = (rSum * mulSum) >> shgSum;
			pixels[p + 1] = (gSum * mulSum) >> shgSum;
			pixels[p + 2] = (bSum * mulSum) >> shgSum;

			rSum -= rOutSum;
			gSum -= gOutSum;
			bSum -= bOutSum;

			rOutSum -= stackIn.r;
			gOutSum -= stackIn.g;
			bOutSum -= stackIn.b;

			p = (x + (((p = y + radiusPlus1) < (height - 1) ? p : (height - 1)) * width)) << 2;

			rSum += (rInSum += (stackIn.r = pixels[p]));
			gSum += (gInSum += (stackIn.g = pixels[p + 1]));
			bSum += (bInSum += (stackIn.b = pixels[p + 2]));

			stackIn = stackIn.next;

			rOutSum += (pr = stackOut.r);
			gOutSum += (pg = stackOut.g);
			bOutSum += (pb = stackOut.b);

			rInSum -= pr;
			gInSum -= pg;
			bInSum -= pb;

			stackOut = stackOut.next;

			yi += width;
		}
	}

	context.putImageData(imageData, 0, 0);

};

/**
 * Defines a new helper object for Stack Blur Algorithm.
 */
function BlurStack() {
	this.r = 0;
	this.g = 0;
	this.b = 0;
	this.next = null;
}

//
// CloudyDay.prototype.cloudyDayRender = function(){
//     // Create an array to store our particles
//     var particles = [];
//
//     // The amount of particles to render
//     var particleCount = this.options.particleCount;
//     console.log(particleCount)
//     // The maximum velocity in each direction
//     var maxVelocity = this.options.maxVelocity;
//
//     // The target frames per second (how often do we want to update / redraw the scene)
//     var fps = this.options.fps;
//
//     // Set the dimensions of the canvas as variables so they can be used.
//     var canvasWidth = this.options.width;
//     var canvasHeight = this.options.height;
//
//     // Create an image object (only need one instance)
//     var imageObj = new Image();
//
//
//     // Once the image has been downloaded then set the image on all of the particles
//     imageObj.onload = function() {
//         particles.forEach(function(particle) {
//                 particle.setImage(imageObj);
//
//         });
//     };
//
//     // Once the callback is arranged then set the source of the image
//     imageObj.src = "http://www.blog.jonnycornwell.com/wp-content/uploads/2012/07/Smoke10.png";
//
//     // A function to create a particle object.
//     function Particle(context) {
//
//         // Set the initial x and y positions
//         this.x = 0;
//         this.y = 0;
//
//         // Set the initial velocity
//         this.xVelocity = 0;
//         this.yVelocity = 0;
//
//         // Set the radius
//         this.radius = 5;
//
//         // Store the context which will be used to draw the particle
//         this.context = context;
//
//
//         // The function to draw the particle on the canvas.
//         this.draw = function() {
//
//             // If an image is set draw it
//             if(this.image){
//                 this.context.drawImage(this.image, this.x-128, this.y-128);
//                 // If the image is being rendered do not draw the circle so break out of the draw function
//                 return;
//             }
//             // Draw the circle as before, with the addition of using the position and the radius from this object.
//             this.context.beginPath();
//             this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
//             this.context.fillStyle = "rgba(255, 255, 255, 0)";
//             this.context.fill();
//             this.context.closePath();
//         };
//
//         // Update the particle.
//         this.update = function() {
//             // Update the position of the particle with the addition of the velocity.
//             this.x += this.xVelocity;
//             this.y += this.yVelocity;
//
//             // Check if has crossed the right edge
//             if (this.x >= canvasWidth) {
//                 this.xVelocity = -this.xVelocity;
//                 this.x = canvasWidth;
//             }
//             // Check if has crossed the left edge
//             else if (this.x <= 0) {
//                 this.xVelocity = -this.xVelocity;
//                 this.x = 0;
//             }
//
//             // Check if has crossed the bottom edge
//             if (this.y >= canvasHeight) {
//                 this.yVelocity = -this.yVelocity;
//                 this.y = canvasHeight;
//             }
//
//             // Check if has crossed the top edge
//             else if (this.y <= 0) {
//                 this.yVelocity = -this.yVelocity;
//                 this.y = 0;
//             }
//         };
//
//         // A function to set the position of the particle.
//         this.setPosition = function(x, y) {
//             this.x = x;
//             this.y = y;
//         };
//
//         // Function to set the velocity.
//         this.setVelocity = function(x, y) {
//             this.xVelocity = x;
//             this.yVelocity = y;
//         };
//
//         this.setImage = function(image){
//             this.image = image;
//         }
//     }
//
//     // A function to generate a random number between 2 values
//     function generateRandom(min, max){
//         return Math.random() * (max - min) + min;
//     }
//
//     // The canvas context if it is defined.
//     var context;
//
//     // Initialise the scene and set the context if possible
//     function init() {
//         var canvas = document.getElementById('canvas');
//         if (canvas.getContext) {
//
//             // Set the context variable so it can be re-used
//             context = canvas.getContext('2d');
//
//             // Create the particles and set their initial positions and velocities
//             for(var i=0; i < particleCount; ++i){
//                 var particle = new Particle(context);
//
//                 // Set the position to be inside the canvas bounds
//                 particle.setPosition(generateRandom(0, canvasWidth), generateRandom(0, canvasHeight));
//
//                 // Set the initial velocity to be either random and either negative or positive
//                 particle.setVelocity(generateRandom(-maxVelocity, maxVelocity), generateRandom(-maxVelocity, maxVelocity));
//                 particles.push(particle);
//             }
//         }
//         else {
//             alert("Please use a modern browser");
//         }
//     }
//
//     // The function to draw the scene
//     // Add background image here
//     function draw() {
//         // Clear the drawing surface and fill it with a black background
//         // context.fillStyle = "rgba(0, 0, 0, 0.5)";
//         // context.fillRect(0, 0, 600, 400);
//
//         // Go through all of the particles and draw them.
//         particles.forEach(function(particle) {
//             particle.draw();
//         });
//     }
//
//     // Update the scene
//     function update() {
//         particles.forEach(function(particle) {
//             particle.update();
//         })
//     }
//
// 	//INITIALIZE THE SCENE
// 	init()
//
//     // If the context is set then we can draw the scene (if not then the browser does not support canvas)
//     if (context) {
//         setInterval(function() {
//             // Update the scene before drawing
//             update();
//
//             // Draw the scene
//             draw();
//         }, 1000 / fps);
//     }
// }
