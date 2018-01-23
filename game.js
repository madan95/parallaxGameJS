// Game Javascript 
	var gameLayer1;
		var gameLayer2;
		var gameLayer3;
		var gameLayer5;
		var gameHero;
		var missile;
		var missile2;

		var gameWorld_height;
		var gameWorld_width;

		var rightPressed;
		var leftPressed;
		var jumping;
		var canJump;
		var gameStoped;
		var gameRestart;

		function startGame() {

             gameWorld_height = 300;
             gameWorld_width = 600;
             rightPressed = false;
             leftPressed = false;
			 jumping = false;
             canJump = true;
             gameStoped = false;
			gameRestart = false;

			gameLayer1 = new gameObject(600, 300, './image/layer1.jpg', 0, 0, 'background');
            gameLayer2 = new gameObject(600, 240, './image/layer2.png', 0, 300 -240, 'background');
            gameLayer3 = new gameObject(600, 36, './image/layer3.jpg', 0, 300 - 36, 'background');
            gameLayer5 = new gameObject(600, 60, './image/layer5.png', 0, 300 - 60, 'background');

            gameHero = new gameObject(20, 40, 'orange', 0, 300-(40+36), 'hero');
			missile = new gameObject(10, 10, 'red', 750, 300 - (20+36), 'missile');
            missile2 = new gameObject(10, 10, 'red', Math.random() * ((300-10) - 0) + 0 , -100 , 'missile2');
            gameWorld.start();
        }

		var gameWorld = {
		  canvas : document.createElement('canvas'),
		  start : function() {
			  this.canvas.width = 600;
			  this.canvas.height = 300;
			  this.context = this.canvas.getContext('2d');
			  document.body.insertBefore(this.canvas, document.body.childNodes[0]);
			  document.addEventListener('keydown', this.keyDownHandler, false);
			  document.addEventListener('keyup', this.keyUpHandler, false);
			  this.interval = setInterval(updateGameWorld, 20);
		  },
		   clear: function() {
			   this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
           },
			stop : function () {
			 clearInterval(this.interval);
            },
			keyDownHandler: function (e) {
                    if (e.keyCode == 39) {
                        rightPressed = true;
                    } else if (e.keyCode == 37) {
                        leftPressed = true;
                    } else if (e.keyCode == 38) {
                        if (canJump) {
                            jumping = true;
                        }
                    }
            },
			keyUpHandler: function (e) {
                    if (e.keyCode == 39) {
                        rightPressed = false;
                    } else if (e.keyCode == 37) {
                        leftPressed = false;
                    } else if (e.keyCode == 32) {
                     /*   if (gameStoped) {
                            gameStoped = false;
                            setTimeout(gameWorld.start(), 3000);
                        } else if(!gameStoped) {
                            gameStoped = true;
                            setTimeout(gameWorld.stop(), 3000);
                        }else*/
                     if (gameRestart) {
                            setTimeout(startGame(), 3000);
                         gameRestart = false;

                     }
                    }
                }
		};

		function gameObject(width, height, color, x, y, type) {
			this.type = type;
			if(type == 'image' || type == 'background'){
			    this.image = new Image();
			    this.image.src = color;
			}
			this.width = width;
			this.height = height;
			this.speedX = 0;
			this.speedY = 0;
			this.x = x;
			this.y = y;
			this.update = function(){
			    ctx = gameWorld.context;
			    if(type == 'image' || type == 'background') {
                    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
                    if (type == 'background') {
                        ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
                    }
                }else{
					ctx.fillStyle = color
			        ctx.fillRect(this.x, this.y, this.width, this.height);
				}
			}
			this.newPosition = function () {
				this.x += this.speedX;
				this.y += this.speedY;
				if(this.type == 'background'){
				    if(this.x == -(this.width)){
				        this.x = 0;
					}
				}else if(this.type == 'hero'){
                    if(rightPressed && this.x < gameWorld_width-this.width){
                        this.x += 4;
                    }
                    else if(leftPressed && this.x > 0){
                        this.x -=4;
                    }
                    if(jumping){
						jumping = false;
						canJump = false;
                        this.speedY -=2;
					}
					if(this.y < gameWorld_height - (36+40+40)){
                        this.speedY +=2;
					}
					if(this.y > gameWorld_height - (40+36)){
                        this.speedY = 0;
                        this.y = 300-(40+36);
                        canJump = true;
					}
				}else if(this.type == 'missile'){
				    if(this.x < -100){
						this.x = 600;
					}
				}else if(this.type == 'missile2'){
				    if(this.y > 300 + 100){
				        this.y = 0;
				        this.x = Math.random() * ((300-10) - 0) + 0;
					}
				}
            }
        }

        function checkIfCollide(a, b) {
            if( a.x+a.width > b.x && a.x < b.x+b.width && a.y < b.y+b.height && a.y+a.height > b.y  ){
                 gameWorld.stop();
				 gameRestart = true;

            }else {
            }
        }

        function updateGameWorld() {
			gameWorld.clear;
            gameLayer1.speedX = -1;
			gameLayer2.speedX = -2;
			gameLayer3.speedX = -5;
            gameLayer5.speedX = -8;
            missile.speedX = -4;
            missile2.speedY = +4;
			gameLayer1.newPosition();
			gameLayer1.update();
            gameLayer2.newPosition();
            gameLayer2.update();
            gameLayer3.newPosition();
            gameLayer3.update();
            gameHero.newPosition();
            gameHero.update();
            missile.newPosition();
            missile.update();
            missile2.newPosition();
            missile2.update();
            gameLayer5.newPosition();
            gameLayer5.update();
            checkIfCollide(gameHero, missile);
            checkIfCollide(gameHero, missile2);

        }

