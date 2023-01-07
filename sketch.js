var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var Invisibleground
var cloud
var obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6
var PLAY = 1
var END = 0
var gamestate = PLAY
var obstaclesGroup
var cloudsGroup
var score
var jumpsound, chekpointsound, diesound
var name = "hello"




function preload()
{
    backgroundimg = loadImage("backgroundImg.png");
    sun_animation = loadImage("sun.png");
    trex_running = loadAnimation("trex_1.png","trex_2.png", "trex_3.png");
    trex_collided = loadImage("trex_collided.png");
    groundImage = loadImage("ground.png");
    cloudimg = loadImage("cloud.png");
    obstacle1 = loadImage("obstacle1.png")
    obstacle2 = loadImage("obstacle2.png")
    obstacle3 = loadImage("obstacle3.png")
    obstacle4 = loadImage("obstacle4.png")
    gameoverimg = loadImage("gameOver.png")
    restartimg = loadImage("restart.png")
    jumpsound = loadSound("jump.mp3")
    diesound = loadSound("die.mp3")
    chekpointsound = loadSound("checkPoint.mp3")

}

function setup()
{
    createCanvas(windowWidth, windowHeight);
    //console.log("hello"+ Math.round(random(1,10)));
    sun = createSprite(width - 50, 100, 10, 10);
    sun.addAnimation("sun", sun_animation);
    sun.scale = 0.1;
    

    //create a trex sprite
    trex = createSprite(50,height - 70,20,50);
    trex.addAnimation("running", trex_running);
    trex.addAnimation("collided", trex_collided)
    trex.scale = 0.1;
    trex.debug = false
    trex.setCollider("circle", 0, 0, 350);

    //create a ground sprite
    ground = createSprite(width / 2, height, width, 2);
    ground.addImage("ground",groundImage);
    ground.x = width /2;
    ground.velocityX = -(6 + 3 * score/100);

    Invisibleground = createSprite(width / 2, height - 10, width, 125);
    Invisibleground.visible = false

    //create obstacle and cloud groups.
    obstaclesGroup = createGroup();
    cloudsGroup = createGroup();

    score = 0

    gameover = createSprite(width / 2, height / 2 - 50);
    gameover.addImage(gameoverimg);
    restart = createSprite(width / 2, height / 2);
    restart.addImage(restartimg);
    gameover.scale = 0.5;
    restart.scale = 0.5;
    gameover.visible = false;
    restart.visible = false;

}

function spawnClouds()
{
    if(frameCount%60 == 0){
    
        cloud = createSprite(widht + 20, height - 300, 40, 10);
    
        cloud.velocityX = -3; 
    
        cloud.addImage(cloudimg);
    
        cloud.scale = 0.1;
    
        cloud.y = Math.round(random(10,80));
    
        cloud.depth = trex.depth;
    
        trex.depth = trex.depth + 1;

        cloud.lifetime = 205;

        cloudsGroup.add(cloud);
    }
    
}

function spawnObstacle()
{
    if (frameCount%60 == 0){

        var obstacle = createSprite(600, height - 95, 20, 30);
        obstacle.scale = 0.5;
        obstacle.velocityX = -(6 + score / 1000)
        var rand = Math.round(random(1,6));
        switch(rand){
            case 1: obstacle.addImage(obstacle1)
            break;
            case 2: obstacle.addImage(obstacle2)
            break;
            case 3: obstacle.addImage(obstacle3)
            break;
            case 4: obstacle.addImage(obstacle4)
            break;
            case 5: obstacle.addImage(obstacle5)
            break;
            case 6: obstacle.addImage(obstacle6)
            break;
            deafault:break;

        }
        //console.log(rand)
        obstacle.lifetime = 205;
        obstaclesGroup.add(obstacle);
        //obstacle.debug = true
    }
}

function draw()
{
    background(backgroundimg);

    console.log(name);
    
    text("Score: " + score,500, 50);
    

    if(gamestate == PLAY)
    {

        score = score+Math.round(getFrameRate()/60)
        ground.velocityX = -4

        //jump when the space button is pressed
        if (keyDown("space") && trex.y > 150)
        {
            trex.velocityY = -10;
            jumpsound.play();
        }
        
        trex.velocityY = trex.velocityY + 0.8
        
        
        if (ground.x < 0)
        {
            ground.x = ground.width / 2;
        }

        spawnClouds();
        spawnObstacle();

        if(obstaclesGroup.isTouching(trex))
        {
            //trex.velocityY = -10
            gamestate = END
            diesound.play();
        }

        if(score % 100 == 0 && score > 0)
        {
            chekpointsound.play();
        }
        
    }
    else if(gamestate == END)
    {
        ground.velocityX = 0;
        obstaclesGroup.setVelocityXEach(0);
        cloudsGroup.setVelocityXEach(0);
        trex.velocityY = 0;
        obstaclesGroup.setLifetimeEach(-1);
        cloudsGroup.setLifetimeEach(-1);
        trex.changeAnimation("collided", trex_collided);
        gameover.visible = true
        restart.visible = true

        if(mousePressedOver(restart)) 
        {  
            reset()
        }
    }
    
    trex.collide(Invisibleground);
    drawSprites();

    

}
function reset()
{
    obstaclesGroup.destroyEach();
    cloudsGroup.destroyEach();
    trex.changeAnimation("running", trex_running);
    gameover.visible = false
    restart.visible = false
    score = 0
    gamestate = PLAY
}
//lifetime decreases as framecount increases
//as soon as lifetime becomes 0 obstacles desapear
//what lifetime could we set in gamestate end so that in every frame the lifetime keeps moving farther away from 0
//obstaclesGroup.setLifetimeEach(-1)