// set up mapping of events for input-mapping component.
	  
	//---------------------------------------------------------------
	// code to bind keyEvents to other events
	// this is a hack to inject control by VR control into
	// html5 keyboard canvas games that use keyboard events.
	//---------------------------------------------------------------
	keySim = {};
	keySim.keydown = function(k) {
		var oEvent = document.createEvent('KeyboardEvent');

			// Chromium Hack
			Object.defineProperty(oEvent, 'keyCode', {
				get : function() {
					return this.keyCodeVal;
				}
			});     
			Object.defineProperty(oEvent, 'which', {
				get : function() {
					return this.keyCodeVal;
				}
			});     

			if (oEvent.initKeyboardEvent) {
				oEvent.initKeyboardEvent("keydown", true, true, document.defaultView, false, false, false, false, k, k);
			} else {
				oEvent.initKeyEvent("keydown", true, true, document.defaultView, false, false, false, false, k, 0);
			}

			oEvent.keyCodeVal = k;

			if (oEvent.keyCode !== k) {
				alert("keyCode mismatch " + oEvent.keyCode + "(" + oEvent.which + ")");
			}

			document.dispatchEvent(oEvent);
		}
			
		// keyup
			
		keySim.keyup = function(k) {
			var oEvent2 = document.createEvent('KeyboardEvent');

				// Chromium Hack
				Object.defineProperty(oEvent2, 'keyCode', {
					get : function() {
						return this.keyCodeVal;
					}
				});     
				Object.defineProperty(oEvent2, 'which', {
					get : function() {
						return this.keyCodeVal;
					}
				});     

				if (oEvent2.initKeyboardEvent) {
					oEvent2.initKeyboardEvent("keyup", true, true, document.defaultView, false, false, false, false, k, k);
				} else {
					oEvent2.initKeyEvent("keyup", true, true, document.defaultView, false, false, false, false, k, 0);
				}

			oEvent2.keyCodeVal = k;

			if (oEvent2.keyCode !== k) {
				alert("keyCode mismatch " + oEvent2.keyCode + "(" + oEvent2.which + ")");
			}

			document.dispatchEvent(oEvent2);
		}
		
		// event handlers for controllers below
		// keys : spacebar = 32, left = 74, right = 76, up = 73, down = 77, enter = 13
		//
		
		
			document.addEventListener('thumbleftstart', function (evt) {
				keySim.keydown(74);
			});
			document.addEventListener('thumbleftend', function (evt) {
				keySim.keyup(74);
			});
			document.addEventListener('thumbrightstart', function (evt) {
				keySim.keydown(76);
			});
			document.addEventListener('thumbrightend', function (evt) {
				keySim.keyup(76);
			});
			document.addEventListener('thumbupstart', function (evt) {
				keySim.keydown(73);
			});
			document.addEventListener('thumbupend', function (evt) {
				keySim.keyup(73);
			});
			document.addEventListener('thumbdownstart', function (evt) {
				keySim.keydown(77);
			});
			document.addEventListener('thumbdownend', function (evt) {
				keySim.keyup(77);
			});	


		
		AFRAME.registerComponent('y-button-listener', {
			init: function () {
				var el = this.el;
				el.addEventListener('ybuttondown', function (evt) {
					keySim.keydown(13);
				});
				el.addEventListener('ybuttonup', function (evt) {
					keySim.keyup(13);
				});
			}
		});
		
		AFRAME.registerComponent('a-button-listener', {
			init: function () {
				var el = this.el;
				el.addEventListener('abuttondown', function (evt) {
					keySim.keydown(32);
				});
				el.addEventListener('abuttonup', function (evt) {
					keySim.keyup(32);
				});
			}
		});
		
		AFRAME.registerComponent('b-button-listener', {
			init: function () {
				var el = this.el;
				el.addEventListener('bbuttondown', function (evt) {
					keySim.keydown(13);
				});
				el.addEventListener('bbuttonup', function (evt) {
					keySim.keyup(13);
				});
			}
		});
		
		AFRAME.registerComponent('x-button-listener', {
			init: function () {
				var el = this.el;
				el.addEventListener('gripdown', function (evt) {
					keySim.keydown(32);
				});
				el.addEventListener('gripup', function (evt) {
					keySim.keyup(32);
				});
			}
		});

		AFRAME.registerComponent('canvas-updater', {

          tick: function () {
	      var el = this.el;
	      var material;

	      material = el.getObject3D('mesh').material;
	      if (!material.map) { return; }
              material.map.needsUpdate = true;
          }
      });