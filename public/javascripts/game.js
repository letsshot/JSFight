var WIDTH = 800,HEIGHT = 550,IMAGEW = 1097,IMAGEH = 200;
var gameover = false;

	var player1Sprite,
		player2Sprite,
		stickmanImage;

	var canvas;
	var context;
		//F==> 70
	var LeftArrow = 37,UpArrow = 38,RightArrow = 39,DownArrow = 40,Attack = 65,Block = 66,Kick = 75,TwoHands = 84;

	var ground,life1,life2;
	function gameLoop () {
	if(gameover)
	{
		document.getElementById('myCanvas').style.visibility = "hidden"; 
		return;
	}
		
	  window.requestAnimationFrame(gameLoop);

	  context.clearRect(0, 0, WIDTH, HEIGHT);

	  player1Sprite.groundText();
	  player1Sprite.render();
	  //player2Sprite.update();
	  player2Sprite.render();

	  ground.render();
	  life1.render();
	  life2.render();

	  if(life2.score == 0)
	  {
	  	alert("player1 win!!");
	  	gameover = true;
	  }
	  else if(life1.score == 0)
	  {
	  	alert("player2 win!!");
	  	gameover = true;
	  }
	}
	function getCollision(ax,ay,aw,ah,bx,by,bw,bh)
	{
		if(ax < bx+bw && ay < by+bh && bx < ax+aw &&by < ay+ah)
			return true;
		else
			return false;
	}

	life1 = {
		x:0,
		y:0,

		width:WIDTH/2-100,
		height:20,

		score:100,

		render: function ()
		{
			this.score = this.score <= 0 ? 0 :this.score;
			context.fillRect(this.x,this.y,this.score / 100 * this.width,this.height);
			context.font = "28px serif";
			context.fillText(this.score,this.x+this.width,20);
			
		}
	};
	life2 = {
		x:WIDTH/2+100,
		y:0,

		width:WIDTH/2-100,
		height:20,

		score:100,

		render: function ()
		{
			this.score = this.score <= 0 ? 0 :this.score;
			context.fillRect(this.x+this.width,this.y,-this.score / 100 *this.width,this.height);
			context.fillText(this.score,this.x-60,20);
		}
	};


	ground = {
		x:0,
		y:500,

		width:WIDTH,
		height:50,

		render : function ()
		{
			context.fillRect(this.x,this.y,this.width,this.height);
		}
	};
	function createStickman (initinfo) {
	
		var spriteObject = {};
		
		spriteObject.spliceNumber = initinfo.spliceNumber;
		spriteObject.spliceIndex = initinfo.spliceIndex;

		spriteObject.x = initinfo.x;
		spriteObject.y = initinfo.y;
		spriteObject.gravity = initinfo.gravity;
		spriteObject.opponent = initinfo.opponent;
		spriteObject.life = initinfo.life;


		spriteObject.groundText = function () {

			if(getCollision(this.x,this.y,IMAGEW/this.spliceNumber,IMAGEH,ground.x,ground.y,ground.width,ground.height))
			{
				this.gravity = 0;
			}else
			{

				this.gravity = 5;
				
			}
			this.y += this.gravity;
        };
		
		spriteObject.render = function () {

		  context.drawImage(
		    stickmanImage,
		    this.spliceIndex * IMAGEW / this.spliceNumber,
		    0,
		    IMAGEW / this.spliceNumber,
		    IMAGEH,
		    this.x,
		    this.y,
		    IMAGEW / this.spliceNumber,
		    IMAGEH);
		};
		
		return spriteObject;
	}

run = function ()
{
	canvas = document.getElementById("myCanvas");
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	context = canvas.getContext("2d");

	stickmanImage = new Image();
	
	player1Sprite = createStickman({
		
		spliceNumber: 9,
		spliceIndex:0,
		x:0,
		y:300,
		gravity:5,
		opponent:null,
		life:life1
	});

	player2Sprite = createStickman({
		spliceNumber: 9,
		spliceIndex:0,
		x:600,
		y:300,
		gravity:5,
		opponent:null,
		life:life2
	});

	player1Sprite.opponent = player2Sprite;
	player2Sprite.opponent = player1Sprite;

	ground.render();
	life1.render();
	life2.render();
	stickmanImage.addEventListener("load", gameLoop);
	stickmanImage.src = "../images/stickmansheet.png";

	document.addEventListener("keyup",function(e)
	{
		player1Sprite.spliceIndex = 0;
	});
	document.addEventListener("keydown",function(e)
	{
		if(e.keyCode == RightArrow )
			player1Sprite.x + IMAGEW / player1Sprite.spliceNumber < WIDTH ? player1Sprite.x += 30:null;
		if(e.keyCode == LeftArrow)
			player1Sprite.x > 0 ? player1Sprite.x += -30:null;
		if(e.keyCode == UpArrow)
			player1Sprite.y > 0 ? player1Sprite.y += -200 : null;
		if(e.keyCode == DownArrow)
			player1Sprite.spliceIndex = 6;
		if(e.keyCode == Block)
			player1Sprite.spliceIndex = 5;
		if(e.keyCode == TwoHands)
			player1Sprite.spliceIndex = 7;
		if(e.keyCode == Kick)
			player1Sprite.spliceIndex = 3;
		if(e.keyCode == Attack)
			player1Sprite.spliceIndex = 1;
		if(e.keyCode == Attack && getCollision(player1Sprite.x,player1Sprite.y,IMAGEW/9,IMAGEH,player1Sprite.opponent.x,player1Sprite.opponent.y,IMAGEW/9,IMAGEH))
		{
			player1Sprite.opponent.life.score += -5;
		}
		if(e.keyCode == Kick && getCollision(player1Sprite.x,player1Sprite.y,IMAGEW/9,IMAGEH,player1Sprite.opponent.x,player1Sprite.opponent.y,IMAGEW/9,IMAGEH))
		{
			player1Sprite.opponent.life.score += -10;
		}
		if(e.keyCode == TwoHands && getCollision(player1Sprite.x,player1Sprite.y,IMAGEW/9,IMAGEH,player1Sprite.opponent.x,player1Sprite.opponent.y,IMAGEW/9,IMAGEH))
		{
			player1Sprite.opponent.life.score += -15;
		}

	});
}
	