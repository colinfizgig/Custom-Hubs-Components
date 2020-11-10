const fs = require("fs");
const http = require("http");
const https = require("https");
const socketIO = require("socket.io");
const express = require("express");
const cors = require('cors')

const app = express();
app.use(cors());

app.use(express.static("public"));

app.get(
  "/.well-known/acme-challenge/sdk7Ne4KyfDw6dLwD39qIqJ8BcFiAWTLYLeZjhE9ylc",
  (req, res) => {
    res.send(
      "sdk7Ne4KyfDw6dLwD39qIqJ8BcFiAWTLYLeZjhE9ylc.VeFbm-Pcx9jG1LNNYKt1-ssk8U1QMse-QJsLzcWPGiI"
    );
  }
);

const myversion = "c75bc3d1f3d050c5b50385c3c7dbef770d0c692e";
app.get(
	"/injectSlideshow",
	async (req, res) => {
			let result = {}
			try{
				result.success = true;
			}
			catch(e){
				result.success = false;
			}
			finally{
				var myScene = req.query.hubscene;
				if(myScene == "Y8SYx7W"){
					res.send("https://cdn.jsdelivr.net/gh/colinfizgig/Custom-Hubs-Components@"+ myversion +"/components/camera-cube-env.js"+","+"https://cdn.jsdelivr.net/gh/colinfizgig/Custom-Hubs-Components@"+ myversion +"/components/hubs-slide-show.js"+","+"https://cdn.jsdelivr.net/gh/colinfizgig/Custom-Hubs-Components@"+ myversion +"/components/interactable-ball.js"
					);
				}else{
					res.send(result);
				}
			}
	});

/////////
const privKeyFileName = "/etc/letsencrypt/live/aelatgt.net/privkey.pem";
const certFileName = "/etc/letsencrypt/live/aelatgt.net/cert.pem";
const chainFileName = "/etc/letsencrypt/live/aelatgt.net/chain.pem";

// this will either be an http or https server
var httpServer;

if (
  fs.existsSync(privKeyFileName) &&
  fs.existsSync(certFileName) &&
  fs.existsSync(chainFileName)
) {
  const privateKey = fs.readFileSync(privKeyFileName, "utf8");
  const certificate = fs.readFileSync(certFileName, "utf8");
  const ca = fs.readFileSync(chainFileName, "utf8");

  const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca,
  };

  httpServer = https.createServer(credentials, app);
  httpServer.listen(3001, () =>
    console.log("HTTPS Server running on port 3001")
  );
} else {
  console.log("https certs are not available, not starting https server");
  httpServer = http.createServer(app);

  httpServer.listen(3000, () => 
    console.log("HTTP Server running on port 3000")
  );
}

// Starting for either the http or https servers
const io = socketIO.listen(httpServer);

io.sockets.on("connection", (socket) => {
  console.log("a user connected");
});
