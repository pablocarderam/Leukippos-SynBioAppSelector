// JavaScript Document

var page = document.getElementById("page"), // get div element covering whole page, for mouse and touch events
stage = document.getElementById("stage"), // get canvas element and context
ctx = stage.getContext("2d");

//insert assets here
var dnaSkin = new Image(),
rnaSkin = new Image(),
dnaToRnaSkin = new Image(),
protSkin = new Image(),
rnaToProtSkin = new Image(),
infoSkin = new Image(),
intDesignSkin = new Image(),
cellSimSkin = new Image(),
lanDefSkin = new Image(),
intWorkSkin = new Image(),
circOptSkin = new Image(),
circDesignSkin = new Image(),
modelingSkin = new Image(),
educationSkin = new Image(),
hardwareSkin = new Image(),
labToolsSkin = new Image(),
visuAnalSkin = new Image(),
drugDiscSkin = new Image(),
infoRepSkin = new Image(),
backBtn = new Image();

//and here
dnaSkin.fuente = "Assets/images/DNA.png";
rnaSkin.fuente = "Assets/images/RNA.png";
dnaToRnaSkin.fuente = "Assets/images/Arrow.png";
protSkin.fuente = "Assets/images/Prot.png";
rnaToProtSkin.fuente = "Assets/images/Arrow.png";
infoSkin.fuente = "Assets/images/Info.png";
intDesignSkin.fuente = "Assets/images/IntDesign.png";
cellSimSkin.fuente = "Assets/images/CellSim.png";
lanDefSkin.fuente = "Assets/images/LanDef.png";
intWorkSkin.fuente = "Assets/images/IntWork.png";
circOptSkin.fuente = "Assets/images/CircOpt.png";
circDesignSkin.fuente = "Assets/images/CircDes.png";
modelingSkin.fuente = "Assets/images/Modeling.png";
educationSkin.fuente = "Assets/images/Education.png";
hardwareSkin.fuente = "Assets/images/Hardware.png";
labToolsSkin.fuente = "Assets/images/LabTools.png";
visuAnalSkin.fuente = "Assets/images/Visual.png";
drugDiscSkin.fuente = "Assets/images/Drug.png";
infoRepSkin.fuente = "Assets/images/InfoRep.png";
backBtn.fuente = "Assets/images/Back.png";

var images = [dnaSkin, dnaToRnaSkin, rnaSkin, rnaToProtSkin, protSkin, infoSkin, intDesignSkin, cellSimSkin, lanDefSkin, intWorkSkin, circOptSkin, circDesignSkin, modelingSkin, educationSkin, hardwareSkin, labToolsSkin, visuAnalSkin, drugDiscSkin, infoRepSkin, backBtn]; //and here

/*******PRELOADER*******/
function preload(assets) {
	ctx.font = "20px chunk-five"; 
	ctx.fillText("...Synthetizing Biology...", 0, 100); //show preloader
	
	window.onload = function () { // Loads app database adapted from http://www.mikeball.us/blog/using-google-spreadsheets-and-tabletop-js-as-a-web-application-back-end
		Tabletop.init({
			key: '0AihSbOSqv8G9dDFJeGRxMVBQU1pQdWJha20zbU9JTFE',
			callback: function(data, tabletop) {
				appDirectory = data;
				//showInfo();
			},
			simpleSheet: true 
		});
	};
	
	var numLoaded = 0;
	var total = assets.length;
	function onload() {
		numLoaded ++;
		if (numLoaded == total) {
			stage.width = stage.width;
			init();
		}
	}
	for (var i = 0; i < total; i++) {
		assets[i].onload = onload;
		assets[i].src = assets[i].fuente;
		console.log(i+1 + " / " + total);
	}
}