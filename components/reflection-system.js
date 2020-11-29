AFRAME.registerSystem('reflect-component', {
	
	schema: {
		resolution: { type:'number', default: 512},
		interval: { type:'number', default: 1000},
		distance: {type:'number', default: 10000},
		repeat: {type:'boolean', default: true}
	},
	
	init: function () {
		this.renderRedraw = this.renderRedraw.bind(this);
		this.entities = [];
		this.counter = this.data.interval;
		
		this.cam = new THREE.CubeCamera( 0.2, this.data.distance, this.data.resolution);
		
		this.cam.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
		this.cam.renderTarget.texture.generateMipmaps = true;
	    AFRAME.scenes[0].object3D.add( this.cam );

	    this.done = false;
	},
	
	tick: function(t,dt){

		if(!this.done){
			if( this.counter > 0){
				this.counter-=dt;
			}else{
				for(var i = 0; i<this.entities.length; i++){
					this.renderRedraw(this.entities[i]);
				}
				if(!this.data.repeat){
					this.done = true;
					this.counter = this.data.interval;
				}
			}
		}
	},

	registerMe: function (el) {
		this.entities.push(el);
	},

	unregisterMe: function (el) {
		var index = this.entities.indexOf(el);
		this.entities.splice(index, 1);
	},
	
	renderRedraw: function(myEl) {

		let obj = myEl.getObject3D('mesh');
		// Go over the submeshes and modify materials we want.
			
		obj.traverse(node => {

			//var myMesh = myEl.getObject3D('mesh');
			obj.visible = false;

			AFRAME.scenes[0].renderer.autoClear = true;
			var camVector = new THREE.Vector3();
			myEl.object3D.getWorldPosition(camVector);
			this.cam.position.copy(myEl.object3D.worldToLocal(camVector));
			this.cam.update( AFRAME.scenes[0].renderer, myEl.sceneEl.object3D );

			if (node.type.indexOf('Mesh') !== -1) {
				if(this.data.matoverride == true){
					node.material.metalness = this.data.metalness;
					node.material.roughness = this.data.roughness;
				}
				node.material.envMap = this.cam.renderTarget.texture;
				node.material.needsUpdate = true;
			}
			obj.visible = true;
		});
	}
	
});
 
	  
AFRAME.registerComponent('reflect-component', {

	/**
	* Set if component needs multiple instancing.
	*/
	multiple: false,

	/**
	* Called once when component is attached. Generally for initial setup.
	*/
	init: function(){
		console.log(this.el);
		console.log(this.system);
		this.system.registerMe(this.el);

	    this.done = false;
		
		//this method does target for skinned meshes and unskinned
		this.el.addEventListener('model-loaded', () => {
			this.system.renderRedraw(this.el);
		});
	},
	  
	tick: function(t,dt){ },

	  /**
	   * Called when component is attached and when component data changes.
	   * Generally modifies the entity based on the data.
	   */
	update: function (oldData) {
		this.system.renderRedraw(this.el);
	},

	  /**
	   * Called when a component is removed (e.g., via removeAttribute).
	   * Generally undoes all modifications to the entity.
	   */
	remove: function () {
		this.system.unregisterMe(this.el);
	},
	  /**
	   * Called on each scene tick.
	   */
	  // tick: function (t) { },

	  /**
	   * Called when entity pauses.
	   * Use to stop or remove any dynamic or background behavior such as events.
	   */
	pause: function () { },

	  /**
	   * Called when entity resumes.
	   * Use to continue or add any dynamic or background behavior such as events.
	   */
	play: function () { }
});