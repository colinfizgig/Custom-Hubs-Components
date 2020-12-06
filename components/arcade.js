
function inject_arcade_asteroids() {
	
	var myBody = document.querySelector("body");
	
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