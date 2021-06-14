// the following is a presence checker which waits for the chat window to be opened so that it
// can attach new commands which will start the mods that we inject. There are other ways to
// do this like trigger-volumes, but this gives us more control and predictable behavior

var chatWindowIntervalCheck;
var chatButtonIntervalCheck
var groupCreationObserver;
var groupObserver;
var currentGroup = null;

// function to detect when the button that opens chat logs has been created
chatButtonIntervalCheck = setInterval(() => {
	// once found we assign it an onclick function to tell us to
	// start searching for new chat messages
	if (document.querySelector("[class*=accent4]") !== undefined) {
		console.log("chat button found");

		// start searching for the chat window once the chat button is clicked
		document.querySelector("[class*=accent4]").onclick = detectLog;

		// once we find the chat button we can stop searching for it
		clearInterval(chatButtonIntervalCheck);
	}
}, 2000)

// function to detect when a new chat window is pulled up
function detectLog() {
	chatWindowIntervalCheck = setInterval(() => {
		if (document.querySelector("[class*=message-list]") != null) {
			console.log("chat window open");

			// set up observers for the window
			checkPresence();

			// detect when an event occurs that closes the chat window so that the chat button can be reset to searching for when it is opened			
			document.querySelector("[class*=icon-button]").onclick = document.querySelector("[class*=accent4]").onclick = function () {
				groupCreationObserver.disconnect();
				console.log("chat window closed");
				document.querySelector("[class*=accent4]").onclick = detectLog;
			}
			
			// once we find the chat window we can stop searching for it
			clearInterval(chatWindowIntervalCheck);
		} else {
			console.log("searching for chat window");
		}
	}, 300);
}



// this function watches for 2 different things: 
// new message groups in message-list (the chat window) and new child messages
// anytime a new user says something a new element is added to the message list
// all of that user's subsequent messages (until someone else sends a message) will be children of that new element
// watchedNode tracks the new element, and watchedNode2 tracks that element's children
function checkPresence() {

	const watchedNode = document.querySelector("[class*=message-list]");

	// check if we were observing a group before checkPresence() was called
	// this will be the case if this isn't the first time the chat window is being opened
	// if it isn't the first time, then set the groupObserver to the group it was previously observing
	if (currentGroup != null) {
		const watchedNode2 = document.querySelectorAll("[class*=message-group-messages]")[document.querySelectorAll("[class*=message-group-messages]").length - 1];
		groupObserver.observe(watchedNode2, { childList: true });
	}

	// observer that watches for new message groups
	groupCreationObserver = new MutationObserver(function (mutations) {
		mutations.forEach(function (mutation) {
			if (mutation.addedNodes) {
				for (var n of mutation.addedNodes) {
					// the first message sent in a group is only detected by the groupCreationObserver, 
					// so we send the event through this observer rather than the groupObserver
					document.querySelector("a-scene").dispatchEvent(new CustomEvent("chatevent", { bubbles: true, detail: { text: n.lastChild.textContent } }));

					// begin observing for new children in the current message group
					const watchedNode2 = document.querySelectorAll("[class*=message-group-messages]")[document.querySelectorAll("[class*=message-group-messages]").length - 1];
					currentGroup = watchedNode2;

					groupObserver = new MutationObserver(function (mutations) {

						mutations.forEach(function (mutation) {

							if (mutation.addedNodes) {
								for (var i of mutation.addedNodes) {
									//if a new child is found then send then check if the message is a command
									document.querySelector("a-scene").dispatchEvent(new CustomEvent("chatevent", { bubbles: true, detail: { text: i.textContent } }));
								}
							}
						})
					});
					groupObserver.observe(watchedNode2, { childList: true });
				}
			}
		})

	});

	groupCreationObserver.observe(watchedNode, { childList: true });
}

document.querySelector("a-scene").addEventListener("chatevent", e => {

	// function we want to run we add mod_ to the string to isolate our custom functions
	// from the global namespace and prevent people from running functions through chat
	// interface unless it's one we've added for that purpose.

	var myMessage = e.detail.text;

	var fnstring = "mod_" + myMessage;
	console.log("function string = " + fnstring);
	// find object
	var fn = window[fnstring];

	// is object a function?
	if (typeof fn === "function") {
		fn();
	} else {
		console.log(fn + " is not a function");
	}
});

