
function inject_arcade_asteroids() {
		
	var myBody = document.querySelector("body");
	var myAssets = document.querySelector("a-assets");
	
	var gameSrcUrl = "https://colinfizgig.github.io/Custom-Hubs-Components/components/asteroids/agame.js";
	var gameKeyMapUrl = "https://colinfizgig.github.io/Custom-Hubs-Components/components/asteroids/AGameKeymapping.js";
	
	var newLink = document.createElement("link");
	newLink.rel = "stylesheet";
	newLink.href = "https://colinfizgig.github.io/Custom-Hubs-Components/components/asteroids/style.css";
	document.querySelector("head").appendChild(newLink);
	
	var newScript = document.createElement("script");
	newScript.type = 'text/javascript';
	srcAt = document.createAttribute('src');
	srcAt.value = gameSrcUrl;
	newScript.setAttributeNode(srcAt);
	myBody.appendChild(newScript);
	
	newScript = document.createElement("script");
	newScript.type = 'text/javascript';
	srcAt = document.createAttribute('src');
	srcAt.value = gameKeyMapUrl;
	newScript.setAttributeNode(srcAt);
	myBody.appendChild(newScript);
	
	mod_createGame();

	var cabinetUrl = "https://colinfizgig.github.io/aframe_Components/asteroids/Asteroids/CabinetMerged.glb";
	//var screenUrl = "https://colinfizgig.github.io/aframe_Components/asteroids/Asteroids/Screen1.obj";
	
	var myText = document.createElement("input");
	myText.type = "text";
	myText.id = "namefield";
	document.body.insertBefore(myText, document.body.firstChild);
	
	// preload the cabinet asset in assets
	var cabinetAsset = document.createElement("a-asset-item");
	cabinetAsset.id = "cabinet";
	
	var srcAt = document.createAttribute('src');
	srcAt.value = cabinetUrl;
	cabinetAsset.setAttributeNode(srcAt);

	myAssets.appendChild(cabinetAsset);
	
	// create a template for the cabinet
	
	var myTemplate = document.createElement("template");
	myTemplate.id = "asteroids-game";
	
	// parent entity so screen goes with cabinet
	var myAsteroidsCabinet = document.createElement("a-entity");
	myAsteroidsCabinet.id = "AsteroidsCabinet";
	myAsteroidsCabinet.position = "0 0 0";
	
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
	
	var scrnModel = document.createElement("a-plane");
	scrnModel.id = "gamescreen";
	
	/*
	newAtt = document.createAttribute('src');
	newAtt.value = "#asteroids";
	scrnModel.setAttributeNode(newAtt);*/
	
	newAtt = document.createAttribute('position');
	newAtt.value = "0 0 0";
	scrnModel.setAttributeNode(newAtt);
	
	newAtt = document.createAttribute('scale');
	newAtt.value = "1 1 1";
	scrnModel.setAttributeNode(newAtt);
	
	newAtt = document.createAttribute('material');
	newAtt.value = "src:#asteroids; shader: flat";
	scrnModel.setAttributeNode(newAtt);
	
	newAtt = document.createAttribute('canvas-updater');
	newAtt.value = "";
	scrnModel.setAttributeNode(newAtt);
	
	myAsteroidsCabinet.appendChild(scrnModel);
	
	myTemplate.appendChild(myAsteroidsCabinet);
	
	//var screenAsset = document.createElement("a-asset-item");
	//screenAsset.id = "screen";
	
	//srcAt = document.createAttribute('src');
	//srcAt.value = screenUrl;
	//screenAsset.setAttributeNode(srcAt);
	//myAssets.appendChild(screenAsset);

}

inject_arcade_asteroids();

function inject_GameElements(){
	var el = document.createElement("a-entity")
	el.setAttribute("id", "game")
	el.setAttribute("networked", { template: "#asteroids-game" } )
	el.setAttribute("media-loader", {animate: false, fileIsOwned: true})
	el.object3D.position.y = 2;
	AFRAME.scenes[0].appendChild(el)
}

function mod_createGame() {
	var game = new Game();
	game.run();
}