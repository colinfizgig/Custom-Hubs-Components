/**
 * Specifies an envMap on an entity, without replacing any existing material
 * properties.
 */
 
	  
AFRAME.registerComponent('camera-cube-env', {
  schema: {
	    resolution: { type:'number', default: 128},
	    distance: {type:'number', default: 10000},
	    interval: { type:'number', default: 1000},
		matoverride: {type:'boolean', default: false},
		metalness: { type:'float', default: 1.0},
		roughness: { type:'float', default: 0.5},
	    repeat: { type:'boolean', default: false}
	  },

	  /**
	   * Set if component needs multiple instancing.
	   */
	  multiple: false,

	  /**
	   * Called once when component is attached. Generally for initial setup.
	   */
	  init: function(){
		
		this.myRedraw = this.myRedraw.bind(this);
	    this.counter = this.data.interval;
		
		this.cam = new THREE.CubeCamera( 1.0, this.data.distance, this.data.resolution);
		
		this.cam.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
		this.cam.renderTarget.texture.generateMipmaps = true;
	    this.el.object3D.add( this.cam );

	    this.done = false;
		
		NAF.utils
				.getNetworkedEntity(this.el)
				.then(networkedEl => {
					this.networkedEl = networkedEl;
					this.networkedEl.addEventListener("pinned", this.update);
					this.networkedEl.addEventListener("unpinned", this.update);
					window.APP.hubChannel.addEventListener("permissions_updated", this.update);
					
					const obj = this.networkedEl.getObject3D('mesh');
					
					obj.traverse(node => {
						var myCam = this.cam;
						var myEl = this.networkedEl;

						obj.visible = false;

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
						obj.visible = true;
					});
				})
				.catch(() => {}); //ignore exception, entity might not be networked
	  },
	  
	  tick: function(t,dt){

			if(!this.done){
			  if( this.counter > 0){
				this.counter-=dt;
			  }else{
				this.myRedraw(this.cam, this.networkedEl, this.networkedEl.getObject3D('mesh'));
				if(!this.data.repeat){
					this.done = true;
					this.counter = this.data.interval;
				}
			  }
			}

	  },
	  
	  myRedraw(myCam, myEl, myMesh){
			myMesh.visible = false;

	        AFRAME.scenes[0].renderer.autoClear = true;
			var camVector = new THREE.Vector3();
			myEl.object3D.getWorldPosition(camVector);
	        myCam.position.copy(myEl.object3D.worldToLocal(camVector));
	        myCam.update( AFRAME.scenes[0].renderer, myEl.sceneEl.object3D );
			if(myMesh){
				myMesh.traverse( function( child ) { 
					if ( child instanceof THREE.Mesh ) {
						child.material.envMap = myCam.renderTarget.texture;
						child.material.needsUpdate = true;
					}
				});
			}
			myMesh.visible = true;
	  },

	  /**
	   * Called when component is attached and when component data changes.
	   * Generally modifies the entity based on the data.
	   */
	  update: function (oldData) {
		 if (this.networkedEl && NAF.utils.isMine(this.networkedEl)) {
			this.myRedraw(this.cam, this.networkedEl, this.networkedEl.getObject3D('mesh'));
		 }
	  },

	  /**
	   * Called when a component is removed (e.g., via removeAttribute).
	   * Generally undoes all modifications to the entity.
	   */
	  remove() {
				if (this.networkedEl) {
					this.networkedEl.removeEventListener("pinned", this.update);
					this.networkedEl.removeEventListener("unpinned", this.update);
				}

				window.APP.hubChannel.removeEventListener("permissions_updated", this.update);
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