// JavaScript Document

function rotate(obj, a1, a2) {
	// X axis rotation:
	var z = obj.Z;
	obj.Z = (z * Math.cos(a1) - obj.Y * Math.sin(a1)); // update Z value of obj when rotated around X axis, using matrix conversion
	obj.Y = (z * Math.sin(a1) + obj.Y * Math.cos(a1)); // update Y value of obj when rotated around X axis, using matrix conversion
	// Y axis rotation:
	z = obj.Z;
	obj.Z = (z * Math.cos(a2) - obj.X * Math.sin(a2)); // update Z value of obj when rotated around Y axis, using matrix conversion
	obj.X = (z * Math.sin(a2) + obj.X * Math.cos(a2)); // update X value of obj when rotated around Y axis, using matrix conversion
}

function draw() { 
	stage.width = stage.width; // reset canvas
	displayList.sort(function(a, b) {return b.Z - a.Z;}); // sort displayList according to Z, in descending order (Farthest to closest)
	
	
	for (var i = 0; i < displayList.length; i++) { // loops through displayList drawing icons  
		var obj = displayList[i];
		if (depth === 0 || obj.selected) {
			if (depth == 1) { // Draw Category screen
				catSelected = obj;
				ctx.textAlign = 'center';
				ctx.font = "15px sans-serif";
				//wrapText("Category description goes here...", stage.width/12 + 30, obj.y + obj.Height()/2 + 60 + (obj.ID.split(" ").length) * 20/*Math.min(Math.ceil((obj.ID.length)/4)*30 + 15, 125)*/, stage.width/6, 25);
				
				var AppList = [];
				ctx.textAlign = 'start';
				for (var j = 0; j < appDirectory.length; j++) { // TO DO: Scroll app list, give strings names
					//console.log(appDirectory[j].category);
					if (appDirectory[j].subcategory == subcatSelected) {
						if (appDirectory[j].category == obj.ID) {
							AppList.push(appDirectory[j]);
							ctx.fillText(appDirectory[j].name, stage.width/6 + 100, obj.y + obj.Height()/2 + 25*(AppList.length + 1) - listScroll);
						}
					}
				}
				appList = AppList;
				AppList = [];
				
				ctx.clearRect(0, 0, stage.width, obj.y + obj.Height()/2);
				
				ctx.textAlign = 'center';
				ctx.font = "20px chunk-five"; // TO DO: FIX FONT
				for (var m = 0; m < obj.subcats.length; m++) {
					if (obj.subcats[m] == subcatSelected) {
						ctx.fillStyle = 'red';
					}
					wrapText(obj.subcats[m], stage.width/6 + 160 + 120*m, 50, 70, 25);
					ctx. fillStyle = 'black';
				}
				
				ctx.font = "30px chunk-five";
				wrapText(obj.ID, stage.width/12 + 30, obj.y + obj.Height()/2 + 50, stage.width/7, 25);
				ctx.drawImage(backBtn, 5, stage.height - backBtn.height); // show back button
			}
			else if (depth == 2) {
				ctx.textAlign = 'start';
				ctx.font = "15px sans-serif";
				wrapText(appSelected.info + "/n Link to Page: " + appSelected.link + "/n Last update: " + appSelected.lastupdate + "/n Development Status: " + appSelected.developmentstatus + "/n Contact or Author: " + appSelected.contact + "/n Dependency on other software: " + appSelected.dependency + "/n Freely accessible? " + appSelected.freeaccess + "/n Source: " + appSelected.sourcecode, linkX, linkY - listScroll, stage.width*0.75, 25);
				ctx.clearRect(0, 0, stage.width, obj.y + obj.Height()/2);
				ctx.textAlign = 'end';
				ctx.font = "30px chunk-five";
				wrapText(appSelected.name, stage.width*4/5, 50, stage.width/3, 25);
				ctx.drawImage(backBtn, 5, stage.height - backBtn.height); // show back button
			}
			
			if (depth === 0) {
				obj.selected = false;
			}
			var angle = 0;
			if (obj.ID == "DNA-RNA Interaction") {
				angle = Math.atan((projectX(rna.X, rna.Z)-projectX(dna.X, dna.Z))/(projectY(dna.Y, dna.Z)-projectY(rna.Y, rna.Z)));
				if ((projectY(dna.Y, dna.Z)-projectY(rna.Y, rna.Z)) >= 0) {
					angle = angle + Math.PI;
				}
			}
			if (obj.ID == "RNA- Protein Interaction") {
				angle = Math.atan((projectX(protein.X, protein.Z)-projectX(rna.X, rna.Z))/(projectY(rna.Y, rna.Z)-projectY(protein.Y, protein.Z)));
				if ((projectY(rna.Y, rna.Z)-projectY(protein.Y, protein.Z)) >= 0) {
					angle = angle + Math.PI;
				}
			}
			ctx.save();
			ctx.translate(projectX(obj.X + Xtrans, obj.Z + Ztrans), projectY(obj.Y + Ytrans, obj.Z + Ztrans));
			ctx.rotate(angle);
			obj.x = projectX(obj.X + Xtrans, obj.Z + Ztrans); // 2d position needed for hittesting
			obj.y = projectY(obj.Y + Ytrans, obj.Z + Ztrans);
			ctx.drawImage(obj.skin, projectX(obj.X + Xtrans- obj.Width()/2, obj.Z + Ztrans) - obj.x, projectY(obj.Y + Ytrans - obj.Height()/2, obj.Z + Ztrans) - obj.y, projectX(obj.Width(), obj.Z + Ztrans) - origin.X, projectY(obj.Height(), obj.Z + Ztrans) - origin.Y); // draw icon based on its properties
			ctx.restore();
		}	
	}
}

function cycleUp() {
	if (depth == 2) {
		depth = 1;
		changed = true;
	}
	else if (depth === 1) {
		subcatSelected = "General";
		distance = 500; // distance is the other way around
		prevDistance = 500;
		depth = 0;
		Xtrans = 0;
		Ytrans = 0;
		Ztrans = 0;
		listScroll = 0;
		changed = true;
	}
	else if (depth === 0) {
		if (displayList == dogma) {
			displayList = blackBox;
		}
		else if (displayList == blackBox) {
			displayList = intDesign;
		}
		else if (displayList == intDesign) {
			displayList = dogma;
		}
		distance = 500;
	}
}

function cycleDown() {
	if (depth === 0) {
		if (displayList == intDesign) {
			displayList = blackBox;
		}
		else if (displayList == dogma) {
			displayList = intDesign;
		}
		else if (displayList == blackBox) {
			displayList = dogma;
		}
		distance = 500;
	}
}

function zoomIn(obj) {
	function zoomStep() {
		Xtrans = (Xtrans - XDistance * 0.05);
		Ytrans = (Ytrans - YDistance * 0.05);
		Ztrans = (Ztrans - ZDistance * 0.05);
		distance = distance - DDistance * 0.05;
		changed = true;
		if (XDistance + Xtrans > 1 || YDistance + Ytrans > 1) {
			zLoop = setTimeout(zoomStep, 1000/100); // loop this function loop
		}
		else {
			Xtrans = -1*XDistance;
			Ytrans = -1*YDistance;
			Ztrans = -1*ZDistance;
			distance = 500;
			zooming = false;
		}
	}
	if (!obj.selected) {
		zooming = true;
		obj.selected = true;
		depth ++;
		var XDistance = obj.X + stage.width*5/12 - obj.Width()/2; // fix position
		var YDistance = obj.Y + stage.height*5/12 - obj.Height()/2;
		var ZDistance = obj.Z;
		var DDistance = distance - 500;
		zoomStep();
	}	
}