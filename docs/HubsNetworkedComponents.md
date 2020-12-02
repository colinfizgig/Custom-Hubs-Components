#### **Hubs Networked Components**

We want to create a new type of presentation object for Hubs that takes a list of images hosted online and pulls them into Hubs as a presentation that we can step forward and backward through.  Now assume we want any user to be able to step through them like a ‘kiosk’ interface.  This means…

> - We need to create a component which takes those images and displays them in A-frame.
> - The component needs some way of keeping track of which image it’s on.
> - This current image attribute needs to be shared across clients.
> - We need to pass the current image to all of the other clients as the client loads.  This means you can login to the room late and still know there is a new slide show and it is on x slide.
> - We may not want the slideshow present in the room at the start.  We may want to make it load later.  This means we need to add an interface for instantiating the slideshow. 
> - We probably don’t want other people figuring out how to load the slideshow a second time after it’s already created so we put a limit on how many slideshows the room can have.
> - Speaking of rooms, we only want to load the slideshow in places that need it.  This means we need a way to limit which hub it can load into.
> - If there are already hubs interfaces that solve some of these things and add functionality for our slideshow we probably want to leverage those or modify them in some way that works for us.



Using our custom client we can accomplish this list of tasks with three ‘smallish’ scripts.  One script is specific to the slideshow [[ link hubs-slide-show.js on github](https://raw.githubusercontent.com/colinfizgig/Custom-Hubs-Components/main/components/hubs-slide-show.js) ] another script that allows us to modify the slides loaded for the presentation [ [link to slideconfig.js on github](https://raw.githubusercontent.com/colinfizgig/Custom-Hubs-Components/main/components/slideconfig.js) ] and finally a third script that lets us bind the function **addSlides()** to a chat command *‘addSlides*’ [ [link to presence-customcmd-setup.js on github](https://raw.githubusercontent.com/colinfizgig/Custom-Hubs-Components/main/components/presence-customcmd-setup.js) ].  This final script gets the job done but introduces the potential for problems which we will discuss later.  I’ll go over what these scripts do after a little description of how all of this works in Hubs.

**A-frame component lifecycle in Hubs**

As we discussed in the previous sections, how and when code gets initialized in Hubs affects the way the client executes that code and what the user experiences.  Said another way, when you initialize a component or load it in the lifecycle of the hub/room affects its behavior.  On top of that, how the component itself is coded to share functions across clients may affect the user experience differently in each client.

An A-frame component, by default, has several ‘lifecycle’ functions.  They are **init**, **tick**, **update**, **play**, **pause**, and **remove**.  Init is the first sequence and potentially the most complex depending on what the component does.  A standard a-frame component runs init when the component’s parent entity loads.  Usually this occurs when the a-scene is loaded but as we saw in the section above loading the scene does not mean every object in the scene is ready or loaded.  Media (images, movies, objects, gltf files) can load asynchronously to other elements in the scene.  In the case of Hubs the scene is actually composed of several components embedded in a gltf model with geometry, materials, textures, lights and cameras.  This scene model gets unpacked as an **\<a-scene>** with many **\<a-entity>**’s when it is loaded into a Hub.  Because we start a hub with a pre-existing hub.html file as a bootstrap for loading other elements; Relying on an initializing event related to a-scene is unreliable in Hubs.  The scene may exist already and then be re-loaded with new content based on some component attached to it or one imported in hub.js.  The example of the reflection ball above illustrates the point, but it only scratches the surface as far as coordinating elements between clients.  If all we used in Hubs were standard a-frame components there would be no way to share interaction across clients.  When a component needs to communicate with another client we need to include some NAF (networked aframe) initialization code in the components init file which sets it up to be networked.  For our slide presentation component the init with its NAF setup looks like the following.

```javascript
init() {
  	this.onNext = this.onNext.bind(this);  this.update = this.update.bind(this);
  	this.setupSlides = this.setupSlides.bind(this);

  	//get our content from the variable in the script injected above.
  	this.content = slideconfig.slides;
  	this.max = this.content.length;

  	NAF.utils 
    	.getNetworkedEntity(this.el)
    	.then(networkedEl => { 
    		this.networkedEl = networkedEl; 
    		this.networkedEl.addEventListener("pinned", **this**.update); 
    		this.networkedEl.addEventListener("unpinned", **this**.update); 
    		window.APP.hubChannel.addEventListener("permissions_updated", this.update);
        
    		this.networkedEl.object3D.scale.setScalar(this.data.slideScale);  
    		this.currentSlide = this.networkedEl.getAttribute("slide-element").index;
        
    		this.setupSlides();
  	}) 
  	.catch(() => {}); //ignore exception, entity might not be networked
},
```



This extra code in the init sets up the functionality that will be “shared” across the network it creates a networkedEl out of the entity the component is applied to and creates even listeners that will call the update function when the component is pinned, unpinned or when the permissions in the hubChannel are updated.  On top of that it sets the media scale and most importantly the currentSlide to the component’s index attribute.  Then once the networking is accomplished, it runs setupSlides() which creates the slideshow.

```javascript
setupSlides(){
      this.currentSlide = this.networkedEl.getAttribute("slide-element").index;
      this.el.setAttribute("media-loader", {src: this.content[this.currentSlide], fitToBox: true, resolve: false});
}
```

The important thing to notice here is the use of the **“media-loader” component**.  This is a hubs component that already takes care of loading new media into hubs, whether it’s images, video, pdfs or gltfs.  This means that with a little customization of the media-loader component you could create a slideshow that can contain all of these media elements.  The main issue with using the media-loader in its default form is that it injects menu structures on top of each different media type which may not work for our presentation menu.  By leveraging this component in our custom component we can leverage its functionality without having to create redundant functions to load our images for the presentation.

The final function to get the slideshow to work is the async update(). Update was linked to event listeners on the networkedEl and hubChannel in the NAF setup in Init.  When a user pins, unpins or takes ownership of the object Update will run.  In hubs the act of clicking on an object can take ownership of the object so this means when the object is clicked the update will run.

```javascript
async update(oldData) {
      //set the currentSlide to the current data index
      this.currentSlide = this.data.index;

      //set the media-loader to the currentSlide one more or one less	
      this.el.setAttribute("media-loader", {src: this.content[this.currentSlide], fitToBox: true, resolve: false});
  
      //if the entity is networked and owned by the user who clicked it then...
      if (this.networkedEl && NAF.utils.isMine(this.networkedEl)) {

		//if the index number if different then...
		if (oldData && typeof oldData.index === "number" && oldData.index !== this.data.index) {

			//set the component's index attribute to the new currentSlide number
			this.networkedEl.setAttribute("slide-element", {index: this.currentSlide});
		}
  	}
},
```



All this function does is get the current index number and set the media-loader content to that index.  Then it updates its own index to keep track of the current slide number.   You may notice at this point that there is not a function on this component which actually increases or decreases the index value.  Which means it can’t change slides at this point. We could attach a function called onNext which would wait for interaction/click on the slide and increment the index in one direction, but it’s better to add an interface to the slideshow which can go forward and backward in the slides.  To do this we add another [**“slidemenu-pager” component**](https://github.com/colinfizgig/Custom-Hubs-Components/blob/main/components/hubs-slide-show.js) which attaches to the slideshow and is controlled by a menu attached to the slideshow.

|                                                              |                                                              |                                                              |
| :----------------------------------------------------------- | :----------------------------------------------------------: | -----------------------------------------------------------: |
| [Creating Hubs Components](https://github.com/colinfizgig/Custom-Hubs-Components/blob/ghpages/docs/CreatingHubsComponents.md) | [Index](https://github.com/colinfizgig/Custom-Hubs-Components/blob/ghpages/docs/CustomizinghubsTitle.md) | [Cannibalizing Components from Hubs](https://github.com/colinfizgig/Custom-Hubs-Components/blob/ghpages/docs/CannibalizingComponents.md) |

