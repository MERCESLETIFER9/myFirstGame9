//variables for gamestates and levels
var gameState = play;
var play = 1;
var won = 4;
var lose = 0;

//variables for players' score,life and remaining bombs
var score = 0;
var lifeCount = 3;
var bombCount = 3;

//variables for sprites and their images
var bg,bgImg;
var player,bomb,missile,shield,playerImg,bombImg,missileImg,shieldImg;
var heart1,heart2,heart3,heart1Img,heart2Img,heart3Img;
var crack,crackImg;
var villain,magicBall,villainImg,magicBallImg;
var blood,bloodImg;
var gameOver,restart,gameOverImg,restartImg;


function preload(){

    bgImg = loadImage("assets/background.jpg");
    playerImg = loadImage("assets/player.png");
    bombImg = loadImage("assets/bomb.png");
    missileImg = loadImage("assets/missile.png");
    shieldImg = loadImage("assets/shield.png");
    heart1Img = loadImage("assets/heart_1.png");
    heart2Img = loadImage("assets/heart_2.png");
    heart3Img = loadImage("assets/heart_3.png");
    crackImg = loadImage("assets/villainportal.png");
    villainImg = loadImage("assets/villain.png");
    magicBallImg = loadImage("assets/magicBall.png");
    bloodImg = loadImage("assets/blood.png");
    gameOverImg = loadImage("assets/gameOver.png");
    restartImg = loadImage("assets/restart.png");
    
}


function setup(){

      createCanvas(windowWidth,windowHeight);

      //creating background
      bg = createSprite(displayWidth/2-30,displayHeight/2-80,20,20);
        bg.addImage(bgImg);
        bg.scale = 0.24;

      player = createSprite(200,550,40,40);
        player.addImage(playerImg);
        player.scale = 0.5;
        player.setCollider("circle",-30,10,200);
        player.debug = false;

      shield = createSprite(player.x,player.y,40,40);
        shield.addImage(shieldImg);
        shield.scale = 0.7;
        shield.visible = false;

      heart1 = createSprite(displayWidth-150,40,20,20);
        heart1.visible = false;
        heart1.addImage("heart1",heart1Img);
        heart1.scale = 0.4;

      heart2 = createSprite(displayWidth-100,40,20,20);
        heart2.visible = false;
        heart2.addImage("heart2",heart2Img);
        heart2.scale = 0.4;

      heart3 = createSprite(displayWidth-150,40,20,20);
        heart3.addImage("heart3",heart3Img);
        heart3.scale = 0.4;
        heart3.visible = true;

      crack = createSprite(1130,550,40,40);
        crack.addImage(crackImg);
        crack.scale = 0.25;

      villain = createSprite(1140,550,40,40);
        villain.addImage(villainImg);
        villain.scale = 0.2;
        crack.x = villain.x-10;
        crack.y = villain.y;

      blood = createSprite(500,500,40,40);
        blood.addImage(bloodImg);
        blood.scale = 0.1;
        blood.visible = false;

      gameOver = createSprite(windowWidth/2,windowHeight/2,40,40);
        gameOver.addImage(gameOverImg);
        gameOver.scale = 1.5;
        gameOver.visible = false;

      restart = createSprite(windowWidth/2,windowHeight/2+125,40,40);
        restart.addImage(restartImg);
        restart.scale = 0.2;
        restart.visible = false;

      //creating groupes for Obstacle and weapons
      obstacleGroup = new Group();
      weaponGroup = new Group();

}


function draw(){

      background(0);

      if(gameState === "play"){


            //displaying the appropriate image according to the lives reamining
            if(lifeCount===3){
              heart3.visible = true;
              heart1.visible = false;
              heart2.visible = false;
            }

            if(lifeCount===2){
              heart2.visible = true;
              heart1.visible = false;
              heart3.visible = false;
            }

            if(lifeCount===1){
              heart1.visible = true;
              heart3.visible = false;
              heart2.visible = false;
            }

            //go to gameState "lose" when 0 lives are remaining
            if(lifeCount===0){
              gameState = "lose";
              
            }



            //go to gameState "won" if score is 100
            if(score==100){
              gameState = "won";

            }



            //moving the player up and down and making the game mobile compatible using touches
            if(keyDown("UP_ARROW")||touches.length>0){
              player.y = player.y-30;

            }

            if(keyDown("DOWN_ARROW")||touches.length>0){
              player.y = player.y+30;

            }



            //release bombs
            if(keyWentDown("space")){

                bomb = createSprite(displayWidth-1150,player.y-30,20,10);
                bomb.addImage(bombImg);
                bomb.scale = 0.07;
                bomb.velocityX = 20;
                weaponGroup.add(bomb);
                player.depth = bomb.depth;
                player.depth = player.depth+2;
                bombCount = bombCount-1;

            }

            //go to gameState "bomb" when player runs out of bombs
            if(bomb==0)
                gameState = "bomb";


            //destroy the obstacle when bomb touches it and increase score
            if(obstacleGroup.isTouching(weaponGroup)){

                for(var i=0;i<obstacleGroup.length;i++){     
                    if(obstacleGroup[i].isTouching(weaponGroup)){
                          obstacleGroup[i].destroy();
                          weaponGroup.destroyEach();
                  
                          score = score+2;
                    } 

                }

            }

            //reduce life and destroy obstacle when player touches it
            if(obstacleGroup.isTouching(player)){

                for(var i=0;i<obstacleGroup.length;i++){     
                      
                  if(obstacleGroup[i].isTouching(player)){
                      obstacleGroup[i].destroy();
                      
                      life=life-1;
                      } 
                
                }
            }

            //calling the function to spawn Obstacle
            spawnObstacle();

      }

      drawSprites();


      textSize(25);
        fill("lightblue");
        text("Score = " + score,130,40);
        fill("yellow");
        text("Life Count = " + lifeCount,110,80);
        fill("red")
        text("Remaining Bombs \""+bombCount+"\"",75,115);

      //destroy obstacle and player and display a message in gameState "lose"
      if(gameState == "lose"){
        
        textSize(100);
        fill("red");
        text("You lose ",400,400);
        obstacleGroup.destroyEach();
        player.destroy();

      }

      //destroy obstacle and player and display a message in gameState "won"
      else if(gameState == "won"){
      
        textSize(100);
        fill("yellow");
        text("You Won ",400,400);
        obstacleGroup.destroyEach();
        player.destroy();

      }

      //destroy obstacle, player and bombs and display a message in gameState "bomb"
      else if(gameState == "bomb"){
      
        textSize(50);
        fill("yellow");
        text("You ran out of bombs!!!",470,410);
        obstacleGroup.destroyEach();
        player.destroy();
        weaponGroup.destroyEach();

      }

}


function spawnObstacle() {

    if(World.frameCount % 100 === 0){

          var obstacle = createSprite(1250,height-190,20,30);
          obstacle.addImage(magicBallImg);
          obstacle.scale = 0.1;
          obstacle.lifetime = 300;
          obstacle.depth = player.depth;
          player.depth +=1;
          obstacleGroup.add(obstacle);
          obstacle.setCollider('circle',0,0,45);
          obstacle.velocityX = -45;
          obstacle.y = Math.round(random(height-120,height-500));

    }

}