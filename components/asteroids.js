
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
	cabModel.gltf-model = "#cabinet";
	cabModel.camera-cube-env = "resolution:256; interval: 1000";
	cabModel.shadow = "";
	cabModel.position = "0 0 0";
	cabModel.scale = "1 1 1";
	
	myAsteroidsCabinet.appendChild(cabModel);
	
	var scrnModel = document.createElement("a-entity");
	scrnModel.id = "gamescreen";
	scrnModel.obj-model = "obj:#screen";
	scrnModel.position = "0 0 0";
	scrnModel.scale = "0.01 0.01 0.01"
	scrnModel.material = "src:#asteroids; shader:flat";
	scrnModel.canvas-updater = "";
	
	myAsteroidsCabinet.appendChild(scrnModel);
	
	document.querySelector("a-scene").appendChild(myAsteroidsCabinet);
}

function mod_createGame() {
	var game = new Game();
	game.run();
}