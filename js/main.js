// JavaScript Document

function showInfo() {
	var listContainer = document.createElement("div"); // Adapted from http://www.javascript-examples.net/item/an-html-list-from-a-javascript-array
	document.getElementsByTagName("body")[0].appendChild(listContainer);
	var listElement = document.createElement("ul");
	listContainer.appendChild(listElement);
	var numberOfListItems = appDirectory.length;
	for(var i = 0; i < numberOfListItems; ++i){
		var listItem = document.createElement("li");
		listItem.innerHTML = appDirectory[i].name + ', ' + appDirectory[i].freeaccess;
		listElement.appendChild(listItem);
	}
}

//*****INTEGRATION*****\\
var appDirectory = []; // Stores app database

var appSelected = null; // Stores selected app (none is default)
var catSelected = null; // Stores selected category ID (none is default)
var subcatSelected = "General"; // Stores selected subcategory ID (General is default)
var appList = []; // Stores array of apps visible. Default is none.

var gLoop, // for game loop
zLoop, // for rendering zooms
origin = {}, // stores center stage coordinates

r = 200; // radius of sphere display
distance = 500, // stores distance of viewer, defines z:scale ratio
prevDistance = 500,
offsetZ = 250, // stores z start value, i.e. where z=0 is in relation to distance
Xtrans = 0, // stores 3D translation coordinates
Ytrans = 0,
Ztrans = 0,

mouseX = 0, // stores mouse coordinates
mouseY = 0,

prevX = 0, // stores coord of mouseDown event
prevY = 0,
grab = false, // true if mouseDown
zooming = false, // true if zooming into a submenu
changed = false, // true if canvas needs redrawing
pinching = false, // fixes zoom bug
listScroll = 0; // Stores list scroll

dogma = [],
intDesign = [],
blackBox = [],
displayList = []; // stores visible icons, sorted according to c value for drawing order
depth = 0, // depth 0 is menus, depth 1 is app list, depth 2 is app screen
linkX = 80,
linkY = 220; // coordinates for hittesting and navigating to software link

var dna = new Icon("DNA Analysis & Design", dnaSkin, dogma, 0, -r, 0, 0.75, ["General", "Circuit Design", "Sequence Analysis", "Repository"]), // icon construction TO DO: Load subcategories
transcription = new Icon("DNA-RNA Interaction", dnaToRnaSkin, dogma, Math.cos(Math.PI/-6)*r*1.5/2, Math.sin(Math.PI/-6)*r*1.5/2, 0, 1, ["General", "Sequence Design", "Repository", "Primer Design"]),
rna = new Icon("RNA Analysis & Design", rnaSkin, dogma, Math.cos(Math.PI/6)*r, Math.sin(Math.PI/6)*r, 0, 0.75, ["General", "RNA Simulation", "Sequence Design"]),
translation = new Icon("RNA- Protein Interaction", rnaToProtSkin, dogma, 0, Math.sin(5*Math.PI/6)*1.5*r, 0, 1, ["General", "Ribosome Binding Site", "Optimisation", "Sequence Generation"]),
protein = new Icon("Protein Analysis & Design", protSkin, dogma, Math.cos(5*Math.PI/6)*r, Math.sin(5*Math.PI/6)*r, 0, 0.75, ["General"]),
info = new Icon("Info", infoSkin, dogma, Math.cos(-5*Math.PI/6)*1.5*r/2, Math.sin(-5*Math.PI/6)*r*1.5/2, 0, 1, []),
intDesignIcon = new Icon("Integrated Workflows", intDesignSkin, dogma, 0, 0, 0, 1, ["General"]),

language = new Icon("Language Definition", lanDefSkin, intDesign, 0, -r, 0, 0.5, ["General"]),
sim = new Icon("Cell Simulations", cellSimSkin, intDesign, 0, 0, -r, 0.5, ["General"]),
intWork = new Icon("Integrated Workflows", intWorkSkin, intDesign, 0, r, 0, 0.5, ["General"]),
circOpt = new Icon("Circuit Optimization", circOptSkin, intDesign, 0, 0, r, 0.5, ["General"]),
circDesign = new Icon("Circuit Design", circDesignSkin, intDesign, -r, 0, 0, 0.5, ["General", "Circuit Design"]),
modeling = new Icon("Modeling", modelingSkin, intDesign, r, 0, 0, 0.5, ["General", "Mathematical Modeling"]),

education = new Icon("Education", educationSkin, blackBox, 0, -r, 0, 0.5, ["General", "Games"]),
hardware = new Icon("Hardware", hardwareSkin, blackBox, 0, 0, r, 0.5, ["Hardware Driver", "Laboratory Automation", "Robotics"]),
labTools = new Icon("Lab Tools", labToolsSkin, blackBox, Math.cos(5*Math.PI/6)*r, Math.sin(5*Math.PI/6)*r, 0, 0.5, ["Calculator", "E-lab Notebook"]),
visualAnalysis = new Icon("Image Analysis", visuAnalSkin, blackBox, 0, 0, -r, 0.5, ["General"]),
//drugDisc = new Icon("Drug Discovery", drugDiscSkin, blackBox, -r, 0, 0, 0.5, ["General"]),
infoRep = new Icon("Information Repositories", infoRepSkin, blackBox, Math.cos(Math.PI/6)*r, Math.sin(Math.PI/6)*r, 0, 0.5, ["Database", "Reference", "Collaboration", "Lab Protocols", "Tools"]);

//MAIN LOOP

function mainLoop() {
	if (grab) { // if mouse is down (user is dragging sphere)
		changed = true;
		
		if (!zooming && depth === 0) {
			var rotX = ((mouseY - prevY)*Math.PI/(-2*r)); // set rotX according to drag vector relative to last frame
			var rotY = ((mouseX - prevX)*Math.PI/(-2*r)); // set rotY according to drag vector relative to last frame
			for (var i = 0; i < displayList.length; i++) { // loops through displayList mapping icons  dx, dy --> A, B
				rotate(displayList[i], rotX, rotY);
			}
		}
		else if (grab && depth > 0 && appList.length * 25 > stage.height - catSelected.y + catSelected.Height()/2 + 25) {
			listScroll += mouseY - prevY;
			if (listScroll < 0) {
				listScroll = 0;
			}
		}
		prevX = mouseX; // set prevX to current mouse X
		prevY = mouseY; // set prevY to current mouse Y
		
	}
	if (changed) {
		draw();
		changed = false;
	}
	gLoop = setTimeout(mainLoop, 1000/100); // loop the main loop
}

//START CODE

function start() { // initiator
	//stage.removeEventListener("click", start, false); // remove init listener
	
	stage.width = window.innerWidth*0.85;
	stage.height = window.innerHeight*0.85;
	
	origin.X = stage.width/2;
	origin.Y = stage.height/2;
	
	if (isMobile.any()) { // if on mobile, add touch and gesture listeners
		console.log("mobile");
		stage.addEventListener("touchstart", touchDown, false);
		page.addEventListener("touchend", touchUp, false);
		page.addEventListener("touchmove", touchMov, false);
		page.addEventListener("gesturestart", pinchStartHandler, false);
		page.addEventListener("gesturechange", pinchHandler, false);
	}
	else { // else add mouse listeners
		console.log("desktop");
		stage.addEventListener("mousedown", downHandler, false);
		page.addEventListener("mouseup", upHandler, false);
		page.addEventListener("mousemove", mouseMov, false);
		
		// http://www.javascriptkit.com/javatutors/onmousewheel.shtml
		var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel"; //FF doesn't recognize mousewheel as of FF3.x
		 
		if (stage.attachEvent) { //if IE (and Opera depending on user setting)
			//stage.attachEvent("on"+mousewheelevt, scrollHandler); // TO DO: fix ie bug
		}
		else if (stage.addEventListener) { //WC3 browsers
			stage.addEventListener(mousewheelevt, scrollHandler, false);
		}
	}
	stage.addEventListener("click", clickHandler, false); // click handler
	
	displayList = dogma;
	draw();
	
	mainLoop(); // start main loop
}

function init() {
	// entry point
	start();//stage.addEventListener("click", start, false); // listen for start signal
}

preload(images);