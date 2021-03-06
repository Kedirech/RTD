var pause = false;
var drawMe;
var town;
var spawnPoints;
var heros;
var monsters;
var bullets;
var trees;
var effects;
var water;
var gameWidth = 500;
var gameHeight = 500;
var mapImg;
var classArray;
var maxTownHealth = 5000;
var updateID;
var turnsSinceSpawn =0;
var herbalistLvl=0;
var carpenterLvl=0;
var hue=0;
var currentHero=0;
var App;
var Sqr;

var controlArray;

var counterMonstersKilled = 0;
var counterMonstersSpawned = 0;
var counterMonsterSpawns = 0;
var counterCurrentTrees = 0;

var controlCanvas;
var contDraw;

var AppMenu;
var SqrMenu;


function initGame(canvasElement)
{
	if (!canvasElement)
	 {
	 	
	 	controlCanvas = document.createElement("canvas");
		controlCanvas.id = "control_canvas";
		document.body.appendChild(controlCanvas);
		
        canvasElement = document.createElement("canvas");
		canvasElement.id = "halma_canvas";
		document.body.appendChild(canvasElement);
	
	
	
		$('#halma_canvas').after('<div id="counters"><ul></ul></div>');
		$('#counters ul').append('<li id="counterMonstersKilled"><strong>Monsters Killed:</strong> <span>0</span></li>');
		$('#counters ul').append('<li id="counterMonsterSpawns"><strong>Monster Spawns:</strong> <span>0</span></li>');
		$('#counters ul').append('<li id="counterCurrentTrees"><strong>Current Trees:</strong> <span>0</span></li>');
		$('#counters ul').append('<li id="counterSquireLevel"><strong>Squire Level:</strong> <span>0</span></li>');
		$('#counters ul').append('<li id="counterSquireXP"><strong>Squire XP:</strong> <span>0</span></li>');
		$('#counters ul').append('<li id="counterApprenticeLevel"><strong>Apprentice Level:</strong> <span>0</span></li>');
		$('#counters ul').append('<li id="counterApprenticeXP"><strong>Apprentice XP:</strong> <span>0</span></li>');
    }
    else
    {
    	
    }
    defineClasses();
    canvasElement.width = gameWidth;
    canvasElement.height = gameHeight;
    controlCanvas.width = gameWidth;
    controlCanvas.height = 99;
    town = new Object();
    heros = new Array();
    monsters = new Array();
    bullets = new Array();
    trees = new Array();
    effects = new Array();
    spawnPoints = new Array();
    drawMe = canvasElement.getContext("2d");
    contDraw = controlCanvas.getContext("2d");
    createControl();
    createMap();
    drawMap();
    spawnHero("Apprentice");
    App = heros[0];
    spawnHero("Squire");
    Sqr = heros[1];
    spawnMonster();
    drawMap();
    startHeroStats();
    defineAppMenu();
    defineSqrMenu();
    
    changeToApprentice();
    //updateID = setInterval(update,25);
	update();
}

function upAppDmg()
{
	if (App.xp > 100)
	{
		App.atkDmg *= 1.5;
		App.xp-=100;
		AppMenu[4].text = "Damage: " + Math.floor(App.atkDmg);
		AppMenu[1].text = "XP: " + Math.floor(App.xp);
	}
}

function upAppRng()
{
	if (App.xp > 300)
	{
		App.rng += 15;
		App.xp-=300;
		AppMenu[5].text = "Range: " + Math.floor(App.rng);
		AppMenu[1].text = "XP: " + Math.floor(App.xp);
	}
}

function upAppAtkSpd()
{
	if (App.xp > 500)
	{
		App.atkSpd -= 1;
		App.xp-=500;
		AppMenu[6].text = "Atk CD: " + Math.floor(App.atkSpd);
		AppMenu[1].text = "XP: " + Math.floor(App.xp);
	}
}

function upAppTgt()
{
	if (App.xp > 1000)
	{
		App.maxTargets += 1;
		App.xp-=1000;
		AppMenu[7].text = "Max Targets: " + Math.floor(App.maxTargets);
		AppMenu[1].text = "XP: " + Math.floor(App.xp);
	}
}

function upAppSpd()
{
	if (App.xp > 100)
	{
		App.spd += 1 ;
		App.xp-=100;
		AppMenu[8].text = "Move Spd: " + Math.floor(App.spd);
		AppMenu[1].text = "XP: " + Math.floor(App.xp);
	}
}

function upSqrDmg()
{
	if (Sqr.xp > 100)
	{
		Sqr.atkDmg *= 1.5;
		Sqr.xp-=100;
		SqrMenu[4].text = "Damage: " + Math.floor(Sqr.atkDmg);
		SqrMenu[1].text = "XP: " + Math.floor(Sqr.xp);
	}
}

function upSqrRng()
{
	if (Sqr.xp > 300)
	{
		Sqr.rng += 5;
		Sqr.xp-=300;
		SqrMenu[5].text = "Range: " + Math.floor(Sqr.rng);
		SqrMenu[1].text = "XP: " + Math.floor(Sqr.xp);
	}
}

function upSqrAtkSpd()
{
	if (Sqr.xp > 500)
	{
		Sqr.atkSpd -= 1;
		Sqr.xp-=500;
		SqrMenu[6].text = "Atk CD: " + Math.floor(Sqr.atkSpd);
		SqrMenu[1].text = "XP: " + Math.floor(Sqr.xp);
	}
}

function upSqrCritRate()
{
	if (Sqr.xp > 250)
	{
		Sqr.critRate += .05;
		Sqr.xp-=1000;
		SqrMenu[7].text = "Crit Rate: " + Sqr.critRate + "%";
		SqrMenu[1].text = "XP: " + Math.floor(Sqr.xp);
	}
}

function upSqrSpd()
{
	if (Sqr.xp > 100)
	{
		Sqr.spd += 1 ;
		Sqr.xp-=100;
		SqrMenu[8].text = "Move Spd: " + Math.floor(Sqr.spd);
		SqrMenu[1].text = "XP: " + Math.floor(Sqr.xp);
	}
}

function startHeroStats()
{
	App.atkDmg = 20;
	App.rng = 60;
	App.spd = 10;
	App.atkSpd = 10;
	App.maxTargets = 1;
	
	Sqr.atkDmg = 30;
	Sqr.rng = 20;
	Sqr.spd = 25;
	Sqr.atkSpd = 5;
	Sqr.critRate =.05;
	Sqr.maxTargets = 5;
	
	/*hero.lvl =1;
	hero.hp =classArray[i][1]*10*(1+Math.random()*.3);
	hero.atkDmg =classArray[i][2]*10*(1+Math.random()*.3);
	hero.rng =classArray[i][3]*10*(1+Math.random()*.3);
	hero.spd =classArray[i][4]*10*(1+Math.random()*.3);
	hero.attack =classArray[i][5];
	hero.special = classArray[i][6];
	hero.color = classArray[i][7];
	hero.vx = 0;
	hero.vy = 0;*/
}
function changeActive()
{
	
}

function changeToApprentice()
{
	controlArray = AppMenu;
}
function changeToSquire()
{
	controlArray = SqrMenu;
}

function defineAppMenu()
{
	AppMenu = Array(12);
	for(i = 0;i<12;i++)
	{
		AppMenu[i] = new Object();
	}
	AppMenu[0].click = changeToSquire;
	AppMenu[0].text = "Apprentice";
	AppMenu[1].click = noFunction;
	AppMenu[1].text = "XP: "+Math.floor(App.xp);
	AppMenu[2].click = noFunction;
	AppMenu[2].text = "Kills: ";
	AppMenu[3].click = noFunction;
	AppMenu[3].text = "";
	AppMenu[4].click = upAppDmg;
	AppMenu[4].text = "Damage: " +Math.floor( App.atkDmg);
	AppMenu[5].click = upAppRng;
	AppMenu[5].text = "Range: " +Math.floor( App.rng);
	AppMenu[6].click = upAppAtkSpd;
	AppMenu[6].text = "Atk CD: "+Math.floor( App.atkSpd);
	AppMenu[7].click = upAppTgt;
	AppMenu[7].text = "Max Targets: "+Math.floor( App.maxTargets);
	AppMenu[8].click = upAppSpd;
	AppMenu[8].text = "Move Spd: "+Math.floor( App.spd);
	AppMenu[9].click = noFunction;
	AppMenu[9].text = "";
	AppMenu[10].click = noFunction;
	AppMenu[10].text = "";
	AppMenu[11].click = noFunction;
	AppMenu[11].text = "";
}

function defineSqrMenu()
{
	SqrMenu = Array(12);
	for(i = 0;i<12;i++)
	{
		SqrMenu[i] = new Object();
	}
	SqrMenu[0].click = changeToApprentice;
	SqrMenu[0].text = "Squire";
	SqrMenu[1].click = noFunction;
	SqrMenu[1].text = "XP: "+Math.floor(Sqr.xp);
	SqrMenu[2].click = noFunction;
	SqrMenu[2].text = "Kills: "+Math.floor(Sqr.kills);
	SqrMenu[3].click = noFunction;
	SqrMenu[3].text = "";
	SqrMenu[4].click = upSqrDmg;
	SqrMenu[4].text = "Damage: " +Math.floor( Sqr.atkDmg);
	SqrMenu[5].click = upSqrRng;
	SqrMenu[5].text = "Range: " +Math.floor( Sqr.rng);
	SqrMenu[6].click = upSqrAtkSpd;
	SqrMenu[6].text = "Atk CD: "+Math.floor( Sqr.atkSpd);
	SqrMenu[7].click = upSqrCritRate;
	SqrMenu[7].text = "Crit Rate: "+ Sqr.critRate +"%";
	SqrMenu[8].click = upSqrSpd;
	SqrMenu[8].text = "Move Spd: "+Math.floor( Sqr.spd);
	SqrMenu[9].click = noFunction;
	SqrMenu[9].text = "";
	SqrMenu[10].click = noFunction;
	SqrMenu[10].text = "";
	SqrMenu[11].click = noFunction;
	SqrMenu[11].text = "";
}

function noFunction(){}


function createControl(){
	var i
	controlArray = Array(12);
	
	controlCanvas.addEventListener("click",controlPanelClick,false);
	
		for (i=0;i<12;i++)
		{
		
			var x,y;
			y = Math.floor(i/4)*33;
			x = i%4*gameWidth/4;
			contDraw.fillStyle = "rgb(10,100,"+i*10+")";
			contDraw.fillRect(x,y,gameWidth/4,33);
			drawRoundRect(contDraw,x+1,y+1,gameWidth/4-3,31);
			controlArray[i] = new Object();
			controlArray[i].redraw = basicDraw;
			controlArray[i].click = basicClick;
			controlArray[i].text = "";
		}
		
	controlArray[1].click = spawnTree;
	controlArray[2].click = createSpawn;
	controlArray[1].text = "Spawn Tree";
	controlArray[2].text = "Create Spawn";
	
}

function basicClick(i)
{
	alert("Button " + i+  " clicked.")
}

function basicDraw(i)
{
	//alert(i);
	//console.log(controlArray[i].text);
	var x,y;
	y = Math.floor(i/4)*33;
	x = i%4*gameWidth/4;
	contDraw.fillStyle = "rgb(10,100,"+i*10+")";
	contDraw.fillRect(x,y,gameWidth/4,33);
	drawRoundRect(contDraw,x+1,y+1,gameWidth/4-3,31);
	contDraw.font = "bold 12px sans-serif rgg(0,0,0)";
	contDraw.fillStyle = "rgb(0,0,0)";
	contDraw.fillText(controlArray[i].text,x+5,y+20);
}

function controlPanelClick(e)
{
	var mousePoint = getCursorPosition(e,controlCanvas);
	var i = Math.floor(mousePoint.y/33)*4+Math.floor(mousePoint.x*4/gameWidth);
	controlArray[i].click();
}

function getCursorPosition(e, refObj) // returns an object that has the x and y coordinates of the nouse click relative to the canvas
{
	var x;
	var y;
	
	if (e.pageX!= undefined && e.pageY != undefined)
	{
		x = e.pageX;
		y = e.pageY;	
	}
	else
	{
		x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
	
	x-= refObj.offsetLeft;
	y-= refObj.offsetTop;
	
	var mousePoint = new Object();
	mousePoint.x = x;
	mousePoint.y = y;
	
	
	return mousePoint;
}

function drawRoundRect(paper,x,y,w,h)
{
	var p = Math.PI;
	paper.beginPath();
	var r = Math.min(w,h)/2; 
	paper.moveTo(x+r,y);
	paper.lineTo(x+w-r,y);
	//paper.arcTo(x+w-r,y,x+w-r,y+h,r);
	paper.arc(x+w-r,y+r,r,3*p/2,p/2,false);
	paper.lineTo(x+r,y+h);
	//paper.arcTo(x+r,y+h,x+r,y,r);
	paper.arc(x+r,y+r,r,p/2,3*p/2,false);
	paper.storkeStyle = "rgb(0,0,0)";
	paper.stroke();
}

function createMap(){
	
	drawMe.fillStyle = "rgb(20,240,10)";
	drawMe.fillRect(0,0,gameWidth,gameHeight);
	town.x = Math.random()*gameWidth*1/3+gameWidth*1/3;
	town.y = Math.random()*gameHeight*1/3+gameHeight*1/3;
	town.health = maxTownHealth;
	drawMe.fillStyle = "rgb(139,69,18)";
	drawMe.arc(town.x,town.y,20,0,7);
	drawMe.closePath();
	drawMe.fill();
	
	createSpawn();
	for (var initTrees=0;initTrees<20;initTrees++)
	{spawnTree();}
	spawnMonster();
}


function spawnMonster(){
	i = Math.floor(spawnPoints.length*Math.random());
	var monster = new Object();
	monster.x = spawnPoints[i].x + Math.random()*30-15;
	monster.y = spawnPoints[i].y + Math.random()*30-15;
	monster.vx = 0;
	monster.vy = 0;
	monster.hp = 10* Math.pow(spawnPoints.length,1.75);
	monster.xp = 10 * Math.pow(spawnPoints.length+1,.5);
	monster.atk = 5 + spawnPoints.length*5;
	monster.color = "rgb(0,0,0)";
	
	monster.sprite = document.getElementById('img-monster-1');
	//monster.sprite = new Image();
	//monster.sprite.src = 'images/monster-1.gif';
	
	monsters.push(monster);
	
	counterMonstersSpawned++;
}

function createSpawn()
{
	var spawn = new Object();
	do
	{
		spawn.x = Math.random()*gameWidth;
		spawn.y = Math.random()*gameHeight;
	}	
	while (dist(spawn.x,spawn.y,town.x,town.y)<50)	
	spawnPoints.push(spawn);
}

function dist(x1,y1,x2,y2)
{
	return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2))
}

function drawMap()
{
	drawMe.canvas.height = drawMe.canvas.height;
	var i;
	for (i = 0;i<12;i++)
	{
		basicDraw(i);
	}
	
	var bgImg = new Image();
	bgImg.src = 'images/field.png';
	
	drawMe.drawImage(bgImg, 0, 0);
	
	/* drawMe.fillStyle = "rgb(20,240,10)";
	drawMe.fillRect(0,0,gameWidth,gameHeight);
	 */
	drawMe.fillStyle = "rgb(139,69,18)";
	drawMe.arc(town.x,town.y,30,0,Math.PI*2*town.health/maxTownHealth);
	drawMe.closePath();
	drawMe.fill();
	
	
	
	var townImg = new Image();
	townImg.src = 'images/castle.png';
	
	drawMe.drawImage(townImg, town.x - Math.round(townImg.width/2), town.y - Math.round(townImg.height/2));
	
	var p;
	for (i in trees)
	{
		p = trees[i];
		/* drawMe.beginPath();
		drawMe.fillStyle = "rgb(20,120,50)";
		drawMe.arc(p.x,p.y,5,0,7);
		drawMe.closePath();
		drawMe.fill(); */
		var img = new Image();
		img.src = 'images/tree-s-' + p.type + '.png';
		var xOffset = Math.round(img.width / 2);
		var yOffset = Math.round(img.height / 2);
		
		drawMe.drawImage(img, p.x - xOffset, p.y - yOffset);
	}
	
	//console.log(spawnPoints);
	for (i in spawnPoints)
	{
		p = spawnPoints[i];
		/* drawMe.beginPath();
		//console.log(p);
		//drawMe.moveTo(p.x,p.y);
		drawMe.fillStyle = "rgb(200,20,50)";
		drawMe.arc(p.x,p.y,15,0,7);
		drawMe.closePath();
		drawMe.fill(); */
		
		var img = new Image();
		img.src = 'images/spawn.png';
		
		drawMe.drawImage(img, p.x - Math.round(img.width/2), p.y - Math.round(img.height/2))
	}
	for (i in heros)
	{
		p = heros[i];
		/* drawMe.beginPath();
		drawMe.fillStyle = p.color;
		drawMe.arc(p.x,p.y,10,0,7);
		drawMe.closePath();
		drawMe.fill(); */
		
		// Draw Sprite
		var sprite = new Image();
		if(p.heroType == 'Squire')
		{
			sprite.src = 'images/blackmage.png';
		}
		else
		{
			sprite.src = 'images/fighter.png';
		}
		
		drawMe.drawImage(sprite, p.x - 14, p.y - 21);
	}
	for (i in monsters)
	{
		p = monsters[i];
		/* drawMe.beginPath();
		drawMe.fillStyle = p.color;
		drawMe.arc(p.x,p.y,5,0,7);
		drawMe.closePath();		
		drawMe.fill(); */
		
		var xOffset = 0; //Math.round(p.sprite.width / 2);
		var yOffset = 0; //Math.round(p.sprite.height / 2);
		
		//console.log(p);
		
		drawMe.drawImage(p.sprite, p.x - xOffset, p.y - yOffset);
	}
	for(i in effects)
	{
		p = effects[i];
		p.draw();
		p.frameLife = p.frameLife-1;
		//console.log(p.frameLife);
		if (p.frameLife < 1)
		{
			//console.log("WTF");
			effects.splice(i,1);
			i=i-1;
		}
	}
}

function defineClasses()
{
	var App = [1,2];
	var Sqr = [1,2];
	var y = [App,Sqr];
	classArray = y;
	
	classArray[0][0] = "Apprentice";
	classArray[0][1] = "15";
	classArray[0][2] = "10";
	classArray[0][3] = "6";
	classArray[0][4] = "1";
	classArray[0][5] = rangeAttack;
	classArray[0][6] = noSpecial;
	classArray[0][7] = "rgb(10,0,200)";
	
	classArray[1][0] = "Squire";
	classArray[1][1] = "25";
	classArray[1][2] = "15";
	classArray[1][3] = "3";
	classArray[1][4] = "2";
	classArray[1][5] = meeleAttack;
	classArray[1][6] = noSpecial;
	classArray[1][7] = "rgb(200,100,100)";
}


function promoteHero(hero,heroType)
{
	var i,j;
	hero.heroType= heroType;
	//i = classID[heroType];
	if (heroType == "Apprentice")
		i = 0;
	else
		i = 1;
	
	
	hero.lvl =1;
	hero.hp =classArray[i][1]*10*(1+Math.random()*.3);
	hero.atkDmg =classArray[i][2]*10*(1+Math.random()*.3);
	hero.rng =classArray[i][3]*10*(1+Math.random()*.3);
	hero.spd =classArray[i][4]*10*(1+Math.random()*.3);
	hero.attack =classArray[i][5];
	hero.special = classArray[i][6];
	hero.color = classArray[i][7];
	hero.vx = 0;
	hero.vy = 0;
}

function classID()
{
	var Apprentice = 0;
	var Squire = 1;
}

function noSpecial()
{
	
}

function distance(a,b)
{
	return dist(a.x,a.y,b.x,b.y);
}

function attract(a,b,str) //Function that accelerates a towards b str scales the attraction.  Negative will repel
{
	r = Math.max(distance(a,b),10);
	a.vx = Math.max(-25,Math.min(25,a.vx))
	a.vy = Math.max(-25,Math.min(25,a.vy))
	a.vx += str*(b.x-a.x)/(r*r);
	a.vy += str*(b.y-a.y)/(r*r);
}
function relocate(a)
{
	a.x += a.vx;
	a.y += a.vy;
	a.vx *=.95;
	a.vy *=.95;
}
function wallForce(a)
{
	var k = .1;
	if (a.x > gameWidth-10)
	{
		a.vx += (-a.x+gameWidth-10)*k;
	}
	if (a.x < 10)
	{
		a.vx += (10 - a.x)*k;
	}
	if (a.y > gameHeight-10)
	{
		a.vy += (-a.y+gameHeight-10)*k;
	}
	if (a.y < 10)
	{
		a.vy += (10 - a.y)*k;
	}
}

function update()
{
	var i,j;
	//move Monsters
	for(i in monsters)
	{
		wallForce(monsters[i]);
		for (j in trees)
		{
			attract(monsters[i],trees[j],25);
		}
		if (trees.length == 0)
		{
			attract(monsters[i],town,50);
		}
		relocate(monsters[i]);
	}
	//move Heros
	for(i in heros)
	{
		wallForce(heros[i]);
		for (j in monsters)
		{
			attract(heros[i],monsters[j],heros[i].spd*5);
		}
		if (monsters.length == 0)
		{
			if (town.health<maxTownHealth)
			{
				for (j in trees)
				{
					attract(heros[i],trees[j],25);
				}
			}
			else
			{
				attract(heros[i],town,50);
			}
		}
		for (j in heros)
		{
			if (i!=j)
			{
				attract(heros[i],heros[j],-15);
			}
		}
			relocate(heros[i]);
	}
	//Heros Attack
	for (i in heros)
	{
		heros[i].cd--;
		if (monsters.length!=0)
		{
			heros[i].attack();
			checkLvl(heros[i]);
		}
		if(town.health < maxTownHealth)
		{
			for (j in trees)
			{
				if (distance(trees[j],heros[i])<heros[i].rng)
				{
					trees[j].resources -=10;
					town.health +=10 + carpenterLvl;
				}
			}
		}	
	}
	//Monsters Nom Stuff
	for(i in monsters)
	{
		var hungry = true
		for(j in trees)
		{
			if (distance(monsters[i],trees[j]) < 15 && hungry)
			{
				//console.log(trees[j].resources);
				hungry = false
				trees[j].resources -= monsters[i].atk;
				if (trees[j].resources < 0)
				{
					//console.log("WTF?");
					trees.splice(j,1);
						
					j = j-1;
				}
			}
		}
		if (distance(monsters[i],town)<15 && hungry)
		{
			town.health -= monsters[i].atk;
			if (town.health <= 0)
			{
				town.health = 0;
				endGame();
				return;
			}
		}
	}
	//Spawn New Monster
	if (Math.random()<.02)
	{
		for (i=0;i<=spawnPoints.length/2 + 1;i++)
		{
			spawnMonster();
		}
	}
	
	//Spawn New Trees
	if (Math.random()<.01 + herbalistLvl)
	{
		spawnTree();
	}
	//Spawn New SpawnPoint
	turnsSinceSpawn++;
	if (Math.random()<.0001 + turnsSinceSpawn/100000)
	{
		turnsSinceSpawn = 0;
		createSpawn();
		for (i=0;i<=spawnPoints.length/2 + 1;i++)
		{
			spawnMonster();
		}
	}
	//Redraw Map
	drawMap();
	
	// Update Counters
	$('#counterCurrentTrees span').html(trees.length);
	$('#counterMonsterSpawns span').html(spawnPoints.length);
	$('#counterMonstersKilled span').html(counterMonstersKilled);
	$('#counterSquireLevel span').html(heros[1].lvl);
	$('#counterSquireXP span').html(heros[1].xp);
	$('#counterApprenticeLevel span').html(heros[0].lvl);
	$('#counterApprenticeXP span').html(heros[0].xp);
	
	
	setTimeout("update();", 25);
}

function checkLvl(hero)
{
	if (hero.xp>hero.lvl*100)
	{
	//	levelUp(hero);	
	}
}

function levelUp(hero)
{
	hero.xp -= hero.lvl*100;
	hero.atkSpd -= 1/3;
	hero.maxTargets++;
	hero.rng +=1.1;
	hero.lvl++;
	carpenterLvl +=2.5;
	herbalistLvl +=.001;
}

function endGame()
{
	alert("Game Over!");
	//clearInterval(updateID);
}

function meeleAttack()
{
	//console.log("Meele Attack");
	attacks = 0;
	if (this.cd<1)
	{
		for(i in monsters)
		{
			var m;
			m = monsters[i];
			if (dist(m.x,m.y,this.x,this.y) < this.rng && attacks < this.maxTargets)
			{
				attacks++;
				console.log(attacks);
				m.hp = m.hp - this.atkDmg;
				
				this.cd = this.atkSpd;
				var efx = new Object;
				efx.frameLife = 0;
				efx.x = this.x;
				efx.y = this.y;
				efx.rng = this.rng
				efx.draw = function(){
					drawMe.beginPath();
					drawMe.lineWidth = 5;
					drawMe.strokeStyle = "rgb(0,0,0)";
	   				drawMe.shadowColor = 'white';
	   				drawMe.shadowBlur = 10;
					drawMe.arc(this.x,this.y,this.rng,0,7);
					drawMe.stroke();
				}
				//effects.push(efx);
				if (m.hp < 1 )
				{
					this.xp += m.xp;
					SqrMenu[1].text = "XP: " + Math.floor(this.xp);
					monsters.splice(i,1);
					counterMonstersKilled++;
					this.kills++;
					SqrMenu[2].text = "Kills: " + this.kills;
					i=i-1;
				}
			}
		}
	}
}

function rangeAttack()
{
	var m;
	var distance;
	var closestDistance;
	var closest;
	if (this.cd<1)
	{
		var atks = this.maxTargets;
		for (i in monsters)
		{
			
			m = monsters[i];
			distance = dist(m.x,m.y,this.x,this.y);
			
			if (distance < this.rng && atks > 0)
			{
				//console.log(this.maxTargets+":"+atks+" xp:"+this.xp);
				atks--;
				this.cd = this.atkSpd;
				
			monsters[i].hp = monsters[i].hp - this.atkDmg
			var efx = new Object();
			efx.sx = this.x;
			efx.sy = this.y;
			efx.ex = monsters[i].x;
			efx.ey = monsters[i].y;
			efx.a = this.x-100+Math.random()*200 ;
			efx.b = this.y-100+Math.random()*200 ;
			efx.c = monsters[i].x-100+Math.random()*200 ;
			efx.d = monsters[i].y-100+Math.random()*200 ;
			
			efx.frameLife = 15;
			efx.draw = function(){
				
				drawMe.beginPath();
				drawMe.lineWidth = 5;
				hue += Math.random()*10;
				drawMe.strokeStyle ='hsl(' + hue + ', 50%, 50%)';
   				drawMe.shadowColor = 'white';
   				drawMe.shadowBlur = 10;
				drawMe.moveTo(this.sx,this.sy)
				drawMe.bezierCurveTo(this.a,this.b,this.c,this.d,this.ex,this.ey)
				drawMe.stroke();
				}
			effects.push(efx);
				if (monsters[i].hp < 1 )
				{
						
					this.xp += monsters[i].xp;;
					AppMenu[1].text = "XP: "+ Math.floor(this.xp);
					this.kills ++;
					AppMenu[2].text = "Kills: "+this.kills;
					counterMonstersKilled++;
					monsters.splice(i,1);
					
					
					i=i-1;
				}
			}
		}
	}
}


function spawnTree()
{
		var tree = new Object();
		tree.resources = 1000*Math.random()+150;
		tree.x = Math.random()*gameWidth;
		tree.y = Math.random()*gameHeight;
		
		tree.type = (Math.round(Math.random() * 100) % 3) + 1;
		
		
		trees.push(tree);
}

function spawnHero(heroType)
{
	var hero = new Object();
	if (heroType == null) 
	{
		if (Math.random() < .5) 
		{
			//alert("App");
			promoteHero(hero,"Apprentice");
		}
		else
		{	
			//alert("Squire");
			promoteHero(hero,"Squire");
			
			
		}
	}
	else
	{
		promoteHero(hero,heroType);
	}
	hero.maxTargets = 1;
	hero.atkSpd = 8;
	hero.cd = -1;
	hero.xp =0;
	hero.lvl = 1;
	hero.kills = 0;
	hero.x = town.x+Math.random()*50-25;
	hero.y = town.y+Math.random()*50-25;
	heros.push(hero);
}
