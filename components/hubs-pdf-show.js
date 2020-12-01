const mod_pdfURL = "https://hubs-proxy.com/https://colinfizgig.github.io/Custom-Hubs-Components/components/Binder1.pdf";

// we add the prefix mod_ to this function to allow it to be targeted by the chat interface
function mod_addPdf(){
	var el = document.createElement("a-entity");
	el.setAttribute("networked", { template: "#pdfshow-media" } );
	el.setAttribute("media-loader", {src:mod_pdfURL, animate: false, fileIsOwned: true});
	el.object3D.position.y = 2;
	el.object3D.scale.set(4,4,1);
	AFRAME.scenes[0].appendChild(el)
}