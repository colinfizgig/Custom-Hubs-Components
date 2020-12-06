
function inject_arcade_asteroids() {
	
	var cabinetUrl = "https://colinfizgig.github.io/aframe_Components/asteroids/Asteroids/CabinetMerged.glb";
	var screenUrl = "https://colinfizgig.github.io/aframe_Components/asteroids/Asteroids/Screen1.obj";
	
	var myBody = document.querySelector("body");
	var myAssets = document.querySelector("a-assets");
	
	var cabinetAsset = document.createElement("a-asset-item");
	cabinetAsset.id = "cabinet";
	cabinetAsset.src = cabinetUrl;
	myAssets.appendChild(cabinetAsset);
	
	var screenAsset = document.createElement("a-asset-item");
	screenAsset.id = "screen";
	screenAsset.src = screenUrl;
	myAssets.appendChild(screenAsset);
	
	var gameSrcUrl = "https://colinfizgig.github.io/aframe_Components/asteroids/js/agame.js";
	var gameKeyMapUrl = "https://colinfizgig.github.io/aframe_Components/asteroids/js/AGameKeymapping.js";
	
	var newLink = document.createElement("link");
	newLink.rel = "stylesheet";
	newLink.href = "https://colinfizgig.github.io/aframe_Components/asteroids/css/style.css";
	document.querySelector("head").appendChild(newLink);
	
	var newScript = document.createElement("script");
	newScript.type = 'text/javascript';
	var srcAt = document.createAttribute('src');
	srcAt.value = gameSrcUrl;
	newScript.setAttributeNode(srcAt);
	myBody.appendChild(newScript);
	
	newScript = document.createElement("script");
	newScript.type = 'text/javascript';
	srcAt = document.createAttribute('src');
	srcAt.value = gameKeyMapUrl;
	newScript.setAttributeNode(srcAt);
	myBody.appendChild(newScript);
	
}

inject_arcade_asteroids();

function inject_GameElements(){
	var myBody = document.querySelector("body");
	
	var myAsteroidsCabinet = document.createElement("a-entity");
	myAsteroidsCabinet.id = "AsteroidsCabinet";
	myAsteroidsCabinet.position = "-3.09 0 -3";
	
	var cabModel = document.createElement("a-entity");
	var newAtt = document.createAttribute('gltf-model');
	newAtt.value = "#cabinet";
	cabModel.setAttributeNode(newAtt);
	
	newAtt = document.createAttribute('camera-cube-env');
	newAtt.value = "resolution:256; interval: 1000";
	cabModel.setAttributeNode(newAtt);

	newAtt = document.createAttribute('shadow');
	newAtt.value = "";
	cabModel.setAttributeNode(newAtt);

	newAtt = document.createAttribute('position');
	newAtt.value = "0 0 0";
	cabModel.setAttributeNode(newAtt);
	
	newAtt = document.createAttribute('scale');
	newAtt.value = "1 1 1";
	cabModel.setAttributeNode(newAtt);
	
	myAsteroidsCabinet.appendChild(cabModel);
	
	var scrnModel = document.createElement("a-entity");
	scrnModel.id = "gamescreen";
	
	newAtt = document.createAttribute('obj-model');
	newAtt.value = "obj:#screen";
	scrnModel.setAttributeNode(newAtt);
	
	newAtt = document.createAttribute('position');
	newAtt.value = "0 0 0";
	scrnModel.setAttributeNode(newAtt);
	
	newAtt = document.createAttribute('scale');
	newAtt.value = "0.01 0.01 0.01";
	scrnModel.setAttributeNode(newAtt);
	
	newAtt = document.createAttribute('material');
	newAtt.value = "src:#asteroids; shader: flat";
	scrnModel.setAttributeNode(newAtt);
	
	newAtt = document.createAttribute('canvas-updater');
	newAtt.value = "";
	scrnModel.setAttributeNode(newAtt);
	
	myAsteroidsCabinet.appendChild(scrnModel);
	
	document.querySelector("a-scene").appendChild(myAsteroidsCabinet);
}

function mod_createGame() {
	var game = new Game();
	game.run();
}