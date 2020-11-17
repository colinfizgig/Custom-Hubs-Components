const pdfURL = "https://hubs-proxy.com/https://colinfizgig.github.io/Custom-Hubs-Components/components/Binder1.pdf";

function addPdf(){
	var el = document.createElement("a-entity")'
	el.setAttribute("networked", { template: "#pdfshow-media" } );
	el.setAttribute("media-loader", {src:pdfURL, animate: false, fileIsOwned: true});
	el.object3D.position.y = 2;
	el.object3D.scale.set(4,4,1);
	AFRAME.scenes[0].appendChild(el)
}