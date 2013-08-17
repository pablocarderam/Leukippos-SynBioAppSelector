// JavaScript Document

function getDistance(x1, y1, x2, y2) { // find distance between two points
	var dist = Math.round(Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)));
	return dist;
}

function getMousePos(evt) { // http://www.html5canvastutorials.com/advanced/html5-canvas-mouse-coordinates/
	var rect = stage.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}

function projectX(x, z) {
	return (distance*x/(z + r + offsetZ)) + origin.X; // returns screen x value from 3d x and z values. Analogous to local3DToGobal2D
}
function projectY(y, z) { // returns screen y value from 3d y and z values. Analogous to local3DToGoba2D
	return (distance*y/(z + r + offsetZ)) + origin.Y;
}

function wrapText(text, x, y, maxWidth, lineHeight) { // http://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial/
	var paragraphs = text.split('/n');
	for (var p = 0; p < paragraphs.length; p++) {
		var words = paragraphs[p].split(' ');
		var line = '';
		for(var n = 0; n < words.length; n++) {
			var testLine = line + words[n] + ' ';
			var metrics = ctx.measureText(testLine);
			var testWidth = metrics.width;
			if(testWidth > maxWidth && line.length > 0) {
				ctx.fillText(line, x, y);
				line = words[n] + ' ';
				y += lineHeight;
			}
			else {
				line = testLine;
			}
		}
		ctx.fillText(line, x, y);
		y += lineHeight;
	}
}

function Icon(ID, Img, menu, X, Y, Z, scale, subcats) { // Class constructor for icons
	this.ID = ID; // way of identifying which icon has been clicked, comparisons, etc.
	this.skin = Img; // stores image file of icon
	this.x = 0; // stores 2d coordinates of icon
	this.y = 0;
	this.scale = scale; // stores icon scale, 1 being the largest (and closest to the viewer)
	this.Width = function () { return this.skin.width*this.scale;}; // returns width of icon skin (regardless of z value, relative to scale)
	this.Height = function() { return this.skin.height*this.scale;};  // returns height of icon skin (regardless of z value, relative to scale) 
	
	this.X = X; // stores 3D start coordinates of icon 
	this.Y = Y;
	this.Z = Z; // farther away is positive
	this.hitRadius = 50; // sets hit test area
	this.hitTest = function (x, y) { if (getDistance(this.x, this.y, x, y) < this.hitRadius) { return true;} else { return false;}}; // tests against stage coordinates
	this.selected = false; // true if icon menu called
	
	this.subcats = subcats; // Array of included subcategories
	
	menu.push(this); // add to display list
}

var isMobile = { // returns true if mobile platform. Snippet from http://www.abeautifulsite.net/blog/2011/11/detecting-mobile-devices-with-javascript/
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};