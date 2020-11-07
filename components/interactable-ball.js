if (scene.hasLoaded) {
	run();
} else {
	scene.addEventListener('loaded', run);
}

function run() {
	
	AFRAME.registerComponent('camera-cube-env', {
  schema: {
	    resolution: { type:'number', default: 128},
	    distance: {type:'number', default: 2000},
	    interval: { type:'number', default: 1000},
		matoverride: {type:'boolean', default: false},
		metalness: { type:'float', default: 1.0},
		roughness: { type:'float', default: 0.2},
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
	    this.counter = this.data.interval;
		
		this.cam = new THREE.CubeCamera( 1.0, this.data.distance, this.data.resolution);
		
		this.cam.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
		this.cam.renderTarget.texture.generateMipmaps = true;
	    this.el.object3D.add( this.cam );

	    this.done = false;
		
		//this method does target for skinned meshes and unskinned
		this.el.addEventListener('model-loaded', () => {

			// Grab the mesh / scene.
			const obj = this.el.getObject3D('mesh');
			// Go over the submeshes and modify materials we want.
			
			obj.traverse(node => {
				var myCam = this.cam;
				var myEl = this.el;
				var myScene = document.querySelector('a-scene').object3D;
				var myMesh = this.el.getObject3D('mesh');
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
		});
	  },
	  
	  tick: function(t,dt){

			if(!this.done){
			  if( this.counter > 0){
				this.counter-=dt;
			  }else{
				myRedraw(this.cam, this.el, this.el.getObject3D('mesh'));
				if(!this.data.repeat){
					this.done = true;
					this.counter = this.data.interval;
				}
			  }
			}

		
		function myRedraw(myCam, myEl, myMesh){
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
		 
		myUpdate(this.cam, this.el, this.el.getObject3D('mesh'));
		function myUpdate(myCam, myEl, myMesh){
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
	   * Called when a component is removed (e.g., via removeAttribute).
	   * Generally undoes all modifications to the entity.
	   */
	  remove: function () {},

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
				
	//Query assets in order to setup template
	let assets = scene.querySelector("a-assets");
	// create a new template variable
	let newTemplate = document.createElement("template");
	// create template id
	newTemplate.id = "interactable-ball-media";
	// create a new entity for the template so we can append it to the assets later
	// normally this is done in the Hubs.html "bootstrap" file
	let newEntity = document.createElement("a-entity");
				
	// setup the attributes for the template such and class and components that
	// should be associated with the template entities
				
	// set the class to interactable if you want interaction or some other class
	// based on hubs interaction layers
	newEntity.setAttribute("class", "interactable");
				
	// for attributes with multiple objects in the schema it's easier to setup
	// a varibable to hold the attribute and its values then create the node on
	// the entity
				
	// the body helper component allows you to setup dynamic attributes for physics
	// interactions.  the type can be dynamic or static.  collision filters and
	// masks are used to limit what objects can collide with.  See the body-helper
	// component for more information
	let bh = document.createAttribute("body-helper");
	bh.value = "type: dynamic; mass: 1; collisionFilterGroup: 1; collisionFilterMask: 15;";
	newEntity.setAttributeNode(bh);
				
	// An object needs to have geometry in order to be visible and work with physics
	// here we reuse the bh variable since the body helper node has been added to the entity.  In this case we are creating the geometry attribute (see aframe docs)
	bh = document.createAttribute("geometry");
	// create a sphere geometry with a radius of 0.5 meters
	bh.value = "primitive: sphere; radius: 0.5";
	newEntity.setAttributeNode(bh);
				
	// reuse the same bh variable for a material attribute to color the geometry
	bh = document.createAttribute("material");
	// set the color to yellow.  You can set a lot of things here, texture, shininess etc.  See the aframe docs on materials
	bh.value = "color:yellow;metalness:1.0;roughness:0.2;";
	newEntity.setAttributeNode(bh);
				
	// set the unowned body kinematic component for the object since it's networked
	// and physics related.
	newEntity.setAttribute("set-unowned-body-kinematic", "");
	// sets the remote hover target component on the object
	newEntity.setAttribute("is-remote-hover-target", "");
				
	// the tags component allows you to filter the collisions and interactable
	// qualities of the entity.  We can reuse bh to set all it's values
	bh = document.createAttribute("tags")
	// set it to be a hand collision target, holdable, give it a hand constraint, a remote constraint, and set to be inspectable with a right click.
	bh.value = "isHandCollisionTarget: true; isHoldable: true; offersHandConstraint: true; offersRemoteConstraint: true; inspectable: true;";
	newEntity.setAttributeNode(bh);
				
	// you can set the objects to be destroyed at extreme distances in order to avoid having a bunch of hard to find physics objects falling in your hub
	newEntity.setAttribute("destroy-at-extreme-distances", "");
	// sets whether the object can be scaled when you grab it. Check hubs docs or the component to see how it can be scaled in different modes
	newEntity.setAttribute("scalable-when-grabbed", "");
				// another component setup.  Check it out in the components in src
	newEntity.setAttribute("set-xyz-order", "");
	// important! since the matrix auto update on objects in turned off by default
	// in order to save compute power
	newEntity.setAttribute("matrix-auto-update", "");
	// whether this object has a hoverable visuals interaction. You may have to add additional child entities to the template to get this to show up.  Check the component to see how it works 
	newEntity.setAttribute("hoverable-visuals", "");

	// Important!  This Component helps you set the collision shape for the object
	// without it set on the actual entity which contains the mesh (set with the 
	// geometry component above in this case) the physics won't collide and the 
	// object will fall through the ground.  Check the component for details
	bh = document.createAttribute("shape-helper")
	bh.value = "";
	newEntity.setAttributeNode(bh);
				
	//add the listed-media component
	newEntity.setAttribute("listed-media", "");
	
	//add the camera-cube-env component
	newEntity.setAttribute("camera-cube-env", "");
				
	//Once all the attributes are setup on the entity you can append it to the template variable content created above.
	newTemplate.content.appendChild(newEntity);
				
	// once the template is created you append it to the assets
	assets.appendChild(newTemplate);
				
				
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
		template: "#interactable-ball-media",
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
			"media-loader",
			"material",
			"camera-cube-env",
			"pinnable"
		]
	});
		
}

// a function to create a new networked entity in the scene using the new template created above
// this could be bound to a chat command if we wanted to do that similar to the /duck 
// component chat command

function addBall(){
	var el = document.createElement("a-entity")
	el.setAttribute("networked", { template: "#interactable-ball-media" } )
	el.object3D.position.y = 2;
	AFRAME.scenes[0].appendChild(el)
}