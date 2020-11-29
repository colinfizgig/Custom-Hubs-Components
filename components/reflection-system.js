AFRAME.registerSystem("reflectcomponent", {
	
	schema: {
		interval: { type:"number", default: 1000},
		repeat: {type:"boolean", default: true}
	},
	
	init: function() {
		//this.renderRedraw = this.renderRedraw.bind(this);
		this.entities = [];
		this.counter = this.data.interval;

	    this.done = false;
	},
	
	tick: function(t,dt){

		if(!this.done){
			if( this.counter > 0){
				this.counter-=dt;
			}else{
				for(var i = 0; i<this.entities.length; i++){
					renderRedraw(this.entities[i]);
				}
				if(!this.data.repeat){
					this.done = true;
					this.counter = this.data.interval;
				}
			}
		}
	},

	register: function (el) {
		this.entities.push(el);
	},

	unregister: function (el) {
		var index = this.entities.indexOf(el);
		this.entities.splice(index, 1);
	},
	
	renderRedraw: function(myEl, myCam) {
		let obj = myEl.getObject3D('mesh');
		// Go over the submeshes and modify materials we want.
			
		obj.traverse(node => {

			var myMesh = myEl.getObject3D('mesh');
			myMesh.visible = false;

			AFRAME.scenes[0].renderer.autoClear = true;
			var camVector = new THREE.Vector3();
			myEl.object3D.getWorldPosition(camVector);
			myCam.position.copy(myEl.object3D.worldToLocal(camVector));
			myCam.update( AFRAME.scenes[0].renderer, myEl.sceneEl.object3D );

			if (node.type.indexOf('Mesh') !== -1) {
				if(this.data.matoverride == true){
					node.material.metalness = this.data.metalness;
					node.material.roughness = this.data.roughness;
				}
				node.material.envMap = myCam.renderTarget.texture;
				node.material.needsUpdate = true;
			}
			myMesh.visible = true;
		});
	}
	
});
 
	  
AFRAME.registerComponent("reflectcomponent", {
	
	schema: {
		resolution: { type:"number", default: 512},
		distance: {type:"number", default: 10000}
	},

	/**
	* Set if component needs multiple instancing.
	*/
	multiple: false,

	/**
	* Called once when component is attached. Generally for initial setup.
	*/
	init: function(){
		
		this.cam = new THREE.CubeCamera( 0.2, this.data.distance, this.data.resolution);
		
		this.cam.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
		this.cam.renderTarget.texture.generateMipmaps = true;
	    this.el.object3D.add( this.cam );
		
		this.system.register(this.el);

	    this.done = false;
		
		//this method does target for skinned meshes and unskinned
		this.el.addEventListener('model-loaded', () => {
			this.system.renderRedraw(this.el, this.cam);
		});
	},
	  
	tick: function(t,dt){ },

	  /**
	   * Called when component is attached and when component data changes.
	   * Generally modifies the entity based on the data.
	   */
	update: function (oldData) {
		this.system.renderRedraw(this.el, this.cam);
	},

	  /**
	   * Called when a component is removed (e.g., via removeAttribute).
	   * Generally undoes all modifications to the entity.
	   */
	remove: function () {
		this.system.unregister(this.el);
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