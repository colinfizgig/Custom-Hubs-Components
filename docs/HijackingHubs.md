#### **Hijacking Hubs.js**

The [**hubs.js**](https://github.com/mozilla/hubs/blob/hubs-cloud/src/hub.js) file is where most of the code that deals with hubs gets loaded.  Each time you create a room or join a room on hubs a sequence of functions containing javascript promises runs to load the hub.  An example of hubs.js in pseudo code is shown below. In actuality there are many more lines of code in hubs.js, but the pseudo code shows the load sequence in a way that is easier to understand.  First we import all of your dependencies including aframe, components, react and utility functions.  Then we create the **APP** and it’s functions. We will create a **“DOMContentLoaded” event listener** on the document where we join the channels for the Reticulum server once things are connected.  At the end of the event listener we call **handleHubChannelJoined().**   After some initial setup code in **handleHubChannelJoined()** toward the end of the function, is an async promise called **connectToScene()**.  After this code executes is where we want to inject any custom code so that it networks and properly syncs across clients.


```javascript
import "hacks/configs/themes/and/polyfills";
import "aframe";
import "more/hubs/specific/stuff";
import "aframe-components";
import "React-Packages";
import { App } from "./App";

function handleHubChannelJoined(entryManager, hubChannel, messageDispatch, data) {
	// at the bottom of handleHubChannelJoined is the connectToScene promise.
    // It will wait for channel specific data and kick off loading the scene
    // hosted on the server. We can inject code once the scene is loaded.
    
 	const connectToScene = async () => {

  		// add component to network the scene with NAF
  		scene.setAttribute("networked-scene", { });

  		// wait till things are networked correctly, code following the while
    	// command will not execute until the scene is networked
  		while (!scene.components["networked-scene"] || !scene.components["networked-scene"].data) await nextTick();

  		scene.addEventListener("adapter-ready", ({ detail: adapter }) => {
			//run code once the scene is networked*
  		});
        
  		//store the hub in the APP.hub
  		window.APP.hub = hub;
  		updateUIForHub(hub, hubChannel);

  		if (!isEmbed) {
   			//loadEnvironmentAndConnect();*
  		} else {
   			//run code then loadEnvironmentAndConnect();
  		}
        
        // *************************************
  		//    INJECTION OF SCRIPTS GOES HERE 
        // *************************************
        
 	};
 
 	//call the connectToScene function once the hubChannel is joined
 	connectToScene();
}

document.addEventListener("DOMContentLoaded", async () => { 
 	// once the channels are setup run the functions to kick of loading
    // scene elements
 	handleHubChannelJoined(entryManager, hubChannel, messageDispatch, data);
});
```


You can add a bunch of custom component links and network schemas into **hub.js** at the end of **connectToScene()** but that would mean every hub would have the same modifications which is not very efficient.  It is better to inject a “hook” that takes the current **APP.hub.hub_id** and sends a query for code to inject to a simple server which returns links or strings of code that the “hook” can inject into **hub.html**.  The advantages of this approach are numerous.

> - We only modify the hubs source code in one file
> - We can modify different hubs with different code
> - We can change our modifications without touching hubs
> - We can add additional functionality like sockets for data streams to our top level server
> - Modifying hubs with new code can be done through a simple config file on our top level sever

The code to pull this off consists of a the following modification to the hub.js file


```javascript
	const loadEnvironmentAndConnect = () => {
  		// at the bottom of loadEnvironmentAndConnect we call the          
  		// injectScripts function added after the if statement below
  		injectScripts();
	} 

 	window.APP.hub = hub;
 	updateUIForHub(hub, hubChannel);
 	scene.emit("hub_updated", { hub });
	
 	// loadEnvironmentAndConnect needs to run before injectScripts()
	// or the components will not network
	if (!isEmbed) {
   		loadEnvironmentAndConnect();
 	} else {
   		remountUI({
     		onPreloadLoadClicked: () => {
      			 hubChannel.allowNAFTraffic(true);
				remountUI({ showPreload: false });
				loadEnvironmentAndConnect();
	  		}
   		});
 	}

	function injectScripts(){                          
  		//get the current hub_id and construct a url
  		const myHub = hub.hub_id;
  		const url = "http://localhost:3000/injectScripts?hubid="+ myHub;

 		//fetch the url with a get method which will return scripts to inject
  		fetch(url, {
    		method: 'get'
  		})
  		.then(function(body){   
    			return body.text(); 
  			}).then(function(data) {
    			var myUrls = data.split(",");
    			var myBody = document.querySelector("body");
    			for(var items of myUrls) {
       				if(items == "noUrls"){
         				Break; 
       				}
       				//inject some scripts based on the returned array of urls
       				var newScript = document.createElement("script");
       				newScript.type = 'text/javascript';
       				var srcAt = document.createAttribute('src');
       				srcAt.value = items;
       				newScript.setAttributeNode(srcAt);
       				myBody.appendChild(newScript);
    			}
  			});
 		}
	};
 	connectToScene();
}
```



The code consists of a single function that gets the current hub_id and uses a fetch() command to query our top level server for a string of comma delimited urls. The top level server code is a simple Express app with one route.

```javascript
const http = require("http");
const https = require("https");
const express = require("express");
const cors = require('cors');

//load the config files which contains our hub_ids and their urls
const config = require('./config');

const app = express();
app.use(cors());
app.get( 
        "/injectScripts",
        async (req, res) => {
              let result = {} 
              Try{ result.success = true;}
              catch(e){ result.success = false;} 
              finally{
                 var myHub = req.query.hubid; 
                 var myUrls = ""; 
                 for (var hubObj of config.hubsarray){
                     if(hubObj.hub_id == myHub){
                        myUrls = hubObj.urls;
                        res.send(myUrls);
                        break; 
                     } 
                 } 
                 if(myUrls == ""){ 
                        res.send("noUrls");
                 }
          }
    });

var httpServer = http.createServer(app);

httpServer.listen(3000, () => 
  	console.log("HTTP Server running on port 3000")
);
```



The config file should be a module that looks something like the following

```javascript
var config = {};

config.hubsarray = [
    {hub_id: '2MCVA2f', 			
urls:'https://user.github.io/githubrepo/components/component1.js,https://user.github.io/githubrepo/components/component2.js,https://user.github.io/githubrepo2/components/component3.js,https://user.github.io/githubrepo3/components/component5.js,https://user.github.io/githubrepo4/components/component6.js,https://user2.github.io/githubrepo5/components/script1.js'},
	{hub_id: '8T88rLN', urls:'https://user2.github.io/githubrepo5/components/component1.js,https://user2.github.io/githubrepo5/components/component2.js'},
	{hub_id: 'kBquF8A', urls:'https://user1.github.io/githubrepo3/components/component1.js,https://user2.github.io/githubrepo5/components/component2.js'}
];

module.exports = config;
```



This file consists of the variable config which has an attribute called hubsarray consisting of an array of JSON objects each with a hub_id and URLs attribute.  The URLs should point to a CDN which hosts your custom JavaScript. In this case they point to GHpages hosted files on Github. You can explore setting up Github repos as CDNs at **[pages.github.com](https://pages.github.com/)**.

To test your client locally run the top level server from a system console by shifting into the directory where your toplevelserver.js and config.js files are located.   Then run **node toplevelserver.js** and open a browser.  If you try to hit [**http://localhost:3000/injectScripts?hubid=someserverid**](http://localhost:3000/injectScripts?hubid=someserverid) you should see the text “noUrls” show up in your browser window.  This is because “someserverid” was probably not a hubid that you put in your config file.  If you try the same URL with **?hubid=\<some hubid in your config>** then you will get the URLs string returned. If we run this with our custom client hub.js then it should inject those URLs into the hub.html as scripts and depending how those scripts are coded we should be able to add custom functions to hubs.

You can do a lot of other neat things with this top level server if you want to.  It could serve live streams of data from sensors or packages of data for specific types of 3d effects or 3d buffer objects.  Anything that can be passed into Three.js can be served to hubs from this top level server.  You have to create some code to handle these data streams.  Now that you have a custom client for getting data or code injected into hubs you can play around with making custom components to handle the new inputs.

|                                                              |                                                              |                                                              |
| :----------------------------------------------------------- | :----------------------------------------------------------: | -----------------------------------------------------------: |
| [Hubs Load Sequence](https://github.com/colinfizgig/Custom-Hubs-Components/docs/blob/ghpages/HubsLoadSequence.md) | [Index](https://github.com/colinfizgig/Custom-Hubs-Components/docs/blob/ghpages/CustomizinghubsTitle.md) | [Creating Hubs Components](https://github.com/colinfizgig/Custom-Hubs-Components/docs/blob/ghpages/CreatingHubsComponents.md) |