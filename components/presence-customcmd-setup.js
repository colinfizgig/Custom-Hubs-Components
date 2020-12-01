
// the following ia a presence checker which waits for the chat log to exist so that it
// can attach new commands which will start the mods we inject.  There are other ways to
// do this like trigger-volumes, but this gives us more control and predictable behavior

var presenceIntervalCheck;

if(document.querySelector("[class*=presence-log-in-room]") == null) {
	console.log("the log does not exist yet");
	presenceIntervalCheck = setInterval(function(){ 
		if(document.querySelector("[class*=presence-log-in-room]") != null ) {
			console.log("found presence");
			checkPresence();
		}else{
			console.log("checking presence");
		}
	}, 2000);
}else{
	checkPresence();
}

function checkPresence() {
	
	const watchedNode = document.querySelector("[class^=presence-log]")
	var observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
		  if (mutation.addedNodes) {
			for (var n of mutation.addedNodes){
				
				document.querySelector("a-scene").dispatchEvent(new CustomEvent("chatevent", { bubbles: true, detail: { text: n.textContent } }));
				
				console.log(APP.store.state.profile.displayName)
				console.log(n.textContent)
			}
		  }
		})
	})
	observer.observe(watchedNode, {childList:true});
	
	//once the mutation observer is attached to the presence-log we can clear the interval that attaches it
	clearInterval(presenceIntervalCheck);
}

document.querySelector("a-scene").addEventListener("chatevent", e => {

	var mySplit = e.detail.text.split(":");
	console.log("e.detail.text = " + mySplit[1]);
	
	
	// function we want to run we add mod_ to the string to isolate our custom functions
	// from the global namespace and prevent people from running functions through chat
	// interface unless it's one we've added for that purpose.
	
	var fnstring = "mod_" + mySplit[1];

	// find object
	var fn = window[fnstring];

	// is object a function?
	if (typeof fn === "function"){
		fn();
	}else{
		console.log(fn + " is not a function");
	}
});