#### **Creating Hubs Components:**

##### Standard A-frame components

Creating custom components for hubs can be done in several ways depending on how you want the components to interface between multiple clients.  If, for example, all you want is a custom material that will be placed on objects, a simple A-frame component will work.  However, if you want to be able to add objects with the new material after the hub loads then you need to consider how the objects should be networked between clients.  When a person enters a room in hubs compared to when the room was first created will affect what they see in the room if content was added to the room after it loaded.  The image below shows an example of a custom a-frame object added after a scene has loaded in two clients which enter the hub at different times.  One was the user that created the object the other came in after the object was created.  The component uses a three.js cube camera to capture the environment reflection and apply it to the ball.



![img](https://lh6.googleusercontent.com/b6yKzfL1-ejdY8X_NT9sGMJpVBbScSeJy-2iG_TAz07VUdYb3GNYOtetsorlVIA_e6ae2DIe5b39boGRMzU3iHhtE93JmrTJP_BdqkE3Bvv_UkczgRlcAwlna3LCeF2fpAaLA8ki)



The reflection map for both balls is calculated on each client because it does not need to be networked.  The ball on the left was added after all the objects loaded so it gets all of the objects loaded in the scene in its reflection.  The ball on the right was loaded as the user entered the hub because it had already been created in the other client and parts of it are networked, meaning it shares attributes across clients.  It’s reflection map only has the sky because the ground and other objects had not finished loading yet.  You can target the init/update of components for a-frame in several ways.  **Usually**, you can just add an event listener to the object’s element and listen for the “model-loaded” event like the code snippet below.


```javascript
init: function(){
    var obj = this.el.getObject3D('mesh');
	console.log(obj);
	// obj returns null here because the mesh has not loaded at init
        
   	this.loaded = this.el.addEventListener('model-loaded', () => {
		obj = this.el.getObject3D('mesh');
		console.log(obj);
		// returns the object mesh here because the mesh has loaded
    });
},
```
The problem here is that the **\<a-scene>** in hubs is actually a modified GLTF file that has been packaged in Mozilla [**Spoke**](https://hubs.mozilla.com/spoke) when the scene was created.  This means that it loads like any other object and may take some time to load.  It also means that the simple ball probably loads first since it’s much less complex and does not have a bunch of embedded components for hub’s functionality.  To fix the init function for hubs you can target the object’s sceneEl for it’s **‘model-loaded’** event.

```javascript
 this.loaded = this.el.sceneEl.addEventListener('model-loaded', () => {
```

With that modification when another user enters the hub after the ball is created the reflection map will update when the scene model loads.



![img](https://lh6.googleusercontent.com/QYZcTwN9S7x9n4LrpfVUl_M_WkSGuByCJ9jUzEfAEAXTLK1EbEes9P8h7ryQJu0qcYXFu9KNlkpFkZu9GRmfrsOZfgg0Sls4rgvmltYV7c_gk3k9xFvT7-IitYBn-jF3Y4eQaxq2)



This gets a-frame rendering synced up between clients , but what about components that need to have interaction synced up.  That requires networking the component using networked a-frame (NAF) and may require a custom template to be added to the **NAF.schemas** object.  To illustrate the details we will create a slideshow component which can be advanced or rewound by any user.

|                                       |                                  |                                                         |
| :------------------------------------ | :------------------------------: | ------------------------------------------------------: |
| [Hijacking Hubs.js](HijackingHubs.md) | [Index](CustomizinghubsTitle.md) | [Hubs Networked Components](HubsNetworkedComponents.md) |