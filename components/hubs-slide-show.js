		
	function inject_slideshow_Media() {
		
		AFRAME.registerComponent("slidemenu-pager", {
		  schema: {
			index: { default: 0 },
			maxIndex: { default: 0 }
		  },

		  init() {
			this.onNext = this.onNext.bind(this);
			this.onPrev = this.onPrev.bind(this);
			this.update = this.update.bind(this);
			
			this.content = slideconfig.slides;
			this.data.maxIndex = this.content.length - 1;

			this.el.setAttribute("hover-menu__pager", { template: "#slidepager-hover-menu", isFlat: true });
			this.el.components["hover-menu__pager"].getHoverMenu().then(menu => {
			  // If we got removed while waiting, do nothing.
			  if (!this.el.parentNode) return;

			  this.hoverMenu = menu;
			  this.nextButton = this.el.querySelector(".next-button [text-button]");
			  this.prevButton = this.el.querySelector(".prev-button [text-button]");
			  this.pageLabel = this.el.querySelector(".page-label");

			  this.nextButton.object3D.addEventListener("interact", this.onNext);
			  this.prevButton.object3D.addEventListener("interact", this.onPrev);

			  this.update();
			  //this.el.emit("pager-loaded");
			});

			NAF.utils
			  .getNetworkedEntity(this.el)
			  .then(networkedEl => {
				this.networkedEl = networkedEl;
				this.networkedEl.addEventListener("pinned", this.update);
				this.networkedEl.addEventListener("unpinned", this.update);
				window.APP.hubChannel.addEventListener("permissions_updated", this.update);
				this.data.index = this.networkedEl.getAttribute("slide-element").index;
			  })
			  .catch(() => {}); //ignore exception, entity might not be networked
			
		  },

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

		  onNext() {
			if (this.networkedEl && !NAF.utils.isMine(this.networkedEl) && !NAF.utils.takeOwnership(this.networkedEl)) return;
			const newIndex = Math.min(this.data.index + 1, this.data.maxIndex);
			this.el.setAttribute("slide-element", "index", newIndex);
			this.el.setAttribute("slidemenu-pager", "index", newIndex);
		  },

		  onPrev() {
			if (this.networkedEl && !NAF.utils.isMine(this.networkedEl) && !NAF.utils.takeOwnership(this.networkedEl)) return;
			const newIndex = Math.max(this.data.index - 1, 0);
			this.el.setAttribute("slide-element", "index", newIndex);
			this.el.setAttribute("slidemenu-pager", "index", newIndex);
		  },

		  remove() {
			if (this.networkedEl) {
			  this.networkedEl.removeEventListener("pinned", this.update);
			  this.networkedEl.removeEventListener("unpinned", this.update);
			}

			window.APP.hubChannel.removeEventListener("permissions_updated", this.update);
		  }
		});

		//Query assets in order to setup template
		let assets = document.querySelector("a-assets");
		// create a new template variable
		let pageHoverTemplate = document.createElement("template");
		// create template id
		pageHoverTemplate.id = "slidepager-hover-menu";
		// create a new entity for the template so we can append it to the assets later
		// normally this is done in the Hubs.html "bootstrap" file
		let menuEntity = document.createElement("a-entity");

		menuEntity.setAttribute("class", "ui interactable-ui hover-container");
		menuEntity.setAttribute("visible", "false");
		
		menuEntity.innerHTML = "<a-entity class='prev-button' position='-0.50 0 0'><a-entity is-remote-hover-target tags='singleActionButton:true; isHoverMenuChild: true;' mixin='rounded-text-button' slice9='width: 0.2'><a-entity sprite icon-button='image: prev.png; hoverImage: prev.png;' scale='0.070 0.070 0.070' position='0 0 0.005' ></a-entity></a-entity></a-entity><a-entity class='page-label' position='0 -0.2 0' text='value:.; width:2; align:center;' text-raycast-hack></a-entity><a-entity class='next-button' position='0.50 0 0'><a-entity is-remote-hover-target tags='singleActionButton:true; isHoverMenuChild: true;' mixin='rounded-text-button' slice9='width: 0.2'><a-entity sprite icon-button='image: next.png; hoverImage: next.png;' scale='0.070 0.070 0.070' position='0 0 0.005' ></a-entity></a-entity></a-entity>";
		
		pageHoverTemplate.content.appendChild(menuEntity);
						
		// once the template is created you append it to the assets
		assets.appendChild(pageHoverTemplate);
		

		AFRAME.registerComponent("slide-element", {
		schema: {
			index: { default: 0 },
			slideScale: {default: 5}
		},

		init() {

			//this.onNext = this.onNext.bind(this);
			this.update = this.update.bind(this);
			this.setupSlides = this.setupSlides.bind(this);

			//if you want to disable the menu and make the slide clickable and loopable
			//then uncomment the line below and remove the slidemenu-pager component from the object
			
			//this.el.object3D.addEventListener("interact", this.onNext);
			
			//get our content from the variable in the script injected above.
			this.content = slideconfig.slides;
			this.max = this.content.length;

			NAF.utils
				.getNetworkedEntity(this.el)
				.then(networkedEl => {
					this.networkedEl = networkedEl;
					this.networkedEl.addEventListener("pinned", this.update);
					this.networkedEl.addEventListener("unpinned", this.update);
					window.APP.hubChannel.addEventListener("permissions_updated", this.update);
					this.networkedEl.object3D.scale.setScalar(this.data.slideScale);
					this.currentSlide = this.networkedEl.getAttribute("slide-element").index;
					this.setupSlides();
				})
				.catch(() => {}); //ignore exception, entity might not be networked

			},

			async update(oldData) {
				this.currentSlide = this.data.index;
				
				this.el.setAttribute("media-loader", {src: this.content[this.currentSlide], fitToBox: true, resolve: false});

				if (this.networkedEl && NAF.utils.isMine(this.networkedEl)) {
					if (oldData && typeof oldData.index === "number" && oldData.index !== this.data.index) {
						this.networkedEl.setAttribute("slide-element", {index: this.currentSlide});
					}
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
				this.currentSlide = this.networkedEl.getAttribute("slide-element").index;
				this.el.setAttribute("media-loader", {src: this.content[this.currentSlide], fitToBox: true, resolve: false})
			}
		});
}

// we add the prefix inject_ to our utility functions to isolate them from the global namespace
inject_slideshow_Media();

// we add the prefix mod_ to this function to allow it to be targeted by the chat interface
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
