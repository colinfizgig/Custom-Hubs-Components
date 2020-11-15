function createClientLoad () {
	
	var myBody = document.querySelector("body");
	
	var gKickScript = document.createElement("script");
	//gKickScript.type = 'text/javascript';

	var asyncAt = document.createAttribute('async');
	gKickScript.setAttributeNode(asyncAt);
	
	var deferAt = document.createAttribute('defer');
	gKickScript.setAttributeNode(deferAt);
	
	var srcAt = document.createAttribute('src');
	srcAt.value = "https://apis.google.com/js/api.js";
	gKickScript.setAttributeNode(srcAt);
	
	var onloadAt = document.createAttribute('onload');
	onloadAt.value = "this.onload=function(){};handleClientLoad()";
	gKickScript.setAttributeNode(onloadAt);
	
	var onreadyAt = document.createAttribute('onreadystatechange');
	onreadyAt.value = "if (this.readyState === 'complete') this.onload()";
	gKickScript.setAttributeNode(onreadyAt);

	myBody.appendChild(gKickScript);
}

createClientLoad();