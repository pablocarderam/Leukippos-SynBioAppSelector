// JavaScript Document

//INPUT EVENT HANDLERS

function touchUp(e) { // set grab false when mouseUp
	grab = false;
}

function touchDown(e) { // start drag
	prevX = e.touches[0].pageX;
	prevY = e.touches[0].pageY;
	mouseX = e.touches[0].pageX;
	mouseY = e.touches[0].pageY;
	grab = true;
}

function touchMov(e) {
	mouseX = e.touches[0].pageX;
	mouseY = e.touches[0].pageY;
	e.preventDefault();
}

function pinchStartHandler(e) { // zoom in and out
	prevDistance = distance;
}

function pinchHandler(e) { // zoom in and out
	distance = prevDistance * e.scale;
	if (distance < 200) {
		page.removeEventListener("gesturechange", pinchHandler, false);
		distance = 500;
		prevDistance = 0;
		cycleUp();
		page.addEventListener("gestureend", pinchEndHandler, false);
	}
	if (distance > 1100) {
		page.removeEventListener("gesturechange", pinchHandler, false);
		distance = 500;
		prevDistance = 0;
		cycleDown();
		page.addEventListener("gestureend", pinchEndHandler, false);
	}
	changed = true;
}

function pinchEndHandler(e) {
	page.removeEventListener("gestureend", pinchEndHandler, false);
	page.addEventListener("gesturechange", pinchHandler, false);
}

function upHandler(e) { // set grab false when mouseUp
	grab = false;
}

function downHandler(e) { // start drag
	prevX = e.pageX;
	prevY = e.pageY;
	grab = true;
}

function mouseMov(e) { // store mouse coord
	mouseX = e.pageX;
	mouseY = e.pageY;
}

function scrollHandler(event) { // zoom in and out http://viralpatel.net/blogs/javascript-mouse-scroll-event-down-example/
	event.preventDefault();
	var delta = 0;

	if (!event) event = window.event;

	// normalize the delta
	if (event.wheelDelta) {

		// IE and Opera
		delta = event.wheelDelta / 120;

	} else if (event.detail) {

		// W3C
		delta = -event.detail;
	}

	if (depth === 0)
	{
		distance = distance - 10*delta;
		changed = true;
		
		if (distance < 200) {
			cycleUp();
		}
		if (distance > 1000) {
			cycleDown();
		}
	}
	if (depth === 1 && appList.length * 27 > stage.height - catSelected.y + catSelected.Height()/2 + 25 || depth === 2) {
		listScroll += delta*5;
		changed = true;
		if (listScroll < 0) {
			listScroll = 0;
		}
	}
}

function clickHandler(e) { // store mouse coord
	listScroll = 0;
	var rect = stage.getBoundingClientRect();
	clickX = e.clientX - rect.left;
	clickY = e.clientY - rect.top;
	if (depth > 0) {
		if (clickX < backBtn.width + 5 && clickY > stage.height - backBtn.height) { // If back button pressed
			cycleUp();
		}
		else if (depth === 2) {
			if (clickX > linkX && clickY > linkY) {
				window.open(appSelected.link);
			}
		}
		else if (depth === 1 && clickX > stage.width/6 + 100) { // If subcategory tab or app from list clicked
			if (clickY < catSelected.y + catSelected.Height()/2 + 25) { // If subcategory tab clicked
				var tabNumber = Math.floor((clickX-(stage.width/6 + 100))/120);
				if (catSelected.subcats[tabNumber] !== undefined) {
					subcatSelected = catSelected.subcats[tabNumber];
					listScroll = 0;
					changed = true;
				}
			}
			else { // If app from list clicked
				var rowNumber = Math.floor((clickY+listScroll-(catSelected.y + catSelected.Height()/2 + 25))/25);
				if (appList[rowNumber] !== undefined) {
					appSelected = appList[rowNumber];
					depth ++;
					changed = true;
				}
				
			}
		}
	}
	else {
		for (var i = displayList.length-1; i > -1; i--) {
			if (displayList[i].hitTest(clickX, clickY)) {
				switch (displayList[i].ID) { // Three cases that are not categories
					case "Info":
						alert("The SynbioAppSelector is an intuitive-to-use, all-in-one collection of software applications, tutorials, and resources related to synthetic biology. Navigate the menus by dragging and scrolling up and down, click on the icons to view a list of software belonging to that category.");
						break;
					case "intDes":
						break;
					default:
						zoomIn(displayList[i]);
						break;
				}
				break;
			}
		}
	}
}

window.onresize = function(e) {
	stage.width = window.innerWidth*0.85;
	stage.height = window.innerHeight*0.85;
	origin.X = stage.width/2;
	origin.Y = stage.height/2;
	Xtrans = obj.X + stage.width*5/12 - obj.Width()/2; // fix position
	Ytrans = obj.Y + stage.height*5/12 - obj.Height()/2;
};

window.onorientationchange = function(e) {
	stage.width = window.innerWidth*0.85;
	stage.height = window.innerHeight*0.85;
	origin.X = stage.width/2;
	origin.Y = stage.height/2;
	Xtrans = obj.X + stage.width*5/12 - obj.Width()/2; // fix position
	Ytrans = obj.Y + stage.height*5/12 - obj.Height()/2;
};