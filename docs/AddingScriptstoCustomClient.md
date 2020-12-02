#### **Adding New Scripts to a Custom Client**

When we call **mod_addSlides()** in our custom client now it will check to see if an entity with the slide-element component on it exists and if it does not it will create one using the **#slideshow-media template**.  To inject the scripts for this into our custom client we just need to add the following line to our **config.hubsarray** variable in the top-level-server [**config.js**](https://github.com/colinfizgig/Custom-Hubs-Components/blob/ghpages/top-level-main-server/config.js) file.



```javascript
{hub_id: '2MCVA2f', urls:'https://colinfizgig.github.io/Custom-Hubs-Components/components/slideconfig.js,https://colinfizgig.github.io/Custom-Hubs-Components/components/slideshow-template.js,https://colinfizgig.github.io/Custom-Hubs-Components/components/hubs-slide-show.js,https://colinfizgig.github.io/Custom-Hubs-Components/components/presence-customcmd-setup.js'}
```



The hub_id is the hub capable of running these scripts in our custom client and the URLs are links to our scripts hosted on Github GHpages.  The final script is a function which binds all functions with the prefix “mod\_” to the chat interface in hubs.  It links the function name minus the “mod\_” to a command which can be entered in the chat to spawn our presentation.  By forcing the script to only target scripts with the mod_ prefix we limit the functions which can be executed with chat commands and avoid name collisions in the global namespace.

##### **Hosting Scripts using GHpages on Github**

Once you have scripts to inject into the client you need someplace to host them where they can be served to the client for injection.  We could host them from our top-level-server using another route in Express.  However, it is better and more efficient to add them to a Github repository and set that repo up to serve as a CDN using GHpages.  You can read how to set your repository up this way at [**https://pages.github.com/**](https://pages.github.com/)**.**

The advantages of hosting and storing your custom code this way are too numerous to mention.  The largest advantage though is that you won’t have to constantly update your top-level-server on your cloud setup.  In addition you can opensource your components and benefit from other developer’s help in keeping them maintained. 

|                                                              |                                                              |
| :----------------------------------------------------------- | -----------------------------------------------------------: |
| [Cannibalizing Components from Hubs](https://github.com/colinfizgig/Custom-Hubs-Components/docs/blob/ghpages/CannibalizingComponents.md) | [Index](https://github.com/colinfizgig/Custom-Hubs-Components/docs/blob/ghpages/CustomizinghubsTitle.md) |