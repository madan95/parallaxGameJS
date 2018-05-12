document.addEventListener("DOMContentLoaded", function(event){
    game();
    var canvas = document.getElementById('gameScreen');

    fullscreenify(canvas);


    function fullscreenify(canvas) {
        //  var style = canvas.getAttribute('style') || '';

        window.addEventListener('resize', function () {resize(canvas);}, false);

        resize(canvas);

    }


    function resize(canvas) {
        var scale = {x: 1, y: 1};
        var style = "border:1px solid #c3c3c3;background-color:#000;";
        scale.x = (window.innerWidth - 10) / canvas.width;
        scale.y = (window.innerHeight - 10) / canvas.height;

        if (scale.x < 1 || scale.y < 1) {
            scale = '1, 1';
        } else if (scale.x < scale.y) {
            scale = scale.x + ', ' + scale.x;
        } else {
            scale = scale.y + ', ' + scale.y;
        }

        canvas.setAttribute('style', style + ' ' + '-ms-transform-origin: center top; -webkit-transform-origin: center top; -moz-transform-origin: center top; -o-transform-origin: center top; transform-origin: center top; -ms-transform: scale(' + scale + '); -webkit-transform: scale3d(' + scale + ', 1); -moz-transform: scale(' + scale + '); -o-transform: scale(' + scale + '); transform: scale(' + scale + ');');
    }
});

function game() {

    /*****************Global Variables *********************************/
    var canvas = document.getElementById('gameScreen');
    var ctx = canvas.getContext('2d');
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;



    var layers = [];
    var layer1, layer2, layer3, layer4, layer5, layer6, layer7;



    var player;
    var playerSpeedX = 6;
    var playerSpeedY = 2;
    var playerSpeedGravity = 2;
    var playerHeight = 40;
    var playerWidth = 20;
    var playerStartY = canvasHeight - (111.4 + playerHeight/2);
    var jumpHeight = 40;
    var playerJumpHeight = playerStartY - jumpHeight;


    var missiles = [];
    var missilesStraightPositionY  = playerStartY + (playerHeight/2);
    var missileHeight = 20;
    var missileWidth = 20;


    var jumping = false;
    var canJump = true;


    var rightPressed = false;
    var leftPressed = false;

    var level = 0;
    var lives = 10;





    var gameRunning = true;
    var gameStatus;
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;


    //Extra message object
    var levelMessage;
    var livesMessage;
    var message;
    var Message = function (x, y, color, font){
        this.x = x;
        this.y = y;
        this.message = message;
        this.color = color;
        this.font = font;
        this.draw = function (message) {
            ctx.font = this.font;
            ctx.fillStyle = this.color;
            ctx.fillText(message, this.x, this.y);
        }
    }

    //Score in the screen
    var score;
    var Score = function (x, y, color, font) {
        this.score = 0;
        this.x = x;
        this.y = y;
        this.color = color;
        this.font = font;
        this.update = function () {
            this.score += 1;
            if(this.score%5 === 0){
                level += 1;
                newLevel();
            }
        };
        this.draw = function () {
            ctx.font = this.font;
            ctx.fillStyle = this.color;
            ctx.fillText("Score: " + this.score, this.x, this.y);
        };
    };



    //Background Image Object
    var gameBackground = function(x, y, imgSrc, speedX) {
        this.image = new Image();
        this.image.src = imgSrc;
        this.speedX = speedX*1.2;
        this.speedY = 0;
        this.x = x;
        this.y = y;
        this.update = function () {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x <= -(canvasWidth)) {
                this.x = 0;
            }
        };
        this.draw = function () {
            ctx.drawImage(this.image, this.x, this.y, canvasWidth, canvasHeight);
            ctx.drawImage(this.image, this.x + canvasWidth, this.y, canvasWidth, canvasHeight);
        }
    };

    //Main player/hero Object
    var hero = function(x, y, height, width, heroSpeedX, heroSpeedY){
        this.speedX = heroSpeedX;
        this.speedY = heroSpeedY;
        this.height = height;
        this.width = width;
        this.x = x;
        this.y = y;
        this.invunerable = false;
        this.update = function(){
            if(rightPressed && this.x < canvasWidth - this.width){
                this.x += this.speedX;
            }else if(leftPressed && this.x > 0 ){
                this.x -= this.speedX;
            }
            if(jumping){
                if(this.y > playerJumpHeight ) {
                    this.y -= this.speedY;
                }else{
                    jumping = false;
                }
            }else{
                if(this.y < playerStartY){
                    this.y += playerSpeedGravity;
                }else{
                    canJump = true;
                }
            }
        };
        this.draw = function () {
                ctx.fillStyle = "blue";
                ctx.fillRect(this.x, this.y, this.width, this.height);
        };
    };


    var missile = function(x, y, height, width, missileSpeedX, missileSpeedY, type){
        this.speedX = missileSpeedX;
        this.speedY = missileSpeedY;
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.type = type;
        this.update = function() {
            this.x += this.speedX;
            this.y += this.speedY;

            if(this.type === 'hori'){
                if(this.x < -100){
                    score.update();
                    this.x = canvasWidth + 100;
                    this.speedX = -(getRandom(11, 5));
                }
            }

            if(this.type === 'horiLeft'){
                if(this.x < -100){
                    score.update();
                    this.x = -100;
                    this.speedX = (getRandom(11, 5));
                }
            }

            if(this.type === 'verti') {
                if (this.y > ((canvasHeight + this.height) + 100 )) {
                    this.y = -100;
                    this.x = getRandom(canvasWidth, 0);
                    this.speedY = getRandom(8, 5);
                    this.speedXrandom = getRandom(5 , 1);
                    if(this.x > canvasWidth/2){
                        this.speedXrandom = -this.speedXrandom;
                    }
                    this.speedX = this.speedXrandom;
                }
            }

            if(this.type === 'vertiOpp') {
                if (this.y < -100 ) {
                    this.y = canvasHeight + 100;
                    this.x = getRandom(canvasWidth, 0);
                    this.speedY = -getRandom(8, 5);
                    this.speedXrandom = getRandom(5 , 1);
                    if(this.x > canvasWidth/2){
                        this.speedXrandom = -this.speedXrandom;
                    }
                    this.speedX = this.speedXrandom;
                }
            }


        };
        this.draw = function () {
                ctx.fillStyle = "red";
                ctx.fillRect(this.x, this.y, this.width, this.height);
        };
    };





    /*****************************************Game Funcitons *****************************/


    //Upon level up  make game harder
    function newLevel(){
        if(level === 1){
            missiles.push(new missile(getRandom(canvasWidth, 0), -100, missileHeight, missileWidth, getNegativeOrPositive(getRandom(5 , 1)), getRandom(8, 5),  'verti'));
        }else if(level === 2){
            missiles.push(new missile(getRandom(canvasWidth, 0), canvasHeight+100, missileHeight, missileWidth, getNegativeOrPositive(getRandom(5 , 1)), -getRandom(8, 5),  'vertiOpp'));
        }else if(level === 3){
            missiles.push(new missile(0, missilesStraightPositionY, missileHeight, missileWidth, 5, 0, 'horiLeft'));
        }
    }




    /***********************Initialisation of Game*****************/


    startGame();

    function startGame() {
        createGameWorld();
    }

    function createGameWorld() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        drawBackground(); //create new background obj with image for parallax effect
        drawHero(); //create new hero object
        drawMissile();
        drawScore();
        startListening(); //start listening to player movements
        gameRunning = true;
        updateGameWorld();
       // setInterval(updateGameWorld, 0);
        //gameStatus = requestAnimationFrame(updateGameWorld);
    }










    /***************Game Objects************************/

    function drawScore(){
        score = new Score(8, 20, '#0095DD', "16px Arial" );
        livesMessage = new Message(canvasWidth - 120 , 20, 'green',"16px Arial");
        levelMessage = new Message(canvasWidth/2 - 60, 20, 'orange',"16px Arial");

        livesMessage.draw("Lives left  : " + lives);
        levelMessage.draw("Level : " + level);
    }

    function drawHero(){
        player = new hero(0, playerStartY, playerHeight, playerWidth, playerSpeedX, playerSpeedY);
    }

    function drawBackground() {
        layer1 = new gameBackground(0, 0, './image/moonlight/layer_01.png', -2);
        layer2 = new gameBackground(0, 0, './image/moonlight/layer_02.png', -1.3);
        layer3 = new gameBackground(0, 0, './image/moonlight/layer_03.png', -0.8);
        layer4 = new gameBackground(0, 0, './image/moonlight/layer_04.png', -0.4);
        layer5 = new gameBackground(0, 0, './image/moonlight/layer_05.png', -0.3);
        layer6 = new gameBackground(0, 0, './image/moonlight/layer_06.png', 0);
        layer7 = new gameBackground(0, 0, './image/moonlight/layer_07.png', 0);

        layers = [layer7, layer6, layer5, layer4, layer3, layer2, layer1];
    }

    function drawMissile(){
        missile1 = new missile(canvasWidth, missilesStraightPositionY, missileHeight, missileWidth, -5, 0, 'hori');
        missile2 = new missile(getRandom(canvasWidth, 0), -100, missileHeight, missileWidth, -3, 3, 'verti');
        missiles = [missile1, missile2];
    }

    //random function for missile speed, direction, type
    function getRandom(max, min){
        return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
    }



    function getNegativeOrPositive(rand){
       if(getRandom(1, 0) === 0){
            return -rand;
        }else{
            return rand;
        }
    }











    /*******************************Game Event Listeners***********************/


    function startListening(){
        document.addEventListener('keyup', keyReleased, false);
        document.addEventListener('keydown', keyPressed, false)
    }

    function keyReleased(e){
        if(e.keyCode == 39) {
            rightPressed = false;
        }
        else if(e.keyCode == 37) {
            leftPressed = false;
        }else if(e.keyCode == 32){
            if(!gameRunning){
                if(lives === 0) {
                    startGame();
                }else{
                    gameRunning = true;
                    setTimeout(function () {
                        //make player invunerbale for 3 second so his life won't be wasted cuz its is inside misisile
                        player.invunerable = false;
                    }, 3000);
                    updateGameWorld();
                }
            }
        }
    }

    function keyPressed(e){
        if(e.keyCode == 39) {
            rightPressed = true;
        }
        else if(e.keyCode == 37) {
            leftPressed = true;
        }
        else if(e.keyCode == 38){
            if(canJump) {
                jumping = true;
                canJump = false;
            }
        }
    }



    function detectCollision(){
        missiles.forEach(function (missile) {
            checkIfCollide(player, missile);
        });
    }



    // checks if a (player) collides with b (missiles)
    function checkIfCollide(a, b) {
        if (a.x + a.width > b.x && a.x < b.x + b.width && a.y < b.y + b.height && a.y + a.height > b.y) {
            gameRunning = false;
            if(lives === 1) {
                lives -=1;
                livesMessage.draw("Lives left : "+ lives);

                message = new Message(120, 20, '#97a2af',"20px Arial");
                message.draw("Better Luck Next Time, Press Space-bar to restart !");
            }else{
                lives -=1;
                livesMessage.draw("Lives left : "+ lives);
                var message2 = new Message(canvasWidth/2 - 200 , canvasHeight/2, 'white',"20px Arial");
                message2.draw("Lives left : "+lives + " , Press Space bar to continue.");
                player.invunerable = true;
            }
        }
    }










    /***********************Game Updates Loop******************************/

    //constantly update the game by updating game objects like background, hero, missiles
    //updates objects current position then render them
    function updateGamePosition() {
        layers.forEach(function (layer) {
            layer.update();
        });
        missiles.forEach(function (missile) {
            missile.update();
        });
        player.update();
    }

    // renders object with new position
    function renderGameObjects(){
        layers.forEach(function (layer) {
            layer.draw();
        });
        missiles.forEach(function (missile) {
            missile.draw();
        });
        player.draw();
        score.draw();
        livesMessage.draw("Lives left : "+ lives);
        levelMessage.draw("Level : " + level);

    }

    //clear screen for new update and starts recursive funciton to update game world
    function updateGameWorld() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        updateGamePosition(); //udpate position
        renderGameObjects(); //render new positioin
        if(!player.invunerable) {
            detectCollision();  //check if collision occored
        }
        if(gameRunning){
            requestAnimationFrame(updateGameWorld);
        }
    }

}