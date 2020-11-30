/**
 * Specifies an envMap on an entity, without replacing any existing material
 * properties.
 */
 	  
AFRAME.registerComponent('camera-cube-env', {
  schema: {
	    resolution: { type:'number', default: 512},
	    distance: {type:'number', default: 10000},
	    interval: { type:'number', default: 100},
		matoverride: {type:'boolean', default: false},
		metalness: { type:'float', default: 1.0},
		roughness: { type:'float', default: 0.0},
	    repeat: { type:'boolean', default: true}
	  },

	  /**
	   * Set if component needs multiple instancing.
	   */
	  multiple: false,

	  /**
	   * Called once when component is attached. Generally for initial setup.
	   */
	  init: function(){
		this.tick = AFRAME.utils.throttleTick(this.tick, this.data.interval, this);
		
		this.cam = new THREE.CubeCamera( 0.2, this.data.distance, this.data.resolution);
		
		this.cam.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
		this.cam.renderTarget.texture.generateMipmaps = true;
	    this.el.object3D.add( this.cam );
		
		//this method does target for skinned meshes and unskinned
		this.loaded = this.el.addEventListener('model-loaded', () => {
			
			// Grab the mesh / scene.
			const obj = this.el.getObject3D('mesh');
			// Go over the submeshes and modify materials we want.
			
			obj.traverse(node => {
				var myMesh = this.el.getObject3D('mesh');
				
				myMesh.visible = false;

				AFRAME.scenes[0].renderer.autoClear = true;
				var camVector = new THREE.Vector3();
				this.el.object3D.getWorldPosition(camVector);
				this.cam.position.copy(this.el.object3D.worldToLocal(camVector));
				this.cam.update( AFRAME.scenes[0].renderer, this.el.sceneEl.object3D );

				if (node.type.indexOf('Mesh') !== -1) {
					if(this.data.matoverride == true){
						node.material.metalness = this.data.metalness;
						node.material.roughness = this.data.roughness;
					}
					node.material.envMap = this.cam.renderTarget.texture;
					node.material.needsUpdate = true;
				}
				myMesh.visible = true;
			});
		});
	  },
	  
	  tick: function(t,dt){
			if(!this.done){
				this.redraw(this.cam, this.el, this.el.getObject3D('mesh'));
				if(!this.data.repeat){
					this.done = true;
				}
			}
	  },
	  
	  redraw: function (myCam, myEl, myMesh) {
			if(this.el.getObject3D('mesh') != null && AFRAME.scenes[0] !=null){
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
			}
	  },

	  /**
	   * Called when component is attached and when component data changes.
	   * Generally modifies the entity based on the data.
	   */
	  update: function (oldData) {

			this.redraw(this.cam, this.el, this.el.getObject3D('mesh'));

	  },

	  /**
	   * Called when a component is removed (e.g., via removeAttribute).
	   * Generally undoes all modifications to the entity.
	   */
	  remove: function () {
		  this.loaded.remove();
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