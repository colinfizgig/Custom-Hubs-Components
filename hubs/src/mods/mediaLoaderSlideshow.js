		
AFRAME.registerComponent("slide-counter", {
  schema: {
    index: { default: 0 },
	slideScale: {default: 5}
  },

  init() {
    this.onNext = this.onNext.bind(this);
    this.update = this.update.bind(this);
	this.removeAllMedia = this.removeAllMedia.bind(this);
	this.setupSlides = this.setupSlides.bind(this);
	this.cleanUpSlides = this.cleanUpSlides.bind(this);

	this.el.object3D.addEventListener("interact", this.onNext);

	this.content = ["https://hubs-proxy.com/https://fabien.benetou.fr/pub/home/AWE_Berlin/1.jpg","https://hubs-proxy.com/https://fabien.benetou.fr/pub/home/AWE_Berlin/2.jpg","https://hubs-proxy.com/https://fabien.benetou.fr/pub/home/AWE_Berlin/3.jpg","https://hubs-proxy.com/https://fabien.benetou.fr/pub/home/AWE_Berlin/4.jpg","https://hubs-proxy.com/https://fabien.benetou.fr/pub/home/AWE_Berlin/5.jpg","https://hubs-proxy.com/https://fabien.benetou.fr/pub/home/AWE_Berlin/6.jpg","https://hubs-proxy.com/https://fabien.benetou.fr/pub/home/AWE_Berlin/7.jpg","https://hubs-proxy.com/https://fabien.benetou.fr/pub/home/AWE_Berlin/8.jpg","https://hubs-proxy.com/https://fabien.benetou.fr/pub/home/AWE_Berlin/9.jpg","https://hubs-proxy.com/https://fabien.benetou.fr/pub/home/AWE_Berlin/10.jpg","https://hubs-proxy.com/https://fabien.benetou.fr/pub/home/AWE_Berlin/11.jpg","https://hubs-proxy.com/https://fabien.benetou.fr/pub/home/AWE_Berlin/12.jpg","https://hubs-proxy.com/https://fabien.benetou.fr/pub/home/AWE_Berlin/13.jpg","https://hubs-proxy.com/https://fabien.benetou.fr/pub/home/AWE_Berlin/14.jpg"]
	this.max = this.content.length;
	this.backupImgSrc = 'https://hubs-proxy.com/https://fabien.benetou.fr/pub/home/AWE_Berlin/'

    NAF.utils
      .getNetworkedEntity(this.el)
      .then(networkedEl => {
        this.networkedEl = networkedEl;
        this.networkedEl.addEventListener("pinned", this.update);
        this.networkedEl.addEventListener("unpinned", this.update);
        window.APP.hubChannel.addEventListener("permissions_updated", this.update);
		this.networkedEl.object3D.scale.setScalar(this.data.slideScale);
		this.setupSlides();
      })
      .catch(() => {}); //ignore exception, entity might not be networked

	},

	async update(oldData) {
		console.log("update");
		//this.currentSlide = this.data.index;
		if (this.networkedEl && NAF.utils.isMine(this.networkedEl)) {
		  if (oldData && typeof oldData.index === "number" && oldData.index !== this.data.index) {
			//this.el.emit("owned-pager-page-changed");
			console.log("owner changed");
		  }
		}
	},

	onNext() {
		
		if (this.networkedEl && !NAF.utils.isMine(this.networkedEl) && !NAF.utils.takeOwnership(this.networkedEl)){ 
			console.log("not owned");
			return;
		}
	// currently the index is not updating over NAF even though it should be networked.
		if(this.currentSlide < (this.max -1)){
			this.currentSlide += 1;
			this.el.setAttribute("media-loader", {src: this.content[this.currentSlide], fitToBox: true, resolve: false});
			this.networkedEl.setAttribute("slide-counter", {index: this.currentSlide});
		}else{
			this.currentSlide = 0;
			this.el.setAttribute("media-loader", {src: this.content[this.currentSlide], fitToBox: true, resolve: false});
			this.networkedEl.setAttribute("slide-counter", {index: this.currentSlide});
		}
		
	},

	remove() {
		if (this.networkedEl) {
		  this.networkedEl.removeEventListener("pinned", this.update);
		  this.networkedEl.removeEventListener("unpinned", this.update);
		}

		window.APP.hubChannel.removeEventListener("permissions_updated", this.update);
	},

	setupSlides(){
		console.log(this.networkedEl.getAttribute("slide-counter").index);
		this.currentSlide = this.networkedEl.getAttribute("slide-counter").index;
		this.el.setAttribute("media-loader", {src: this.content[this.currentSlide], fitToBox: true, resolve: false})
		//this.el.setAttribute("networked", { template: "#scriptable-media" } )
	},

	cleanUpSlides(){
	  this.loaded.map( s => { s.setAttribute("pinnable", {pinned:false}); s.remove()} )
	  this.loaded = []
	},

	removeAllMedia(){
	  for (var el of document.querySelectorAll("[media-loader]")){
		var match = el.components["media-loader"].attrValue.src.match('fabien.benetou.fr')
		if (match && match.length>0){
		   NAF.utils.getNetworkedEntity(el).then(networkedEl => {
			const mine = NAF.utils.isMine(networkedEl)
			if (!mine) var owned = NAF.utils.takeOwnership(networkedEl)
			networkedEl.components["set-unowned-body-kinematic"].setBodyKinematic()
			networkedEl.setAttribute("pinnable", {pinned:false})
			networkedEl.remove()
		  })
		}
	  }
	}
});

document.addEventListener("DOMContentLoaded", async () => {
	let scene = document.querySelector("a-scene");
			
		if (scene.hasLoaded) {
			inject_scriptable_Media();
		} else {
			scene.addEventListener('loaded', inject_scriptable_Media);
		}
			
		function inject_scriptable_Media() {
				//Query assets in order to setup template
				let assets = scene.querySelector("a-assets");
				// create a new template variable
				let newTemplate = document.createElement("template");
				// create template id
				newTemplate.id = "scriptable-media";
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
				let tempAtt = document.createAttribute("body-helper");
				tempAtt.value = "type: static; mass: 1; collisionFilterGroup: 1; collisionFilterMask: 15;";
				newEntity.setAttributeNode(tempAtt);
				
				// sets the remote hover target component on the object
				newEntity.setAttribute("is-remote-hover-target", "");
				
				// the tags component allows you to filter the collisions and interactable
				// qualities of the entity.  We can reuse tempAtt to set all it's values
				tempAtt = document.createAttribute("tags")
				// set it to be a hand collision target, holdable, give it a hand constraint, a remote constraint, and set to be inspectable with a right click.
				tempAtt.value = "isHandCollisionTarget: true; isHoldable: false; offersHandConstraint: false; offersRemoteConstraint: false; inspectable: false; singleActionButton:true;"
				newEntity.setAttributeNode(tempAtt);
				
				// you can set the objects to be destroyed at extreme distances in order to avoid having a bunch of hard to find physics objects falling in your hub
				newEntity.setAttribute("destroy-at-extreme-distances", "");
				
				// another component setup.  Check it out in the components in src
				newEntity.setAttribute("set-xyz-order", "");
				// important! since the matrix auto update on objects in turned off by default
				// in order to save compute power
				newEntity.setAttribute("matrix-auto-update", "");
				// whether this object has a hoverable visuals interaction. You may have to add additional child entities to the template to get this to show up.  Check the component to see how it works 
				newEntity.setAttribute("hoverable-visuals", "");

				//add the listed-media component
				newEntity.setAttribute("listed-media", "");
				//add the use-audio-settings component
				newEntity.setAttribute("use-audio-system-settings", "");

			///////////////////////////////////////////////////////////////////////

				//add our slide-counter component created below.  I include the setting of index to show how it keeps track of the current slide
				tempAtt = document.createAttribute("slide-counter")
				// set it to target the class freeze-unpriviliged-menu.
				tempAtt.value = "index:0"
				newEntity.setAttributeNode(tempAtt);
				
			///////////////////////////////////////////////////////////////////////

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
					// template to add (created above)
					template: "#scriptable-media",
					// we need to tell NAF what components to share between clients
					// in this case we share the position, rotation, scale, the media-loader (which loads the media)
					// the media-video time attribute(a component registered in the media-loader in case you are looking for it)
					// the media-video videoPaused attribute
					// the media-pdf index attribute (also registered in teh media-loader component).
					// and pinnable.
					// On top of these "authorized" components we register some "non-authorized" components they are..
					// media video time and video paused, media-pdf index and our new component slide-counter with its index attribute.
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
					  // TODO: Optimize checking mediaOptions with requiresNetworkUpdate.
					  "media-loader",
					  {
						component: "media-video",
						property: "time"
					  },
					  {
						component: "media-video",
						property: "videoPaused"
					  },
					  {
						component: "media-pdf",
						property: "index"
					  },
					  "pinnable"
					],
					nonAuthorizedComponents: [
					  {
						component: "media-video",
						property: "time"
					  },
					  {
						component: "media-video",
						property: "videoPaused"
					  },
					  {
						component: "media-pager",
						property: "index"
					  },
					  {
						component: "slide-counter",
						property: "index"
					  }
					]
				});
		}
});

function addSlides(){
	var el = document.createElement("a-entity")
	el.setAttribute("networked", { template: "#scriptable-media" } )
	el.setAttribute("media-loader", {animate: false, fileIsOwned: true})
	el.object3D.position.y = 2;
    AFRAME.scenes[0].appendChild(el)
}