var restart;
var restartAnim;
var gameOver;
var gameOverAnim;

var grupoNuvens;
var grupoObstaculos;

var JOGAR=1;
var ENCERRAR=0;
var estadoDoJogo=JOGAR;

var somCheckpoint;
var somJump;
var somDie;

var pontuacao=0;

var trex;
var trexAnim;
var trexColidindo;

var ave;
var aveAnim;
var aveAnim2;

var borda;
 
var chao;
var chaoAnim;

var obstaculo;
var obstaculoAnim1;
var obstaculoAnim2;
var obstaculoAnim3;
var obstaculoAnim4;
var obstaculoAnim5;
var obstaculoAnim6;

var nuvemAnim;

var chaoInvisivel;

function preload(){
  
  trexAnim = loadAnimation("trex1.png", "trex3.png", "trex4.png");
    trexColidindo = loadAnimation("trex_collided.png");
  
  aveAnim = loadAnimation("pterodactilo1.png", "pterodactilo2.png", "pterodactilo3.png");
  
  aveAnim2 = loadAnimation("pterodactilo1.png");

  chaoAnim = loadImage("ground2.png");

  nuvemAnim = loadImage("cloud.png");
  
  somCheckpoint = loadSound("checkPoint.mp3");
  somDie = loadSound("die.mp3");
  somJump = loadSound("jump.mp3");
  
  obstaculoAnim1 = loadImage("obstacle1.png");
  obstaculoAnim2 = loadImage("obstacle2.png");
  obstaculoAnim3 = loadImage("obstacle3.png");
  obstaculoAnim4 = loadImage("obstacle4.png");
  obstaculoAnim5 = loadImage("obstacle5.png");
  obstaculoAnim6 = loadImage("obstacle6.png");
  trexColidindo = loadAnimation("trex_collided.png");
  gameOverAnim = loadImage("gameOver.png");
  restartAnim = loadImage("restart.png");
  
}

function setup(){
  createCanvas(windowWidth,windowHeight)
  
  ave = createSprite(650, 45, 20, 20);
  ave.addAnimation("fly", aveAnim);
  ave.velocityX=-5;
  ave.scale=0.1;
  
  gameOver = createSprite(width/2,90);
  gameOver.addImage(gameOverAnim);
  gameOver.scale=0.7;
  
  restart = createSprite(width/2,140);
  restart.addImage(restartAnim);
  restart.scale=0.8;
  
  //criar um sprite do trex
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trexAnim);
  trex.addAnimation("collide", trexColidindo);
  trex.scale=0.4;
  trex.setCollider("circle", 0, 0, 30);
  //trex.debug=true;

  borda=createEdgeSprites();
  
  chao=createSprite(300,180,600,1);
  chao.addImage(chaoAnim);
  chao.x = chao.width/2; 

  chaoInvisivel=createSprite(300,186,600,5);
  chaoInvisivel.visible=false;
  
  grupoNuvens = new Group();
  grupoObstaculos = new Group();

  var rand = Math.round(random(1,100));
  console.log(rand);
  
}

function draw(){
  
  background("Ivory");
  
  text (mouseX+"," + mouseY, mouseX, mouseY)
  
  text ("pontuação: "+pontuacao,490,20)
  console.log(pontuacao);
  //esta indicando tudo que vai estar acontecendo enquanto o estado do jogo for jogar
  if (estadoDoJogo==JOGAR){
 
    pontuacao = pontuacao + Math.round(frameCount %3==0);
   
    chao.velocityX = -(5+3*pontuacao/100);
    
    if(pontuacao>0 && pontuacao%100==0){
       somCheckpoint.play();
       }
    
    if(keyDown("up")&& trex.y>160){
   
    trex.velocityY = -10;
    somJump.play()
  }
  trex.velocityY = trex.velocityY + 0.8;
    
  gameOver.visible = false;
  restart.visible = false;
    
 trex.changeAnimation("running", trexAnim);
    
     if(chao.x<0){
    chao.x=chao.width/2;
  }
    
    if (grupoObstaculos.isTouching(trex)){
        
      estadoDoJogo=ENCERRAR;
      
      somDie.play();
      
}
    gerarAves();
  
    gerarNuvens();
    
    gerarObstaculos();
    //da uma ideia de "senao, fazer tal coisa"
} else if(estadoDoJogo==ENCERRAR){
   trex.velocityY = 0;
   chao.velocityX = 0;
   ave.velocityX = 0;
   trex.changeAnimation("collide", trexColidindo);
   ave.changeAnimation("colidiu", aveAnim2);
   grupoObstaculos.setVelocityXEach(0);
   grupoNuvens.setVelocityXEach(0);
   
  gameOver.visible = true;
  restart.visible = true;
   
  
  grupoObstaculos.setLifetimeEach(-1);
  grupoNuvens.setLifetimeEach(-1);
  
  if (mousePressedOver(restart)){
      
    reiniciar();
      }
}


  trex.collide(chaoInvisivel);
 
  drawSprites();

}

function gerarAves(){
  
  if (frameCount % 240==0){
      
    ave = createSprite(width, 45, 20, 20);
 ave.addAnimation("fly", aveAnim);
 ave.addAnimation("colidiu", aveAnim2);
 ave.velocityX=-5;
 ave.scale=0.1;
 ave.y = Math.round(random(45,100))
  }
  
  if (ave.isTouching(trex)){
    estadoDoJogo = ENCERRAR;
  }
  ave.lifetime = 140
}
function gerarNuvens(){
  if (frameCount % 60==0){
       
  var nuvem=createSprite(600,40,10,10);
  
  nuvem.addImage(nuvemAnim);
  nuvem.scale=0.6;
    
  nuvem.y = Math.round(random(35,65))
    
  nuvem.velocityX=-3
  
  nuvem.depth = trex.depth
    
  trex.depth=trex.depth+1
    
    nuvem.lifetime=250;
    
    grupoNuvens.add(nuvem);
    
   }
}

  function gerarObstaculos(){
  //esta criando um obstaculo a cada 60 quadros
  if (frameCount %60==0){
  obstaculo = createSprite(width,170,20,20);
  obstaculo.velocityX = -(5+2*pontuacao/100)
  obstaculo.scale=0.45;
  obstaculo.lifetime=250;
  var obsAleatorios = Math.round(random(1,6));
  //fazendo surgir obstaculos aleatorios
    switch(obsAleatorios){
    case 1:obstaculo.addImage(obstaculoAnim1);
    break;
    case 2:obstaculo.addImage(obstaculoAnim2);
    break;
    case 3:obstaculo.addImage(obstaculoAnim3);
    break;
    case 4:obstaculo.addImage(obstaculoAnim4);
    break;
    case 5:obstaculo.addImage(obstaculoAnim5);
    break;
    case 6:obstaculo.addImage(obstaculoAnim6);
    break;
    default:break;
  }
    grupoObstaculos.add(obstaculo);
  }
}

function reiniciar(){
  
  estadoDoJogo=JOGAR;
  
  grupoObstaculos.destroyEach(); 
  grupoNuvens.destroyEach();
  ave.destroy();
  
  pontuacao=0;
 
  gameOver.visible=false;
  restart.visible=false;
}