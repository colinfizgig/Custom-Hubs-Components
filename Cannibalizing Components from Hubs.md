

#### **Cannibalizing Components from Hubs**

One way to make it easier to code and to make the user interface more consistent is to cannibalize a pre-existing functionality which does similar things to the functionality we need.  You can find all sorts of examples of functionality like this in the [**components**](https://github.com/colinfizgig/hubs/tree/master/src/components) and templates that ship with hubs.  One good example is the [**media-loader**](https://github.com/colinfizgig/hubs/blob/master/src/components/media-loader.js) component which has functionality and menus for 4 different types of media.  One of which is a pdf media type which has an arrow based paging function and an index of the current page as well.  There is some extra functionality in this menu which we don’t need like the copy image button on the top.


![img](https://lh5.googleusercontent.com/Ql-1vZNAMUMfnNRgbOD_C6L_9RA79eRcAsLQUVOXNAFcqmpooLrANkdwFD99larCJl_JHUZBICrouz6ZiBCDuOfGJO4CO5O9NQP6GIjzKnHIkSDw7l01fINREtRY45kRFhPiUB64)



We can copy this component functionality called **“media-pager”** which is built into the “media-loader” component and customize it for our slideshow.  We copy the component and take out the parts we don’t need and add functionality we want.  Our new **“slidemenu-pager” component** is edited like this.

We change the component name from

```javascript
AFRAME.registerComponent("media-pager", {    
```

"media-pager" gets changed to "slidemenu-pager" and we remove references to onSnap since we won't use it with the component.

```javascript
AFRAME.registerComponent("slidemenu-pager", {

    schema: {
    	index: { default: 0 },
    	maxIndex: { default: 0 }
	},

	init() {
      	this.onNext = this.onNext.bind(this);
  		this.onPrev = this.onPrev.bind(this);
        //** REMOVED **
        //   this.onSnap = this.onSnap.bind(this); 
        this.update = this.update.bind(this);
```

We link the slideconfig.slides array (loaded in another script) and set the maxIndex to it's length.  This allows us to add a list of slides as another script that we inject.

```javascript
		//add two lines to load content and set the maxIndex
		this.content = slideconfig.slides;
		this.data.maxIndex = this.content.length - 1;
```

We change the name of the template we use since the menu content will change by removing the snap button.  We also remove the snapButton references.  We won't have a pdf in our template so we can remove the  "pdf-loaded" event listener as well.

```javascript
		//** REMOVED **
		//   this.el.setAttribute("hover-menu__pager", { template: "#pager-hover-menu", isFlat: true });

		//** REPLACE WITH **
		this.el.setAttribute("hover-menu__pager", { template: "#slidepager-hover-menu", isFlat: true });

		this.el.components["hover-menu__pager"].getHoverMenu().then(menu => {
		// If we got removed while waiting, do nothing.
		if (!this.el.parentNode) return;

		this.hoverMenu = menu;
		this.nextButton = **this**.el.querySelector(".next-button [text-button]");
		this.prevButton = **this**.el.querySelector(".prev-button [text-button]");
        this.pageLabel = this.el.querySelector(".page-label");
		this.nextButton.object3D.addEventListener("interact", **this**.onNext);
		this.prevButton.object3D.addEventListener("interact", **this**.onPrev);
            
		//** REMOVED **
		//   this.snapButton = this.el.querySelector(".snap-button [text-button]");
		//   this.snapButton.object3D.addEventListener("interact", this.onSnap);     
		this.update();
		this.el.emit("pager-loaded");                                  
	});
  	NAF.utils
	.getNetworkedEntity(this.el)
	.then(networkedEl => {
		this.networkedEl = networkedEl;
		this.networkedEl.addEventListener("pinned", this.update);
		this.networkedEl.addEventListener("unpinned", this.update);
		window.APP.hubChannel.addEventListener("permissions_updated", this.update);
        
		// sync our data.index to the slide-element.index
        // ** ADD **
		this.data.index = this.networkedEl.getAttribute("slide-element").index;
    })
	.catch(() => {}); //ignore exception, entity might not be networked

	//** REMOVED **
	//   this.el.addEventListener("pdf-loaded", async () => {     
	//       this.update();        
	//   }); 
	},
```

The update function stays the same.

```javascript
	async update(oldData) {
		if (this.networkedEl && NAF.utils.isMine(this.networkedEl)) {
			if (oldData && typeof oldData.index === "number" && oldData.index !== this.data.index) {
				this.el.emit("owned-pager-page-changed");
			}
		}
		if (this.pageLabel) {
    		this.pageLabel.setAttribute("text", "value", `${this.data.index + 1}/${this.data.maxIndex + 1}`);
  		}

  		if (this.prevButton && this.nextButton) {
    		const pinnableElement = this.el.components["media-loader"].data.linkedEl || this.el;
    		const isPinned = pinnableElement.components.pinnable && pinnableElement.components.pinnable.data.pinned;
    		this.prevButton.object3D.visible = this.nextButton.object3D.visible =
      !isPinned || window.APP.hubChannel.can("pin_objects");
  		}
	},
```

We remove the references to **media-pdf** and **media-pager** in onNext() and onPrev() functions.  We replace them with references to **slide-element** and **slidemenu-pager**.  In addition, we can remove the **onSnap()** function since we don't use it in this component.

```javascript
	onNext() {
  		if (this.networkedEl && !NAF.utils.isMine(this.networkedEl) && !NAF.utils.takeOwnership(this.networkedEl)) return;
  			const newIndex = Math.min(this.data.index + 1, **this**.data.maxIndex);
    		//** REMOVED **
  			//   this.el.setAttribute("media-pdf", "index", newIndex);
  			//   this.el.setAttribute("media-pager", "index", newIndex);
        
    		//** REPLACED WITH **
			this.el.setAttribute("slide-element", "index", newIndex);
    		this.el.setAttribute("slidemenu-pager", "index", newIndex);
	},

	onPrev() {
		if (this.networkedEl && !NAF.utils.isMine(this.networkedEl) && !NAF.utils.takeOwnership(this.networkedEl)) return;
			const newIndex = Math.max(this.data.index - 1, 0);
    		//** REMOVED **
			//   this.el.setAttribute("media-pdf", "index", newIndex);
			//   this.el.setAttribute("media-pager", "index", newIndex);
	
    		//** REPLACED WITH **
			this.el.setAttribute("slide-element", "index", newIndex);
			this.el.setAttribute("slidemenu-pager", "index", newIndex);
	},

    //** REMOVED **
	//   onSnap() {
  	//       this.el.emit("pager-snap-clicked");
	//   },

	remove() {
		if (this.networkedEl) {
			this.networkedEl.removeEventListener("pinned", this.update);
			this.networkedEl.removeEventListener("unpinned", this.update);
		}
		window.APP.hubChannel.removeEventListener("permissions_updated", this.update);
	}
});
```

One big difference for this component compared to its pdf counterpart is to set the maxIndex attribute to the number of slide images we have in our [slideconfig.js](https://github.com/colinfizgig/Custom-Hubs-Components/blob/main/components/slideconfig.js) file.  

```javascript
this.content = slideconfig.slides;
this.data.maxIndex = this.content.length - 1;
```

Another difference is where we create a new object template that modifies the menu-pager menu to remove the “snap” button.

```javascript
//** REMOVED **
//   this.el.setAttribute("hover-menu__pager", { template: "#pager-hover-menu", isFlat: true });

//** REPLACE WITH **
this.el.setAttribute("hover-menu__pager", { template: "#slidepager-hover-menu", isFlat: true }); 
```

The template **#slidepager-hover-menu** does not exist in standard hubs which means we need to create another piece of code that creates it.  At this point the way we construct the code changes from standard JavaScript, to DOM manipulation JavaScript which looks more verbose.  If we look at an example of JavaScript registering a template in [**network-schemas.js**](https://github.com/colinfizgig/hubs/blob/master/src/network-schemas.js) we can see an example like the following code.

```javascript
NAF.schemas.add({
    template: "#interactable-media",
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
   	}
  	]
});
```

This code tells NAF which components and which properties should be shared with other clients.  You can see that **“media-pager”** is shared along with it’s **“index”**.  The same with **“media-pdf”**. However, one important thing to know about NAF templates is that they need some DOM elements in the current HTML as a reference.  The **#Interactable-media template** can be found in the [**src/hub.html**](https://github.com/colinfizgig/hubs/blob/master/src/hub.html) file inside the **\<a-assets>** tag.  The code shows an abbreviated example.

```HTML
<template id="interactable-media">
	<a-entity
              class="interactable"
              body-helper="type: dynamic; mass: 1; collisionFilterGroup: 1; collisionFilterMask: 15;"
              owned-object-limiter="counter: #media-counter"
              set-unowned-body-kinematic
              is-remote-hover-target
              tags="isHandCollisionTarget: true; isHoldable: true; offersHandConstraint: true; offersRemoteConstraint: true; inspectable: true;"
              destroy-at-extreme-distances
              scalable-when-grabbed
              floaty-object="modifyGravityOnRelease: true; autoLockOnLoad: true;"
              set-yxz-order
              matrix-auto-update
              hoverable-visuals
              position-at-border__freeze="target:.freeze-menu"
              position-at-border__freeze-unprivileged="target:.freeze-unprivileged-menu"
              listed-media use-audio-system-settings
        >
        <a-entity class="ui interactable-ui">
            <a-entity class="freeze-menu" visibility-while-frozen="withinDistance: 100; withPermission: spawn_and_move_media">
                <!-- LOTS OF ELEMENTS EXIST WITHIN THIS MENU SETUP -->
                <!-- I'VE CUT THEM OUT TO SAVE SPACE.  CHECK THE LINK -->
                <!-- ABOVE TO SEE THE WHOLE SETUP FOR INTERACTABLE-MEDIA -->
            </a-entity>
            <a-entity class="freeze-unprivileged-menu" visibility-while-frozen="withinDistance: 100; withoutPermission: spawn_and_move_media;">
                <!-- LOTS OF ELEMENTS EXIST WITHIN THIS MENU SETUP -->
                <!-- I'VE CUT THEM OUT TO SAVE SPACE.  CHECK THE LINK -->
                <!-- ABOVE TO SEE THE WHOLE SETUP FOR INTERACTABLE-MEDIA -->
            </a-entity>
        </a-entity>
    </a-entity>
</template>
```

**The point in showing this here is to show that it can take a lot of elements with components and attributes applied to make a template.  More importantly, templates must exist in the HTML in order to be registered with NAF.**  This means we need to create some JavaScript to inject something like the code above into the **\<a-assets>** tag when our custom hub loads.  We wrap this code in a function and add it to the list of scripts we load in hub.js.

Here is a small part of our template code for the slideshow.  You can see the full code [**here.**](https://github.com/colinfizgig/Custom-Hubs-Components/blob/main/components/slideshow-template.js)

```javascript
function inject_slideshow_template() {
    
  	// create a variable that points to a-assets
  	let assets = document.querySelector("a-assets");

  	// create a new template element in the document
  	let newTemplate = document.createElement("template");
    
  	// set the template id to the name of the template
  	newTemplate.id = "slideshow-media";

  	// create a placeholder element which we can use to attach new
    // elements to the template.
  	let newEntity = document.createElement("a-entity");
    
  	// set or create attributes on the newEntity. the interactable
    // class works with hubs interaction systems to enable interaction
    // on the element
  	newEntity.setAttribute("class", "interactable");
    
  	// create a tempAtt variable to set the value for multiple attributes.
    // The 'body-helper' component is used to set physics attributes on
    // interactable objects
  	let tempAtt = document.createAttribute("body-helper");
  	tempAtt.value = "type: static; mass: 1; collisionFilterGroup: 1; collisionFilterMask: 15;";
    
  	// apply the values to the body-helper attribute created above
  	newEntity.setAttributeNode(tempAtt);
    
  	// create another attribute or component like 'owned-object-limiter'
  	tempAtt = document.createAttribute("owned-object-limiter");
    
  	// set the value of the components counter property to #mediacounter
  	tempAtt.value = "counter: #media-counter";
    
  	// apply the attribute values to the component
  	newEntity.setAttributeNode(tempAtt);

  	// continue to do this for as many components as you need to apply to the
    // templates main entity.
    
    // Don't forget to add your new components and their default properties
    // to the template
  	tempAtt = document.createAttribute("slide-element")
  	tempAtt.value = "index:0"
  	newEntity.setAttributeNode(tempAtt);
  	tempAtt = document.createAttribute("slidemenu-pager")
  	tempAtt.value = "index:0"
  	newEntity.setAttributeNode(tempAtt);

  	// we need to create some child elements on this template to hold the
    // menus we need.
  	let newChild = document.createElement("a-entity");
    
  	// set the classes for the menus
  	newChild.setAttribute("class", "ui interactable-ui");
    
  	// another way to create complex element setups like menus is to set
    // them up in html and turn them into strings which can be set to the
    // menu entity's innerHTML value. It's less readable but requires
    // less coding
  	newChild.innerHTML = "<a-entity class='freeze-menu' visibility-while-frozen='withinDistance: 100; withPermission: spawn_and_move_media'><a-entity mixin='rounded-text-action-button' is-remote-hover-target tags='singleActionButton:true' pin-networked-object-button='tipSelector:.pin-button-tip; labelSelector:.pin-button-label;' position='0 0.125 0.001'><a-entity class='pin-button-label' visible='false' text=' value:pin; width:1.75; align:center;' text-raycast-hack position='0 0 0.001'> </a-entity> <!-- ALL OF THE INNER MENU ELEMENTS WOULD GO INSIDE OF THESE ENTITIES --> </a-entity>";
    
  	// append the child menu with all of its elements to our new entity
  	newEntity.appendChild(newChild);
    
  	// append the newEntity and its children to our newTemplate
  	newTemplate.content.appendChild(newEntity);
    
  	// append our newTemplate to the <a-assets> tag in hub.html
  	assets.appendChild(newTemplate);
};

// Once the template is added to <a-assets> we can register it with NAF
NAF.schemas.add({
  	template: "#slideshow-media",
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
    nonAuthorizedComponents: []
  });
}

// We need to call the function to inject the template and register it
// we use the prefix inject_ in the name in order to isolate our function
// in the global name space.
inject_slideshow_template();
```



With the combination of the inject_slideshow_template() and inject_slideshow_Media() functions, we add a **slidemenu-pager** component, **slide-element** component and a **#slideshow-media** template to Hubs.  Using these new components and templates we can add a slide presentation to our hubs room with the following function.

```javascript
// we add the prefix mod_ to this function to allow it to be targeted by the chat interface using [https://github.com/colinfizgig/Custom-Hubs-Components/blob/ghpages/components/presence-customcmd-setup.js](https://github.com/colinfizgig/Custom-Hubs-Components/blob/ghpages/components/presence-customcmd-setup.js)

function mod_addSlides(){
	//only perform this once if the slideshow does not exist already.
	if(document.querySelector("a-entity[slide-element]") == null){
		var el = document.createElement("a-entity")
		el.setAttribute("id", "slideshow")
		el.setAttribute("networked", { template: "#slideshow-media" } )
		el.setAttribute("media-loader", {animate: false, fileIsOwned: true})
		el.object3D.position.y = 2;
		AFRAME.scenes[0].appendChild(el)
	}else{
		console.log("a slideshow already exists");
	}
}
```

|                                                           |                                    |                                                              |
| :-------------------------------------------------------- | :--------------------------------: | -----------------------------------------------------------: |
| [Hubs Networked Components](Hubs Networked Components.md) | [Index](Customizing hubs Title.md) | [Adding New Scripts to a Custom Client](Adding New Scripts to a Custom Client.md) |