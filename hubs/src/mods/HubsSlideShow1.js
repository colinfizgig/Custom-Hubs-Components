let scene = document.querySelector("a-scene");
if (scene.hasLoaded) {
	inject_scriptable_Media();
} else {
	scene.addEventListener('loaded', inject_scriptable_Media);
}

// create a variable to hold the numerous submenus and buttons we will need for interaction with this new template object in Hubs

const mediaMenuText = "<a-entity class='ui interactable-ui'><a-entity class='freeze-menu' visibility-while-frozen='withinDistance: 100; withPermission: spawn_and_move_media'><a-entity mixin='rounded-text-action-button' is-remote-hover-target tags='singleActionButton:true' pin-networked-object-button='tipSelector:.pin-button-tip; labelSelector:.pin-button-label;' position='0 0.125 0.001'><a-entity class='pin-button-label' visible='false' text=' value:pin; width:1.75; align:center;' text-raycast-hack position='0 0 0.001'></a-entity></a-entity><a-entity class='pin-button-tip' text='value:Pinning will broadcast this object to Discord.; width:1.75; align:center; color:#fff;' visible='false' text-raycast-hack slice9='color: #0F40A9; width: 1.8; height: 0.2; left: 64; top: 64; right: 66; bottom: 66; opacity: 1.0; src: #button' position='0 0.6 0.001'></a-entity><a-entity is-remote-hover-target tags='singleActionButton:true;' mixin='rounded-text-button' camera-focus-button='track: false' position='-0.25 0.375 0.001'><a-entity text=' value:focus; width:1.75; align:center;' text-raycast-hack position='0.075 0 0.02'></a-entity><a-entity sprite icon-button='image: camera-action.png; hoverImage: camera-action.png; scale='0.165 0.165 0.165' position='-0.125 0.005 0.02'></a-entity></a-entity><a-entity is-remote-hover-target tags='singleActionButton:true;' mixin='rounded-text-button' camera-focus-button='track: true' position='0.25 0.375 0.001'><a-entity text=' value:track; width:1.75; align:center;' text-raycast-hack position='0.075 0 0.02'></a-entity><a-entity sprite icon-button='image: camera-action.png; hoverImage: camera-action.png;' scale='0.165 0.165 0.165' position='-0.125 0.005 0.001'></a-entity></a-entity><a-entity mixin='rounded-button' is-remote-hover-target tags='singleActionButton: true;' hide-when-pinned-and-forbidden='whenPinned: true' remove-networked-object-button position='0 -0.375 0.001'><a-entity sprite='name: remove-action.png' icon-button='image: remove-action.png; hoverImage: remove-action.png' scale='0.165 0.165 0.165' position='0 0 0.001'></a-entity></a-entity><a-entity visibility-on-content-types='contentTypes: video/ audio/ image/ application/vnd.apple.mpegurl application/x-mpegurl application/pdf; visible: false;'><a-entity mixin='rounded-button' is-remote-hover-target tags='singleActionButton: true;' drop-object-button hide-when-pinned-and-forbidden='whenPinned: true' position='0 -0.625 0.001'><a-entity sprite icon-button='image: drop-action.png; hoverImage: drop-action.png' scale='0.165 0.165 0.165' position='0 0 0.001' ></a-entity> </a-entity> </a-entity><a-entity mixin='rounded-button' is-remote-hover-target tags='isHoldable: true; holdableButton: true;' inspect-button visibility-on-content-types='contentTypes: video/ audio/ image/ application/vnd.apple.mpegurl application/x-mpegurl application/pdf;' position='0 -0.625 0.001'><a-entity sprite icon-button='image: focus-action.png; hoverImage: focus-action.png' scale='0.165 0.165 0.165' position='0 0 0.001' ></a-entity></a-entity><a-entity class='deserialize-drawing' visible='false' mixin='rounded-button' is-remote-hover-target tags='singleActionButton: true;' deserialize-drawing-button position='0.250 -0.625 0.001'><a-entity sprite icon-button='image: deserialize-action.png; hoverImage: deserialize-action.png' scale='0.165 0.165 0.165' position='0 0 0.001'></a-entity></a-entity><a-entity is-remote-hover-target tags='singleActionButton:true;' mixin='rounded-text-button' open-media-button='onlyOpenLink: true' position='0.43 -0.375 0.001'><a-entity text='value:open link; width:1.75; align:center;' text-raycast-hack position='0 0 0.02'></a-entity></a-entity><a-entity mixin='rounded-text-button ui' is-remote-hover-target tags='singleActionButton: true; isHoverMenuChild: true;' local-refresh-media-button position='0.43 -0.6 0.001'><a-entity text='value:refresh; width:1.75; align:center;' text-raycast-hack position='0 0 0.02'></a-entity></a-entity><a-entity is-remote-hover-target tags='singleActionButton:true;' mixin='rounded-text-button' clone-media-button position='-0.43 -0.375 0.001'><a-entity text='value:clone; width:1.75; align:center;' text-raycast-hack position='0 0 0.02'></a-entity></a-entity><a-entity mixin='rounded-action-button' tags='isHoldable: true; holdableButton: true;' is-remote-hover-target transform-button transform-button-selector hide-when-pinned-and-forbidden position='-0.3 -0.125 0.001'><a-entity sprite icon-button='image: rotate-action.png; hoverImage: rotate-action.png;' scale='0.165 0.165 0.165' position='0 0 0.001'></a-entity></a-entity><a-entity mixin='rounded-action-button' is-remote-hover-target tags='singleActionButton:true;' mirror-media-button visibility-on-content-types='contentTypes: video/ audio/ image/ application/vnd.apple.mpegurl application/x-mpegurl application/pdf;' position='0 -0.125 0.001'><a-entity sprite icon-button='image: inspect-action.png; hoverImage: inspect-action.png' scale='0.165 0.165 0.165' position='0 0 0.001'></a-entity></a-entity><a-entity mixin='rounded-action-button' tags='isHoldable: true; holdableButton: true;' is-remote-hover-target scale-button hide-when-pinned-and-forbidden position='0.3 -0.125 0.001'><a-entity sprite icon-button='image: scale-action.png; hoverImage: scale-action.png' scale='0.165 0.165 0.165' position='0 0 0.001'></a-entity></a-entity></a-entity><a-entity class='freeze-unprivileged-menu' visibility-while-frozen='withinDistance: 100; withoutPermission: spawn_and_move_media;'><a-entity mixin='rounded-text-button ui' is-remote-hover-target tags='singleActionButton: true; isHoverMenuChild: true;' local-refresh-media-button position='0 -0.6 0.001'><a-entity text='value:refresh; width:1.75; align:center;' text-raycast-hack position='0 0 0.02'></a-entity></a-entity><a-entity is-remote-hover-target tags='singleActionButton:true;' mixin='rounded-text-button' open-media-button='onlyOpenLink: true' position='0 -0.25 0.001'><a-entity text='value:open link; width:1.75; align:center;' text-raycast-hack position='0 0 0.02'></a-entity></a-entity><a-entity mixin='rounded-action-button' is-remote-hover-target tags='singleActionButton:true;' mirror-media-button visibility-on-content-types='contentTypes: video/ audio/ image/ application/vnd.apple.mpegurl application/x-mpegurl application/pdf;' position='0 0 0.001'><a-entity sprite icon-button='image: inspect-action.png; hoverImage: inspect-action.png' scale='0.165 0.165 0.165' position='0 0 0.001'></a-entity></a-entity><a-entity mixin='rounded-button' tags='isHoldable: true; holdableButton: true;' is-remote-hover-target inspect-button position='0 0.25 0.001'><a-entity sprite icon-button='image: focus-action.png; hoverImage: focus-action.png' scale='0.165 0.165 0.165' position='0 0 0.001'></a-entity></a-entity></a-entity></a-entity>";

// here is where we setup the entities that make up the new template

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
    tempAtt.value = "type: static; mass: 0; collisionFilterGroup: 1; collisionFilterMask: 15;";
    newEntity.setAttributeNode(tempAtt);
	
	// set the owned-object-limiter attribute
	tempAtt = document.createAttribute("owned-object-limiter");
    tempAtt.value = "counter: #media-counter";
    newEntity.setAttributeNode(tempAtt);
	
	// sets the remote hover target component on the object
    newEntity.setAttribute("is-remote-hover-target", "");
	
	// the tags component allows you to filter the collisions and interactable
	// qualities of the entity.  We can reuse tempAtt to set all it's values
    tempAtt = document.createAttribute("tags")
	// set it to be a hand collision target, holdable, give it a hand constraint, a remote constraint, and set to be inspectable with a right click.
    tempAtt.value = "isHandCollisionTarget: true; isHoldable: true; offersHandConstraint: false; offersRemoteConstraint: false; inspectable: true;"
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
	
	//setup the freeze menu for the template if it needs it
	tempAtt = document.createAttribute("position-at-border__freeze")
	// set it to target the class freeze-menu.
    tempAtt.value = "target:.freeze-menu"
    newEntity.setAttributeNode(tempAtt);
	
	//setup the freeze-unpriviliged-menu for the template if it needs it
	tempAtt = document.createAttribute("position-at-border__freeze-unprivileged")
	// set it to target the class freeze-unpriviliged-menu.
    tempAtt.value = "target:.freeze-unprivileged-menu"
    newEntity.setAttributeNode(tempAtt);

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


	//add the inner elements for interactable media menus
	let interactableMenus = document.createElement("a-entity");
	interactableMenus.setAttribute("class", "ui interactable-ui");
	interactableMenus.innerHTML = mediaMenuText;
	
	//append the menus to the main template element
	newEntity.appendChild(interactableMenus);

	//Once all the attributes are setup on the entity you can append it to the template variable content created above.
    newTemplate.content.appendChild(newEntity);
	
	// once the template is created you append it to the assets
    assets.appendChild(newTemplate);
	
	// first lets setup a new component for aframe that allows us to modify the content with a click.  This component will work on multiple interactable objects by scaling them up and down and keeping an index incrementing for the current slide.


	AFRAME.registerComponent("slide-counter", {
	  schema: {
		index: { default: 0 }
	  },

	  init() {
		this.onNext = this.onNext.bind(this);
		this.update = this.update.bind(this);

		this.el.object3D.addEventListener("interact", this.onNext);

		NAF.utils
		  .getNetworkedEntity(this.el)
		  .then(networkedEl => {
			this.networkedEl = networkedEl;
			this.networkedEl.addEventListener("pinned", this.update);
			this.networkedEl.addEventListener("unpinned", this.update);
			window.APP.hubChannel.addEventListener("permissions_updated", this.update);
			
			this.slides = slides;
			this.max = this.slides.loaded.length;
			this.currentSlide = this.data.index;
		  })
		  .catch(() => {}); //ignore exception, entity might not be networked

	  },

	  async update(oldData) {
		console.log("update");
		this.currentSlide = this.data.index;
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
		if(this.currentSlide < (this.max -1)){
			//scale old down
			this.slides.loaded[this.currentSlide].object3D.scale.setScalar(this.slides.linkScale);
			// scale new up
			this.slides.loaded[this.currentSlide + 1].object3D.scale.setScalar(this.slides.slideScale)
		}else{
			this.slides.loaded[this.currentSlide].object3D.scale.setScalar(this.slides.linkScale);
			this.slides.loaded[0].object3D.scale.setScalar(this.slides.slideScale)
		}
		
	  },

	  remove() {
		if (this.networkedEl) {
		  this.networkedEl.removeEventListener("pinned", this.update);
		  this.networkedEl.removeEventListener("unpinned", this.update);
		}

		window.APP.hubChannel.removeEventListener("permissions_updated", this.update);
	  }
	});
	
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

/* examples of usage :
slides.setupSlides()   // load and layout slides with links
slides.nextSlide()     // switch to the next slide (loops)
slides.removeAllMedia() // remove all slides
*/

var slides = {
  loaded:[],
  slideScale: 5.0,
  linkScale: 0.0001,
  currentSlide: 0,
  cleanUpSlides,
  setupSlides,
  removeAllMedia
}

slides.content = [
  // can have 3D objects per slide but also global e.g. path or starting arrow
  {title:'Fabien Benetou', url:'https://fabien.benetou.fr', img:'https://images.unsplash.com/photo-1550052558-11de18b04282?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80'},
  {title:'@ European Parliament Innovation service', url:'https://twitter.com/utopiah/status/1262788181184974854', img:'https://twitter.com/i/status/1262788181184974854'},
  {title:'@ UNICEF Innovation Fund', url:'https://twitter.com/theentreflaneur/status/1088831930261475329', img:'https://pbs.twimg.com/media/DxxO25_X4AEJ5qW?format=jpg&name=large'},
  {title:'@ Mozilla Tech Speakers', url:'https://twitter.com/mozTechSpeakers/status/1168578445812436992/',img:'https://pbs.twimg.com/media/EDefouMUwAAIUtA?format=jpg&name=4096x4096'},
  {title:'PIM motivation', url: 'https://fabien.benetou.fr/Wiki/VirtualRealityInterface', img: 'https://pbs.twimg.com/media/EYdm6AqXQAEfl4_?format=jpg&name=4096x4096'},
  {title:'scripting in Hubs 1', url:'https://twitter.com/utopiah/status/1244968857690877952', img:'https://pbs.twimg.com/media/EWxeYghWoAc1pRI?format=jpg&name=4096x4096'},
  {title: 'nodejs bot 2', url:'https://t.co/PWqU6oDUk3?amp=1', img:'https://pbs.twimg.com/media/EWxfIoFXQAU4iW2?format=jpg&name=large'},
  {title:'puppeter', url:'https://github.com/zach-capalbo/hubs-client-bot', img:'https://twitter.com/i/status/1261677410342354944'},
  {title:'local client 3', url:'', img:'https://pbs.twimg.com/media/EWxfL_eX0AEWiY1?format=jpg&name=large'},
  {title:'hubs cloud welcome 4', url:'', img:'https://pbs.twimg.com/media/EWxfMwqWkAAwRzI?format=jpg&name=4096x4096'},
  {title:'setting up your Hubs Cloud instance', url:'https://twitter.com/utopiah/status/1263352654195015680', img:'https://pbs.twimg.com/media/EYhTythXgAATolz?format=jpg&name=large'},
  {title:'Lessons learned', url:'https://fabien.benetou.fr/Tools/Hubs', img:'https://twitter.com/i/status/1260475760747347973'},
  {title:'... now what? Build. Explore. Share.', url:'https://en.wikipedia.org/wiki/Comparison_of_free_and_open-source_software_licences', img:'https://moviesdrop.com/wp-content/uploads/2013/02/The-Thirteenth-Floor-1999.jpg'},
  {title:'(slides)', url:'https://gist.github.com/Utopiah/b4bdcd5422cc8c12b97fac3776955cb2', img:'https://gist.github.com/Utopiah/b4bdcd5422cc8c12b97fac3776955cb2'},
  // convert -size 1024x128 -fill black -font Helvetica caption:"a lot more text" text.png; gwenview text.png
]

slides.additional = [
  'https://twitter.com/utopiah/status/1257410087666225158'
]

//---- from Hubs utils ----------------------------------------------
// https://gist.github.com/Utopiah/1cfc123239fa2994569fc7c5c60b2928/

var hubs_utils = { loadAssetsFromURLs }

function loadAssetsFromURLs(URLs){
  var backupImgSrc = 'https://hubs-proxy.com/https://fabien.benetou.fr/pub/home/AWE_Berlin/'
  var elements = []
  var i = 1
  for (var url of URLs){  
    var el = document.createElement("a-entity")
    AFRAME.scenes[0].appendChild(el)
	el.setAttribute("slide-counter", { index: i-1})
    el.setAttribute("media-loader", { src: backupImgSrc+(i++)+'.jpg', fitToBox: true, resolve: false })
	
	// here is where we create the new objects with the template we made above.
    el.setAttribute("networked", { template: "#scriptable-media" } )
    elements.push(el)
  }
  return elements
}

//---- from Hubs utils ----------------------------------------------

function setupSlides(){
  slides.currentSlide = 0
  slides.loaded  = hubs_utils.loadAssetsFromURLs(slides.content.map(s => s.img))

  var l = slides.content.length
  slides.loaded.map( (s,i) => {
    s.object3D.position.y = 2
    s.object3D.position.x = 1 
    s.object3D.position.z = (1-(i*0.01))
	s.object3D.scale.setScalar(slides.linkScale);

  })
	
  slides.loaded[slides.currentSlide].object3D.scale.setScalar(slides.slideScale)
}

function cleanUpSlides(){
  slides.loaded.map( s => { s.setAttribute("pinnable", {pinned:false}); s.remove()} )
  slides.loaded = []
}


function removeAllMedia(){
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


	
// inject the scriptable-media template once the scene has loaded so we can create hubs objects based on it.

	
/////////////////////////////////////////////////////////////////////////
////  Create the media and content for the new slideshow elements
////////////////////////////////////////////////////////////////////////

//slides.setupSlides();

/*
// working on setting up a way to change the media on one loaded object from a url here.
temp0.setAttribute("media-loader", "src", "https://hubs-proxy.com/https://fabien.benetou.fr/pub/home/AWE_Berlin/6.jpg")
*/

