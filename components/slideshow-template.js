		
	function inject_slideshow_template() {
		//Query assets in order to setup template
		let assets = document.querySelector("a-assets");
		// create a new template variable
		let newTemplate = document.createElement("template");
		// create template id
		newTemplate.id = "slideshow-media";
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
		
		//owned-object-limiter
		tempAtt = document.createAttribute("owned-object-limiter");
		tempAtt.value = "counter: #media-counter";
		newEntity.setAttributeNode(tempAtt);
				
		// sets the remote hover target component on the object

		newEntity.setAttribute("is-remote-hover-target", "");
						
		// the tags component allows you to filter the collisions and interactable
		// qualities of the entity.  We can reuse tempAtt to set all it's values
		tempAtt = document.createAttribute("tags")
		// set it to be a hand collision target, holdable, give it a hand constraint, a remote constraint, and set to be inspectable with a right click.
		tempAtt.value = "isHandCollisionTarget: false; isHoldable: false; offersHandConstraint: false; offersRemoteConstraint: false; inspectable: true; singleActionButton:true; isStatic: true;togglesHoveredActionSet: true"
		newEntity.setAttributeNode(tempAtt);
		
		//isStatic: true; togglesHoveredActionSet: true; inspectable: true;
						
		// you can set the objects to be destroyed at extreme distances in order to avoid having a bunch of hard to find physics objects falling in your hub

		newEntity.setAttribute("destroy-at-extreme-distances", "");
						
		// another component setup.  Check it out in the components in src
		newEntity.setAttribute("set-xyz-order", "");
		// important! since the matrix auto update on objects in turned off by default
		// in order to save compute power
		newEntity.setAttribute("matrix-auto-update", "");
		// whether this object has a hoverable visuals interaction. You may have to add additional child entities to the template to get this to show up.  Check the component to see how it works 
		newEntity.setAttribute("hoverable-visuals", "");
		
		//position-at-border__freeze
		tempAtt = document.createAttribute("position-at-border__freeze");
		tempAtt.value = "target:.freeze-menu";
		newEntity.setAttributeNode(tempAtt);
		
		//position-at-border__freeze-unprivileged
		tempAtt = document.createAttribute("position-at-border__freeze-unprivileged");
		tempAtt.value = "target:.freeze-unprivileged-menu";
		newEntity.setAttributeNode(tempAtt);

		//add the listed-media component
		newEntity.setAttribute("listed-media", "");
		//add the use-audio-settings component
		newEntity.setAttribute("use-audio-system-settings", "");

	///////////////////////////////////////////////////////////////////////

		//add our slide-counter component created below.  I include the setting of index to show how it keeps track of the current slide
		tempAtt = document.createAttribute("slide-element")
		// set it to target the class freeze-unpriviliged-menu.
		tempAtt.value = "index:0"
		newEntity.setAttributeNode(tempAtt);
		
		tempAtt = document.createAttribute("slidemenu-pager")
		// set it to target the class freeze-unpriviliged-menu.
		tempAtt.value = "index:0"
		newEntity.setAttributeNode(tempAtt);
						
	///////////////////////////////////////////////////////////////////////
		let newChild = document.createElement("a-entity");
		newChild.setAttribute("class", "ui interactable-ui");
		newChild.innerHTML = "<a-entity class='freeze-menu' visibility-while-frozen='withinDistance: 100; withPermission: spawn_and_move_media'><a-entity mixin='rounded-text-action-button' is-remote-hover-target tags='singleActionButton:true' pin-networked-object-button='tipSelector:.pin-button-tip; labelSelector:.pin-button-label;' position='0 0.125 0.001'><a-entity class='pin-button-label' visible='false' text=' value:pin; width:1.75; align:center;' text-raycast-hack position='0 0 0.001'> </a-entity></a-entity><a-entity class='pin-button-tip' text='value:Pinning will broadcast this object to Discord.; width:1.75; align:center; color:#fff;' visible='false' text-raycast-hack slice9='color: #0F40A9; width: 1.8; height: 0.2; left: 64; top: 64; right: 66; bottom: 66; opacity: 1.0; src: #button' position='0 0.6 0.001'></a-entity><a-entity is-remote-hover-target tags='singleActionButton:true;' mixin='rounded-text-button' camera-focus-button='track: false' position='-0.25 0.375 0.001'><a-entity text=' value:focus; width:1.75; align:center;' text-raycast-hack position='0.075 0 0.02'></a-entity><a-entity sprite icon-button='image: camera-action.png; hoverImage: camera-action.png;' scale='0.165 0.165 0.165' position='-0.125 0.005 0.02' ></a-entity></a-entity><a-entity is-remote-hover-target tags='singleActionButton:true;' mixin='rounded-text-button' camera-focus-button='track: true' position='0.25 0.375 0.001'><a-entity text=' value:track; width:1.75; align:center;' text-raycast-hack position='0.075 0 0.02'></a-entity><a-entity sprite icon-button='image: camera-action.png; hoverImage: camera-action.png;' scale='0.165 0.165 0.165' position='-0.125 0.005 0.001' ></a-entity></a-entity><a-entity mixin='rounded-button' is-remote-hover-target tags='singleActionButton: true;' hide-when-pinned-and-forbidden='whenPinned: true' remove-networked-object-button position='0 -0.375 0.001'><a-entity sprite='name: remove-action.png' icon-button='image: remove-action.png; hoverImage: remove-action.png' scale='0.165 0.165 0.165' position='0 0 0.001' ></a-entity></a-entity><a-entity visibility-on-content-types='contentTypes: video/ audio/ image/ application/vnd.apple.mpegurl application/x-mpegurl application/pdf; visible: false;'><a-entity mixin='rounded-button' is-remote-hover-target tags='singleActionButton: true;' drop-object-button hide-when-pinned-and-forbidden='whenPinned: true' position='0 -0.625 0.001'><a-entity sprite icon-button='image: drop-action.png; hoverImage: drop-action.png' scale='0.165 0.165 0.165' position='0 0 0.001' ></a-entity></a-entity></a-entity><a-entity mixin='rounded-button' is-remote-hover-target tags='isHoldable: true; holdableButton: true;' inspect-button visibility-on-content-types='contentTypes: video/ audio/ image/ application/vnd.apple.mpegurl application/x-mpegurl application/pdf;' position='0 -0.625 0.001'><a-entity sprite icon-button='image: focus-action.png; hoverImage: focus-action.png' scale='0.165 0.165 0.165' position='0 0 0.001' ></a-entity></a-entity><a-entity class='deserialize-drawing' visible='false' mixin='rounded-button' is-remote-hover-target tags='singleActionButton: true;' deserialize-drawing-button position='-0.3 -0.625 0.001'><a-entity sprite icon-button='image: deserialize-action.png; hoverImage: deserialize-action.png' scale='0.165 0.165 0.165' position='0 0 0.001' ></a-entity></a-entity><a-entity is-remote-hover-target tags='singleActionButton:true;' mixin='rounded-text-button' open-media-button='onlyOpenLink: true' position='0.43 -0.375 0.001'><a-entity text='value:open link; width:1.75; align:center;' text-raycast-hack position='0 0 0.02'></a-entity></a-entity><a-entity mixin='rounded-text-button ui' is-remote-hover-target tags='singleActionButton: true; isHoverMenuChild: true;' local-refresh-media-button position='0.43 -0.6 0.001' ><a-entity text='value:refresh; width:1.75; align:center;' text-raycast-hack position='0 0 0.02'></a-entity></a-entity><a-entity is-remote-hover-target tags='singleActionButton:true;' mixin='rounded-text-button' clone-media-button position='-0.43 -0.375 0.001'><a-entity text='value:clone; width:1.75; align:center;' text-raycast-hack position='0 0 0.02'></a-entity></a-entity><a-entity mixin='rounded-action-button' tags='isHoldable: true; holdableButton: true;' is-remote-hover-target transform-button transform-button-selector hide-when-pinned-and-forbidden position='-0.3 -0.125 0.001'><a-entity sprite icon-button='image: rotate-action.png; hoverImage: rotate-action.png;' scale='0.165 0.165 0.165' position='0 0 0.001'></a-entity></a-entity><a-entity mixin='rounded-action-button' is-remote-hover-target tags='singleActionButton:true;' mirror-media-button visibility-on-content-types='contentTypes: video/ audio/ image/ application/vnd.apple.mpegurl application/x-mpegurl application/pdf;' position='0 -0.125 0.001'><a-entity sprite icon-button='image: inspect-action.png; hoverImage: inspect-action.png' scale='0.165 0.165 0.165' position='0 0 0.001' ></a-entity></a-entity><a-entity mixin='rounded-action-button' tags='isHoldable: true; holdableButton: true;' is-remote-hover-target scale-button hide-when-pinned-and-forbidden position='0.3 -0.125 0.001'><a-entity sprite icon-button='image: scale-action.png; hoverImage: scale-action.png' scale='0.165 0.165 0.165' position='0 0 0.001' ></a-entity></a-entity></a-entity><a-entity class='freeze-unprivileged-menu' visibility-while-frozen='withinDistance: 100; withoutPermission: spawn_and_move_media;'><a-entity mixin='rounded-text-button ui' is-remote-hover-target tags='singleActionButton: true; isHoverMenuChild: true;' local-refresh-media-button position='0 -0.6 0.001'><a-entity text='value:refresh; width:1.75; align:center;' text-raycast-hack position='0 0 0.02'></a-entity></a-entity><a-entity is-remote-hover-target tags='singleActionButton:true;' mixin='rounded-text-button' open-media-button='onlyOpenLink: true' position='0 -0.25 0.001'><a-entity text='value:open link; width:1.75; align:center;' text-raycast-hack position='0 0 0.02'></a-entity></a-entity><a-entity mixin='rounded-action-button' is-remote-hover-target tags='singleActionButton:true;' mirror-media-button visibility-on-content-types='contentTypes: video/ audio/ image/ application/vnd.apple.mpegurl application/x-mpegurl application/pdf;' position='0 0 0.001'><a-entity sprite icon-button='image: inspect-action.png; hoverImage: inspect-action.png' scale='0.165 0.165 0.165' position='0 0 0.001'></a-entity></a-entity><a-entity mixin='rounded-button' tags='isHoldable: true; holdableButton: true;' is-remote-hover-target inspect-button position='0 0.25 0.001'><a-entity sprite icon-button='image: focus-action.png; hoverImage: focus-action.png' scale='0.165 0.165 0.165' position='0 0 0.001'></a-entity></a-entity></a-entity>";
		
		newEntity.appendChild(newChild);

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
		template: "#slideshow-media",
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
			{
				component: "slide-element",
				property: "index"
			},
			{
				component: "slidemenu-pager",
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
			}
		]
	});

}
// we add the prefix inject_ to our utility functions to isolate them from the global namespace
inject_slideshow_template();
