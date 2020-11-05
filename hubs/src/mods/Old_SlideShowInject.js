/* examples of usage :
slides.setupSlides()   // load and layout slides with links
slides.nextSlide()     // switch to the next slide (loops)
slides.removeAllMedia() // remove all slides
slides.startAutoPresent() // move from slide to slide in the allotated time then drops them all
slides.dropAllContent()
*/

var slides = {
  timer:20000, //ms
  links:[],
  loaded:[],
  slideScale: 5.0,
  linkScale: 0.0001,
  currentSlide: 0,
  cleanUpSlides,
  nextSlide,
  setupSlides,
  presenting:false,
  autoPresent: null,
  removeAllMedia,
  targetRoom: 'https://hubs.mozilla.com/bxrsafy/awe-nite-berlin-6/'
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
    el.setAttribute("networked", { template: "#scriptable-media" } )
    elements.push(el)
  }
  return elements
}

//---- from Hubs utils ----------------------------------------------

function nextSlide(){ 
  //slides.loaded[slides.currentSlide].object3D.scale.setScalar(slides.slideScale)

  slides.loaded[slides.currentSlide].object3D.scale.setScalar(slides.linkScale)
  //slides.links[slides.currentSlide].object3D.scale.setScalar(slides.linkScale)

  if (slides.currentSlide<slides.loaded.length-1){
    slides.currentSlide++
  } else {
    slides.currentSlide = 0
  }

  slides.loaded[slides.currentSlide].object3D.scale.setScalar(slides.slideScale)

}

function setupSlides(){
  slides.currentSlide = 0
  slides.loaded  = hubs_utils.loadAssetsFromURLs(slides.content.map(s => s.img))
  //slides.links = hubs_utils.loadAssetsFromURLs(slides.content.map(s => s.url))
  var l = slides.content.length
  slides.loaded.map( (s,i) => {
    s.object3D.position.y = 2
    s.object3D.position.x = 1  //1*i - 7 + 0.5
    s.object3D.position.z = (1-(i*0.01)) //(i - l/2) * (i - l/2) / 20 - 3
	s.object3D.scale.setScalar(slides.linkScale);

  })

  slides.loaded[slides.currentSlide].object3D.scale.setScalar(slides.slideScale)
}

function cleanUpSlides(){
  //slides.links.map( s => { s.setAttribute("pinnable", {pinned:false}); s.remove()} )
  slides.loaded.map( s => { s.setAttribute("pinnable", {pinned:false}); s.remove()} )
  //slides.links = []
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
	console.log(this.currentSlide);
	console.log("clicked");
	console.log(this.max);
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

//slides.setupSlides();

/*
temp0.setAttribute("media-loader", "src", "https://hubs-proxy.com/https://fabien.benetou.fr/pub/home/AWE_Berlin/6.jpg")
*/