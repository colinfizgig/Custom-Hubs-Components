
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
	
	myTemplate.content.appendChild(myAsteroidsCabinet);
	myAssets.appendChild(myTemplate);
	
	
	
	//	This sets up an update function for how often each networked entity needs to update
	// position, rotation, or scale based on each transforms setting in the NAF schema.
	// I'm not sure why it's not a utility function in NAF?
	const vectorRequiresUpdate = epsilon => {
		return () => {
			let prev = null;

			return curr => {
				if (prev === null) {
					prev = new THREE.Vector3(curr.x, curr.y, curr.z);
					return true;
				} else if (!NAF.utils.almostEqualVec3(prev, curr, epsilon)) {
					prev.copy(curr);
					return true;
				}

			return false;
			};
		};
	};
						
						
	// Add the new schema to NAF. and declare the networked components and their update 
	// sensitivity using the function above if they modify the transforms.
	NAF.schemas.add({
		// template to add (created above)
		template: "#asteroids-game",

		components: [
			{
				component: "position",
				requiresNetworkUpdate: vectorRequiresUpdate(0.001)
			},
			{
				component: "rotation",
				requiresNetworkUpdate: vectorRequiresUpdate(0.5)
			},
			{
				component: "scale",
				requiresNetworkUpdate: vectorRequiresUpdate(0.001)
			},
			// TODO: Optimize checking mediaOptions with requiresNetworkUpdate.
			"media-loader",
			"pinnable"
		],
		nonAuthorizedComponents: [
			
		]
	});

}

inject_arcade_asteroids();

function inject_GameElements(){
	mod_createGame();
	
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