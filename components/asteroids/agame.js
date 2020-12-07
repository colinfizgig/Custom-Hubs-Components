/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
 
  // The base Class implementation (does nothing)
  this.Class = function(){};
 
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;
   
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
   
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
           
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
           
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this._super = tmp;
           
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
   
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
   
    // Populate our constructed prototype object
    Class.prototype = prototype;
   
    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;
 
    // And make this class extendable
    Class.extend = arguments.callee;
   
    return Class;
  };
})();

var State = Class.extend({
	init: function(game){
		this.game = game;
	},

	handleInputs: function(){},
	update: function(){},
	render: function(ctx){}
});

/**
 * Global object containing all verticies for the game graphics,
 * see. polygondraw.html
 */
var Points = {
	/**
	ASTEROIDS: [
		[-4,-2,-2,-4,0,-2,2,-4,4,-2,3,0,4,2,1,4,-2,4,-4,2,-4,-2],
		[-3,0,-4,-2,-2,-4,0,-3,2,-4,4,-2,2,-1,4,1,2,4,-1,3,-2,4,-4,2,-3,0],
		[-2,0,-4,-1,-1,-4,2,-4,4,-1,4,1,2,4,0,4,0,1,-2,4,-4,1,-2,0],
		[-1,-2,-2,-4,1,-4,4,-2,4,-1,1,0,4,2,2,4,1,3,-2,4,-4,1,-4,-2,-1,-2],
		[-4,-2,-2,-4,2,-4,4,-2,4,2,2,4,-2,4,-4,2,-4,-2]
	],
	*/
	ASTEROIDS: [],
	SHIP: [-2,0,-3,-3,6,0,-3,3,-2,0],
	EXHAUST: [-2,0,-3,-1,-5,0,-3,1,-2,0],

	LETTERS: [
		[0,6,0,2,2,0,4,2,4,4,0,4,4,4,4,6],                 //A
		[0,3,0,6,2,6,3,5,3,4,2,3,0,3,0,0,2,0,3,1,3,2,2,3], //B
		[4,0,0,0,0,6,4,6],                                 //C
		[0,0,0,6,2,6,4,4,4,2,2,0,0,0],                     //D
		[4,0,0,0,0,3,3,3,0,3,0,6,4,6],                     //E
		[4,0,0,0,0,3,3,3,0,3,0,6],                         //F
		[4,2,4,0,0,0,0,6,4,6,4,4,2,4],                     //G
		[0,0,0,6,0,3,4,3,4,0,4,6],                         //H
		[0,0,4,0,2,0,2,6,4,6,0,6],                         //I
		[4,0,4,6,2,6,0,4],                                 //J
		[3,0,0,3,0,0,0,6,0,3,3,6],                         //K
		[0,0,0,6,4,6],                                     //L
		[0,6,0,0,2,2,4,0,4,6],                             //M
		[0,6,0,0,4,6,4,0],                                 //N
		[0,0,4,0,4,6,0,6,0,0],                             //O
		[0,6,0,0,4,0,4,3,0,3],                             //P
		[0,0,0,6,2,6,3,5,4,6,2,4,3,5,4,4,4,0,0,0],         //Q
		[0,6,0,0,4,0,4,3,0,3,1,3,4,6],                     //R
		[4,0,0,0,0,3,4,3,4,6,0,6],                         //S
		[0,0,4,0,2,0,2,6],                                 //T
		[0,0,0,6,4,6,4,0],                                 //U
		[0,0,2,6,4,0],                                     //V
		[0,0,0,6,2,4,4,6,4,0],                             //W
		[0,0,4,6,2,3,4,0,0,6],                             //X
		[0,0,2,2,4,0,2,2,2,6],                             //Y
		[0,0,4,0,0,6,4,6]                                  //Z
	],

	NUMBERS: [
		[0,0,0,6,4,6,4,0,0,0],                             //0
		[2,0,2,6],                                         //1
		[0,0,4,0,4,3,0,3,0,6,4,6],                         //2
		[0,0,4,0,4,3,0,3,4,3,4,6,0,6],                     //3
		[0,0,0,3,4,3,4,0,4,6],                             //4
		[4,0,0,0,0,3,4,3,4,6,0,6],                         //5
		[0,0,0,6,4,6,4,3,0,3],                             //6
		[0,0,4,0,4,6],                                     //7
		[0,3,4,3,4,6,0,6,0,0,4,0,4,3],                     //8
		[4,3,0,3,0,0,4,0,4,6],                             //9
	]

}

/**
 * Global object containing all Audios for the sounds,
 * 
 */
var Audios = {

	EXPLODE1: "https://colinfizgig.github.io/aframe_Components/asteroids/audio/explode1.mp3",
	EXPLODE2: "https://colinfizgig.github.io/aframe_Components/asteroids/audio/explode2.mp3",
	EXPLODE3: "https://colinfizgig.github.io/aframe_Components/asteroids/audio/explode3.mp3",
	FIRE: "https://colinfizgig.github.io/aframe_Components/asteroids/audio/fire.mp3",
	LIVES: "https://colinfizgig.github.io/aframe_Components/asteroids/audio/life.mp3",
	ISAUCER: "https://colinfizgig.github.io/aframe_Components/asteroids/audio/Isaucer.mp3",
	SFIRE: "https://colinfizgig.github.io/aframe_Components/asteroids/audio/sfire.mp3",
	SSAUCER: "https://colinfizgig.github.io/aframe_Components/asteroids/audio/ssaucer.mp3",
	THRUST: "https://colinfizgig.github.io/aframe_Components/asteroids/audio/thrust.mp3",
	THUMPHI: "https://colinfizgig.github.io/aframe_Components/asteroids/audio/thumphi.mp3",
	THUMPLOW: "https://colinfizgig.github.io/aframe_Components/asteroids/audio/thumplo.mp3"

}

var SoundEffect = Class.extend({

	init: function(mySound, name, looping, offset){

		this.audio = document.createElement("audio");
		this.audio.id = name;

		var source = document.createElement('source');
	    source.src = mySound;

	    this.audio.appendChild(source);

		//this.audio.controls = " ";

		document.body.appendChild(this.audio);

		if(looping) {
			this.audio.addEventListener('ended', function() {
				console.log("looped");
		    	this.currentTime = offset;
		    	this.play();
			}, false);
		}
	},

});


var AsteroidSize = 2;
var DebrisSize = 1;


var GameState = State.extend({
	
	init: function(game){
		this._super(game);
		this.canvasWidth = game.canvas.ctx.width;
		this.canvasHeight = game.canvas.ctx.height;

		this.ship = new Ship(Points.SHIP, Points.EXHAUST, 2, 0, 0);
		this.ship.maxX = this.canvasWidth;
		this.ship.maxY = this.canvasHeight;

		this.lives = 3;
		this.lifeUp = 4000;
		this.lifeTicker = 0;

		this.lifepolygon = new Polygon(Points.SHIP);
		this.lifepolygon.scale(1.5);
		this.lifepolygon.rotate(-Math.PI/2);

		this.gameOver = false;

		this.score = 0;

		this.lvl = 1;

		this.generateLvl();

		this.musicBeat = 70;
		this.thumpPause = this.musicBeat;
		this.timer = 0;
	},

	generateLvl: function() {

		this.thumpPause = this.musicBeat - this.lvl;

		var num = Math.round(15*Math.atan(this.lvl/50)) + Math.min(10, Math.max(3, (Math.round(this.lvl/20))));

		this.ship.x = this.canvasWidth/2;
		this.ship.y = this. canvasHeight/2;

		this.bullets = [];

		this.Radius = Math.random()*5+18;
		this.Noise = Math.random()*8+8;
		this.pointCnt = Math.round(Math.random()*4+7);

		this.asteroids = [];

		this.debris = [];

		for (var i = 0; i < num; i++){
			var x = 0, y = 0;
			if (Math.random() > 0.5) {
				x= Math.random() * this.canvasWidth;
			} else {
				y = Math.random() * this.canvasHeight;
			}
			Points.ASTEROIDS.push(Asteroid.prototype.create(this.Radius, this.Noise, this.pointCnt));
			var astr = new Asteroid(Points.ASTEROIDS[i], AsteroidSize, x, y);
			astr.maxX = this.canvasWidth;
			astr.maxY = this.canvasHeight;

			this.asteroids.push(astr);
		}

	},

	handleInputs: function(input){
		var fireSound = document.getElementById("fire");

		if(!this.ship.visible) {
			if(input.isPressed("spacebar")) {
				if (this.gameOver){
					this.game.nextState = States.END;
					this.game.stateVars.score = this.score;
					return;
				}
				
				this.ship.visible = true;
			}
			
			return;
		}

		if(input.isDown("right")) {
			this.ship.rotate(0.06);
		}
		if(input.isDown("left")) {
			this.ship.rotate(-0.06);
		}
		if(input.isDown("up")) {
			this.ship.addVel();
		}


		if(input.isPressed("spacebar")) {
			
			this.bullets.push(this.ship.shoot());

			fireSound.pause();
			fireSound.currentTime = 0;
			fireSound.play();
		}
	},

	update: function() {

		var thumpHi = document.getElementById("thumpHi");
		var thumpLow = document.getElementById("thumpLow");

		this.timer ++;

		if(this.timer < (thumpLow.duration + this.thumpPause)) {
			if(thumpLow.currentTime + this.thumpPause < thumpLow.duration + this.thumpPause) {
				thumpLow.play();
			}
		} else if ((this.timer > thumpLow.duration + this.thumpPause) && (this.timer < thumpLow.duration + this.thumpPause + thumpHi.duration + this.thumpPause )){
			if(thumpHi.currentTime + this.thumpPause < thumpHi.duration + this.thumpPause) {
				thumpHi.play();
			}
		} else {
			thumpLow.pause();
			thumpLow.currentTime = 0;
			thumpHi.pause();
			thumpHi.currentTime = 0;
			this.timer = 0;

			if(this.thumpPause > 9) {
				this.thumpPause += this.thumpPause *-0.02;
			} else {

				this.thumpPause = this.musicBeat - this.lvl;
			}
		}
		

		for (var i = 0, len = this.asteroids.length; i < len; i++) {
			var a = this.asteroids[i];

			a.update();

			if (this.ship.collide(a)) {

				var hitSound1 = document.getElementById("explosion1");
				var hitSound2 = document.getElementById("explosion2");
				var hitSound3 = document.getElementById("explosion3");


				switch (a.size) {
						case AsteroidSize:
							hitSound1.pause();
							hitSound1.currentTime = 0;
							hitSound1.play();
							break;
						case AsteroidSize/2:
							hitSound2.pause();
							hitSound2.currentTime = 0;
							hitSound2.play();
							break;
						case AsteroidSize/4:
							hitSound3.pause();
							hitSound3.currentTime = 0;
							hitSound3.play();
							break;
					}

				var debCount = Math.random()*8 + 10;
				for (var l = 0; l < debCount; l++){
					var x = this.ship.x;
					var y = this.ship.y;

					var dAngle = Math.random()*360;
					
					var debr = new Debris(x, y, dAngle);
					debr.maxX = this.canvasWidth;
					debr.maxY = this.canvasHeight;

					this.debris.push(debr);
				}

				this.ship.x = this.canvasWidth/2;
				this.ship.y = this.canvasHeight/2;

				this.ship.vel = {
					x: 0,
					y: 0
				}
				this.lives--;
				if(this.lives <= 0) {
					this.gameOver = true;
				}
				this.ship.visible = false;

				if (a.size > AsteroidSize/4) {
					for (var m = 0; m < 2; m++) {
						Points.ASTEROIDS.push(Asteroid.prototype.create(this.Radius, this.Noise, this.pointCnt));
						var astr = new Asteroid(Points.ASTEROIDS[i], a.size/2, a.x, a.y);
						astr.maxX = this.canvasWidth;
						astr.maxY = this.canvasHeight;

						this.asteroids.push(astr);
						len++;
					}
				}
				this.asteroids.splice(i,1);
				len--;
				i--;

			}

			for(var j = 0, len2 = this.bullets.length; j < len2; j++){
				var b = this.bullets[j];
				if (a.hasPoint(b.x, b.y)) {
					this.bullets.splice(j, 1);
					len2--;
					j--;

					var hitSound1 = document.getElementById("explosion1");
					var hitSound2 = document.getElementById("explosion2");
					var hitSound3 = document.getElementById("explosion3");

					switch (a.size) {
						case AsteroidSize:
							hitSound1.pause();
							hitSound1.currentTime = 0;
							hitSound1.play();
							this.score += 20;
							this.lifeTicker += 20;
							break;
						case AsteroidSize/2:
							hitSound2.pause();
							hitSound2.currentTime = 0;
							hitSound2.play();
							this.score += 50;
							this.lifeTicker += 50;
							break;
						case AsteroidSize/4:
							hitSound3.pause();
							hitSound3.currentTime = 0;
							hitSound3.play();
							this.score += 100;
							this.lifeTicker += 100;
							break;
					}

					if (a.size > AsteroidSize/4) {
						for (var k = 0; k < 2; k++) {
							Points.ASTEROIDS.push(Asteroid.prototype.create(this.Radius, this.Noise, this.pointCnt));
							var astr = new Asteroid(Points.ASTEROIDS[i], a.size/2, a.x, a.y);
							astr.maxX = this.canvasWidth;
							astr.maxY = this.canvasHeight;

							this.asteroids.push(astr);
							len++;
						}
					}
					this.asteroids.splice(i,1);
					len--;
					i--;
				}
			}
		}
		for (var i = 0, len = this.bullets.length; i < len; i++){
			var b = this.bullets[i];
			b.update();

			if (b.shallRemove){
				this.bullets.splice(i, 1);
				len--;
				i--;
			}
		}

		for (var i = 0, len = this.debris.length; i < len; i++){
			var d = this.debris[i];
			d.update();

			if (d.shallRemove){
				this.debris.splice(i, 1);
				len--;
				i--;
			}
		}

		this.ship.update();

		if(this.asteroids.length === 0){
			this.lvl++;
			this.generateLvl();
		}

		if(this.lifeTicker >= this.lifeUp) {
			var lifeSound = document.getElementById("lives");
			lifeSound.pause();
			lifeSound.currentTime = 0;
			lifeSound.play();
			this.lives ++;
			this.lifeTicker = 0;
		}

	},

	render: function(ctx) {
		ctx.clearAll();

		ctx.vectorText(this.score, 2, 50, 25);

		for (var i = 0; i < this.lives; i++) {
			ctx.drawPolygon(this.lifepolygon, 60+15*i, 60);
		}

		for (var i = 0, len = this.asteroids.length; i < len; i++){
			this.asteroids[i].draw(ctx);
		}
		for (var i = 0, len = this.bullets.length; i < len; i++){
			this.bullets[i].draw(ctx);
		}

		for (var i = 0, len = this.debris.length; i < len; i++){
			this.debris[i].draw(ctx);
		}

		if(this.gameOver) {
			ctx.vectorText("GAME OVER", 4, null, null);
		}
		this.ship.draw(ctx);
	}

});

var MenuState = State.extend({
	init: function(game){
		this.game = game;

		this.canvasWidth = game.canvas.ctx.width;
		this.canvasHeight = game.canvas.ctx.height;

		this.Radius = Math.random()*5+18;
		this.Noise = Math.random()*8+8;
		this.pointCnt = Math.round(Math.random()*4+7);

		var num = Math.random()*5 + 5;
		this.asteroids = [];

		for (var i = 0; i < num; i++){
			var x= Math.random() * this.canvasWidth;
			var y = Math.random() * this.canvasHeight;

			var s = [.5, 1, 2][Math.round(Math.random() * 2)];

			Points.ASTEROIDS.push(Asteroid.prototype.create(this.Radius, this.Noise, this.pointCnt));
			var astr = new Asteroid(Points.ASTEROIDS[i], AsteroidSize/s, x, y);
			astr.maxX = this.canvasWidth;
			astr.maxY = this.canvasHeight;

			this.asteroids.push(astr);
		}
	},

	handleInputs: function(input){
		if (input.isPressed("spacebar")) {
			this.game.nextState = States.GAME;
			console.log("test");
		}
	},
	update: function(){
		for (var i=0, len = this.asteroids.length; i< len; i++) {
					this.asteroids[i].update();
				}
	},
	render: function(ctx){
		ctx.clearAll();

		for (var i=0, len = this.asteroids.length; i< len; i++) {
			this.asteroids[i].draw(ctx);
		}

		ctx.vectorText("ASTEROIDS", 6, null, 240);
		ctx.vectorText("PUSH SPACE TO PLAY", 2, null, 320);
	}
});
/**
 * EndState class, called when game is over
 */
var EndState = State.extend({

	/**
	 * Constructor
	 * 
	 * @param  {Game} game manager for the state
	 */
	init: function(game) {
		this._super(game); // call super constructor

		this.hasEnterName = false; // internal stage flag
		this.nick = "no name";
		this.score = game.stateVars.score;

		// arbitrary hiscore array
		// TODO: implement real hiscore saving with PHP or something
		this.hiscores = [
			["the doctor", 2000],
			["son goku", 9999],
			["noname", 3000],
			["narsil", 10000]
		];

		// get and init inputfiled from DOM
		this.namefield = document.getElementById("namefield");
		this.namefield.value = this.nick;
		this.namefield.focus();
		this.namefield.select();
	},

	/**
	 * @override State.handleInputs
	 *
	 * @param  {InputHandeler} input keeps track of all pressed keys
	 */
	handleInputs: function(input) {
		if (this.hasEnterName) {
			if (input.isPressed("spacebar")) {
				// change the game state
				this.game.nextState = States.MENU;
			}
		} else {
			if (input.isPressed("enter")) {
				// take sate to next stage
				this.hasEnterName = true;
				this.namefield.blur();

				// cleanup and append score to hiscore array
				this.nick = this.nick.replace(/[^a-zA-Z0-9\s]/g, "");
				this.hiscores.push([this.nick, this.score]);

				// sort hiscore in ascending order
				this.hiscores.sort(function(a, b) {
					return b[1] - a[1];
				});
			}
		}
	},

	/**
	 * @override State.update
	 */
	update: function() {
		if (!this.hasEnterName) {
			this.namefield.focus(); // focus so player input is read
			// exit if same namefield not updated
			if (this.nick === this.namefield.value) {
				return;
			}
			// clean namefield value and set to nick variable
			this.namefield.value = this.namefield.value.replace(/[^a-zA-Z0-9\s]/g, "");
			this.nick = this.namefield.value;
		}
	},

	/**
	 * @override State.render
	 * 
	 * @param  {context2d} ctx augmented drawing context
	 */
	render: function(ctx) {
		ctx.clearAll();

		if (this.hasEnterName) {
			// manually tweaked positions for, straightforward text
			// positioning
			ctx.vectorText("Hiscore", 3, null, 130);
			for (var i = 0, len = this.hiscores.length; i < len; i++) {
				var hs = this.hiscores[i];
				ctx.vectorText(hs[0], 2, 200, 200+25*i);
				ctx.vectorText(hs[1], 2, 320, 200+25*i, 10);
			}
			ctx.vectorText("press space to continue", 1, 200, 350);

		} else {

			ctx.vectorText("Thank you for playing", 4, null, 100);
			ctx.vectorText("nick", 2, null, 180);
			ctx.vectorText(this.nick, 3, null, 220);
			ctx.vectorText(this.score, 3, null, 300);
		}
	}
});
var InputHandeler = Class.extend({

	init: function(keys) {// {left: 37, up = 38}
		this.keys = {};
		this.down = {};
		this.pressed = {};

		for(key in keys) {
			var code = keys[key];

			this.keys[code] = key;
			this.down[key] = false;
			this.pressed[key] = false;
		}

		var self = this;

		document.addEventListener("keydown", function(evt) {
			if(self.keys[evt.keyCode]) {
				self.down[self.keys[evt.keyCode]] = true;
			}
		});
		document.addEventListener("keyup", function(evt) {
			if(self.keys[evt.keyCode]) {
				self.down[self.keys[evt.keyCode]] = false;
				self.pressed[self.keys[evt.keyCode]] = false;
			}
		});
	},

	isDown: function(key){
		return this.down[key];
	},

	isPressed: function(key){
		if(this.pressed[key]){
			return false;
		} else if (this.down[key]){
			return this.pressed[key] = true;
		}
		return false;
	}
});

var Polygon = Class.extend({

	init: function(p) {
		this.points = p.slice(0);
	},

	rotate: function(theta) {
		var c = Math.cos(theta);
		var s = Math.sin(theta);

		for(var i = 0, len=this.points.length; i<len; i+=2){
			var x = this.points[i];
			var y = this.points[i+1];

			this.points[i] = c*x - s*y;
			this.points[i+1] = s*x + c*y;
		}
	},

	scale: function(c) {
		for (var i = 0, len = this.points.length; i < len; i++) {
			this.points[i] *=c;
		}
	},

	hasPoint: function(ox, oy, x, y) {
		var c = false;
		var p = this.points;
		var len = p.length;

		for (var i = 0, j = len-2; i < len; i +=2) {
			var px1 = p[i] + ox;
			var px2 = p[j] + ox;

			var py1 = p[i+1] + oy;
			var py2 = p[j+1] + oy;

			if (( py1 > y != py2 > y ) &&
				( x < (px2-px1) * (y-py1) / (py2-py1) + px1 )
			) {
				c = !c;
			}
				j = i;
		}
		return c;

	}
});

var Asteroid = Polygon.extend({
	maxX: null,
	maxY: null,

	init: function(p, s, x, y){
		this._super(p);

		this.size = s;
		this.x = x;
		this.y = y;

		this.scale(s);

		this.rotAngle = 0.02*(Math.random()*3-1);
		
		var r = 2*Math.PI*Math.random();
		var v = Math.random()*2 + .5;
		this.vel = {
			x: v*Math.cos(r),
			y: v*Math.sin(r)
		};
	},

	hasPoint: function(x, y) {
		return this._super(this.x, this.y, x, y);
	},

	update: function(){
		this.x += this.vel.x;
		this.y += this.vel.y;

		if(this.x >= this.maxX){
			this.x = 0;
		} else if (this.x <= 0){
			this.x = this.maxX;
		}
		if(this.y >= this.maxY){
			this.y = 0;
		} else if (this.y <= 0){
			this.y = this.maxY;
		}

		this.rotate(this.rotAngle);
	},

	draw: function(ctx) {
		ctx.drawPolygon(this, this.x, this.y);
	},

	create: function(scale, roughness, pCount) {

		this.points = [];

		for(var i = 0, len=360/pCount; i<len*pCount; i+=len){
			var myDent = Math.random()*roughness;
			var radians = i * Math.PI/180;
			var x = Math.round(0 + (scale - myDent) * Math.cos(radians));
			var y = Math.round(0 + (scale - myDent) * Math.sin(radians));
			this.points.push(x);
			this.points.push(y);
		}
		this.points.push(this.points[0]);
		this.points.push(this.points[1]);

		return this.points;

	}
});

var Debris = Class.extend({

	maxX: null,
	maxY: null,

	init: function(x, y, angle){
		this.x = x;
		this.y = y;

		this.shallRemove = false;

		this.vel = {
			x: (Math.random()*3 + 1) * Math.cos(angle),
			y: (Math.random()*3 + 1) *Math.sin(angle)
		}
	},

	update: function() {
		this.prevX = this.x;
		this.prevY = this.y;

		if(0 > this.x || this.x > this.maxX ||
			0 > this.y || this.y > this.maxY
		){
			this.shallRemove = true;
		}

		this.x += this.vel.x;
		this.y += this.vel.y;
	},

	draw: function (ctx) {
		ctx.beginPath();
		ctx.moveTo(this.prevX, this.prevY);
		ctx.lineTo(this.x, this.y);
		ctx.stroke();
	}
});

var Ship = Polygon.extend({
	maxX: null,
	maxY: null,

	init: function(p, pf, s, x, y){
		this._super(p);

		this.exhaust = new Polygon(pf);
		this.exhaust.scale(s);

		this.drawExhaust = false;
		this.visible = true;

		this.x = x;
		this.y = y;

		this.scale(s);

		this.angle = 0;

		this.vel = {
			x: 0,
			y: 0
		};
	},

	collide: function(astr) {
		
		if(!this.visible) {

			return false;
		}
		for(var i=0, len = this.points.length -2; i < len; i+= 2) {
			var x = this.points[i] + this.x;
			var y = this.points[i+1] + this.y;

			if(astr.hasPoint(x,y)) {
				return true;
			}
		}
		return false;
	},

	shoot: function() {
		var b = new Bullet(this.points[4] + this.x, this.points[5] + this.y, this.angle);
		b.maxX = this.maxX;
		b.maxY = this.maxY;
		return b;
	},

	addVel: function() {//a*a + b*b = c*c
		if(this.vel.x*this.vel.x + this.vel.y*this.vel.y < 20*20){
			this.vel.x += 0.05*Math.cos(this.angle);
			this.vel.y += 0.05*Math.sin(this.angle);
			this.drawExhaust = true;
		}
		var thrustSound = document.getElementById("thrust");

		if(thrustSound.paused){
			thrustSound.play();
		}
	},

	rotate: function(theta) {
		this._super(theta);

		this.exhaust.rotate(theta);

		this.angle += theta;
	},

	update: function(){
		this.x += this.vel.x;
		this.y += this.vel.y;

		this.vel.x *= 0.995;
		this.vel.y *= 0.995;

		if(this.x >= this.maxX){
			this.x = 0;
		} else if (this.x <= 0){
			this.x = this.maxX;
		}
		if(this.y >= this.maxY){
			this.y = 0;
		} else if (this.y <= 0){
			this.y = this.maxY;
		}

		if(!this.drawExhaust) {
			var thrustSound = document.getElementById("thrust");

			thrustSound.pause();
			thrustSound.currentTime = 0.01;
		}

	},

	draw: function(ctx) {

		if(!this.visible) {
			var thrustSound = document.getElementById("thrust");

			thrustSound.pause();
			thrustSound.currentTime = 0;

			return;
		}

		ctx.drawPolygon(this, this.x, this.y);
		if(this.drawExhaust){
			ctx.drawPolygon(this.exhaust, this.x, this.y);
			this.drawExhaust = false;
		}
		
	},

});

var Bullet = Class.extend({

	maxX: null,
	maxY: null,

	init: function(x, y, angle){
		this.x = x;
		this.y = y;

		this.shallRemove = false;

		this.vel = {
			x: 7*Math.cos(angle),
			y: 7*Math.sin(angle)
		}
	},

	update: function() {
		this.prevX = this.x;
		this.prevY = this.y;

		if(0 > this.x || this.x > this.maxX ||
			0 > this.y || this.y > this.maxY
		){
			this.shallRemove = true;
		}

		this.x += this.vel.x;
		this.y += this.vel.y;
	},

	draw: function (ctx) {
		ctx.beginPath();
		ctx.moveTo(this.prevX, this.prevY);
		ctx.lineTo(this.x, this.y);
		ctx.stroke();
	}
});

var Canvas = Class.extend({

	init: function(width, height){
		this.canvas = document.createElement("canvas");
		this.canvas.width = width;
		this.canvas.height = height;

		this.ctx = (function(ctx) {

			ctx.width = ctx.canvas.width;
			ctx.height = ctx.canvas.height;

			ctx.ACODE = "A".charCodeAt(0);
			ctx.ZCODE = "0".charCodeAt(0);
			ctx.SCODE = " ".charCodeAt(0);

			ctx.drawPolygon = function(p, x, y) {
				p = p.points;

				this.beginPath();
				this.moveTo(p[0] + x, p[1] + y);
				for (var i=2, len = p.length; i< len; i+=2){
					this.lineTo(p[i] + x, p[i + 1] + y);
				}
				this.stroke();
			};

			ctx.vectorText = function(text, s, x, y, offset) {
				text = text.toString().toUpperCase();
				var step = s*6;

				if (typeof offset === "number") {
					x += step*(offset - text.length);
				}

				if (typeof x !== "number") {
					x = Math.round((this.width - text.length*step)/2);
				}
				if (typeof y !== "number") {
					y = Math.round((this.height - step)/2);
				}

				x += 0.5;
				y += 0.5;

				for (var i=0, len = text.length; i < len; i++) {
					var ch = text.charCodeAt(i);
					if(ch === this.SCODE) {
						x += step;
						continue;
					}

					var p;
					if (ch - this.ACODE >= 0) {
						p = Points.LETTERS[ch - this.ACODE];
					} else {
						p = Points.NUMBERS[ch - this.ZCODE];
					}

					this.beginPath();
					this.moveTo(p[0]*s + x, p[1]*s + y);
					for (var j = 2, len2 = p.length; j < len2; j += 2) {
						this.lineTo(p[j]*s + x, p[j+1]*s + y);
					}
					this.stroke();
					x+= step;
				}
			};

			ctx.clearAll = function(){
				this.clearRect(0,0, this.width, this.height);
			}
			return ctx;
		})(this.canvas.getContext("2d"));
		this.canvas.id = "asteroids";
		
		// disable the commented code below to render to screen otherwise it renders off screen for accelerated rendering.
		//document.body.appendChild(this.canvas);
		document.body.insertBefore(this.canvas, document.body.firstChild);
		//this.canvas.style.visibility = 'hidden';
	},

	animate: function(loop){
		var rf = (function(){
			
				return window.requestAnimationFrame 	||
				window.webkitRequestAnimationFrame 	||
				window.mozRequestAnimationFrame 	||
				window.oRequestAnimationFrame 		||
				window.msRequestAnimationFrame		||
				function(cb, el){
					window.setTimeout(cb, 1000/60);
				}
			
		})();

		var l = function(){
			loop();
			//throttle the playback of the canvas so that it doesn't fly in vr
			setTimeout(function(){ 
				rf(l, self.canvas);
			}, 1000/60);
		}
		rf(l, this.canvas);
	}

});

var States = {
	NO_CHANGE: 0,
	MENU: 1,
	GAME: 2,
	END: 3
}

var w = window,
	d = document,
	e = d.documentElement,
	g = d.getElementsByTagName('body')[0],
	//xS = w.innerWidth || e.clientWidth || g.clientWidth,
	//yS = w.innerHeight|| e.clientHeight|| g.clientHeight;
	xS = 512;
	yS = 512;

var Game = Class.extend({
	init: function(){
		this.canvas = new Canvas(xS, yS);

		this.soundEffect1 = new SoundEffect(Audios.EXPLODE1, "explosion1", false, 0);
		this.soundEffect2 = new SoundEffect(Audios.EXPLODE2, "explosion2", false, 0);
		this.soundEffect3 = new SoundEffect(Audios.EXPLODE1, "explosion3", false, 0);
		this.soundEffect4 = new SoundEffect(Audios.FIRE, "fire", false, 0);
		this.soundEffect5 = new SoundEffect(Audios.LIVES, "lives", false, 0);
		this.soundEffect6 = new SoundEffect(Audios.THRUST, "thrust", true, 0.001);
		this.soundEffect7 = new SoundEffect(Audios.THUMPHI, "thumpHi", false, 0);
		this.soundEffect7 = new SoundEffect(Audios.THUMPLOW, "thumpLow", false, 0);

		this.input = new InputHandeler({
			left: 		65, //a
			up: 		87, //w
			right: 		68, //d
			down: 		83, //s
			spacebar: 	38, //uparrow
			enter:   	13  //enter
		});

		this.canvas.ctx.strokeStyle = "#fff";
		this.currentState = null;
		this.stateVars = {
			score: 0
		}

		this.nextState = States.MENU;
	},

	run: function(){
		var self = this;

		this.canvas.animate(function(){
			if(self.nextState !== States.N0_CHANGE) {
				switch(self.nextState){
					case States.MENU:
						self.currentState = new MenuState(self);
						break;
					case States.GAME:
						self.currentState = new GameState(self);
						break;
					case States.END:
						self.currentState = new EndState(self);
						break;

				}
				self.nextState = States.N0_CHANGE;
			}
			self.currentState.handleInputs(self.input);
			self.currentState.update();
			self.currentState.render(self.canvas.ctx);
		});
	}	

});
