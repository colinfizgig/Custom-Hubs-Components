init: function(){
		
		var obj = this.el.getObject3D('mesh');
		console.log(obj);
		// returns null here because the mesh has not loaded
		
		this.loaded = this.el.sceneEl.addEventListener('model-loaded', () => {
			
			obj = this.el.getObject3D('mesh');
			console.log(obj);
			// returns the object mesh here because the mesh has loaded
			
		});
	  },
	  