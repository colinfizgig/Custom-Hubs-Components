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
			try{ result.success = true;}
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