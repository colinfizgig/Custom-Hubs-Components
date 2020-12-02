#### **Hubs Load Sequence**

When the Hubs client is called several things happen depending on where you are in the load sequence. By load sequence I mean the order of pages loaded before you get into an actual “hub” or “room”. To clarify, a hub is really a wrapper that encapsulates an A-frame scene and some objects or components loaded into that scene. So when your client loads the **“Home”** screen that is the beginning of what I’m calling the “load” sequence. From this screen, all that has really loaded is an html file with a sign-in link and some buttons to load the **hub.html** with specific **hub_ids**.



![img](https://lh4.googleusercontent.com/YE8cHBRETzOd8qDXl-G8UM2wUbI0nhxuYb5lk-iTUlJsnBN6P2CdPTwEPMutwiPy3nIEWYLr4RGesALSypDaNmtqfexS5agn-jZNKthOJtbehhoP8DHDTCOXsjqt838BcC8FP0Pq)



If you click on “Create a Room” or one of the room links it will load the file **hub.html** and **hub.js** with either the default hub_id or whichever hub_id you chose by clicking on one of the images. The result is a loaded hub with the lobby screen waiting for you to click enter room. This is the place where most modifications you might make to the custom client can go. We will take a look at the code for each one of these files which can be found in the **“hubs/src”** folder of your hubs-cloud github repo.

#### **Hubs.html**

The [**hubs.html file**](https://github.com/mozilla/hubs/blob/hubs-cloud/src/hub.html) is a placeholder or template for the structure a hub is expected to have.
The code block below shows the skeletal structure of the hub.html. The actual source file has many more elements in it. The main points to know about it’s structure are that it contains an **\<a-scene>** with many components attached that control how Hubs render the scene. Within the a-scene is an **\<a-assets>** element which contains any assets needed at load time for the scene. These include **\<template>** tags which are element groups used by Networked A-frame to create a-frame entities that are networked across clients.

*The code below is meant to illustrate the structure for hub.html, not its actual content. There are many missing elements compared to the actual source file*

```html
<!DOCTYPE html>
<html>
  <head>...</head>
  <body>
   <div id="support-root"></div>
      
   <!-- A-frame scene, templates, entities and components                     -->
   <a-scene
      component1="attribute: value"
      component2="attribute1: value; attribute2: value" >
      <a-assets>
        <img id="id" crossorigin="" src="">
        <img id="id2" crossorigin="" src="">
        <a-asset-item id="obj" src="./obj.glb"></a-asset-item>
        <a-asset-item id="obj1" src="./obj1.glb"></a-asset-item>
          <!-- templates are entities used to create networked elements      -->
          <template id="template_id">
          	<!-- the structure of templates is built out of a-entities       -->
            <!-- with components, classes and tags ( which is a component )  -->
            <a-entity component></a-entity>
          </template>
          <template id="template_id1">
              <a-entity component class="class" tags="sometag: true">
              </a-entity
          </template>
          <a-mixin id="mixin_id" some_component="attribute1: value1">
          </a-mixin>
       </a-assets>
              
       <!-- the rest of the scene contains objects that should be in every  -->
       <!-- Hub like avatars and media counters                             -->
       <a-entity id="hack-entity" visible="false">
       </a-entity>
       <a-entity id="id_1" component="attribute: value;">
       </a-entity>
       <a-entity id="id_2" component="attribute: value;">
       </a-entity>
       <a-entity id="scene-preview-node">
       </a-entity>
   </a-scene>

   <!-- after the scene object there will be some divs for injecting       -->
   <!-- html React elements as an interface on top of the 3D scene         -->

   <div id="ui-root"></div>
  </body>
</html>
```



If you wanted to hard code changes into the custom client you would need to add any new **\<template>** elements you need to network your new functionality here.  These templates would need to include the a-frame element structure of the new interactable objects with any new a-frame components attached to them.  Placing new templates in the hub.html file directly requires the editing and creation of several other files.  You will need to register your new template in [**hubs/src/network-schemas.js**](https://github.com/mozilla/hubs/blob/hubs-cloud/src/network-schemas.js) using the Networked A-frame function NAF.schemas.add().  On top of that, you will need to import any new a-frame components in the [**hubs/src/hub.js**](https://github.com/mozilla/hubs/blob/hubs-cloud/src/hub.js) file.  For each new networked feature in your custom client you will need to edit at least two files and create one.  This makes keeping the Hubs client updated with fixes from Mozilla difficult.  However, there is a better way.  We can modify the just the **hub.js** file with a few functions that will inject any scripts we need from an external CDN.

|                                                       |                                    |                                        |
| :---------------------------------------------------- | :--------------------------------: | -------------------------------------: |
| [Some things to Consider](Some things to Consider.md) | [Index](Customizing hubs Title.md) | [Hijacking Hubs.js](Hijacking Hubs.md) |