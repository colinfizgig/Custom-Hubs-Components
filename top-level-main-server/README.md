# aelatgt-top-level

This is the setup we're using for a node server to be used in conjunction with Hubs.  This one is set up to run on a small Ubuntu EC2 instance on aelatgt.net, with Hubs installed at hubs.aetatgt.net.

To test locally, run

```
npm install
node index.js
```

You'll see in the code that it either runs an HTTP or HTTPS server, depending on if the certificates can be found. Our production server uses HTTPS, with certs created by the LetsEncrypt certbot.  When you run locally, it should create an HTTP server.

To create your own AWS setup, must set up Nginx and LetsEncrypt.  The Nginx-config copied to whatever file you're using, for us it's /etc/nginx/sites-available/aelatgt-top

See the blog post at https://blairmacintyre.me/2020/10/17/setting-up-a-node-server-on-aws/ for an overview of how this was set up.