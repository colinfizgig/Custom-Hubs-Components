#### **Some things to Consider**

One important thing to consider is whether you need to target specific hub’s scenes with your modifications.  If you run the hub’s client with **npm run dev** after logging into your **hubs.mozilla.com account** and authenticating with the email link you will only have access to the **mozilla dev server**.  Running the custom client in Dev mode will only load the default scene into Hubs with no access to other hub_ids or scenes.



![img](https://lh5.googleusercontent.com/oys4rFbfiVnFb93kWaf4Xch_9VLDVdrWAiqzkXUojqKuZffwk1ExQKDqff_xigV2hhLE_Vjf9L5CgPkesE4KwlO0SDtEa6USDL9pSnIKk780l-Dop3Cz1REoRylPlSiZxY3tYJPm)



This will allow you to play around with modifying the hub’s source and injecting things into the default scene, but if you need specific locations or target objects in a .GLB file to link to, it won’t be very useful.  In order to have access to other scenes that you create in Spoke or Blender you will need to connect to your own cloud instance, assuming you have one hosted on AWS or DigitalOcean.  If you do have your own Hubs cloud setup, you can do the same authentication with **hubs.<yourhubscloud>.com** server and **admin id**. Then run **npm start** and direct your browser to **https://localhost:8080** to have access to your personal cloud server. Once you’ve pointed your custom client to your own hubs cloud you’ll have access to any hub_id created on that cloud.  The image below shows a private hubs cloud server with functions I’ve injected using the custom client.



![img](https://lh5.googleusercontent.com/i_H92JgV_1khZyP8lZe-s2ramTYhUFAE8Orj8ZlJQ1YLQCFtTpwzCG3lMZniOMyuuBEyID4bnurFU7xqgXBc7csCTQyVVDoe_2YF1l5HWSk616aEuIyqmcNqzfDOHvhfkjCyB2A4)

|                                                              |                                    |                                             |
| :----------------------------------------------------------- | :--------------------------------: | ------------------------------------------: |
| [Installing a Custom Client for Hubs](installing the custom client.md) | [Index](Customizing hubs Title.md) | [Hubs Load Sequence](Hubs Load Sequence.md) |

