let socket = io();

socket.on("connect", () => {
  console.log("connected to server");
});
