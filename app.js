var context;
var shape = new Object();
var board;
var boardSize = 20;
var score;
var start_time;
var time_elapsed;
var remainBalls;

var updatePositionInterval;
var moveMonstersInterval;
var showExtraScoreInterval;
var showHeartInterval;
var showExtraTimeInterval;
var movingScoreInterval;

var cellWidth;
var cellHeight;

var cameFrom;
var numberOfLife;

var packmanX;
var packmanY;

var packmanImageRight;
var packmanImageLeft;
var packmanImageUp;
var packmanImageDown;

var winnerImage;
var loserImage;

var extraScoreImage;
var startExtra;
var cntExtra;

var heartImage;
var startHeart;
var cntHeart;

var clockImage;
var startExtraTime;
var cntTime;

var counter5;
var counter15;
var counter25;

var number5balls;
var number15balls;
var number25balls;

var moreScore;
var flagBonus;

var redMonster;
var orangeMonster;
var greenMonster;
var blueMonster;
var monsters;

var matrix = new Map();

const Cell = {
	Packman: '2',
	Wall: '4',
	Color5Point: '5',
	Color15Point: '15',
	Color25Point: '25',
	RedMonster: '8',
	OrangeMonster: '9',
	BlueMonster: '11',
	GreenMonster: '10',
	Empty: '0',
	ExtraScore: '100',
	Heart: '3',
	Time: '1',
	ExtraPoint: '50'

};

class Node {
    constructor(isPassable, x, y){
        this.isPassable = isPassable; 
        this.neighbours = []; 
        this.x = x;
        this.y = y;
    }
}


const walls = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			   [1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1],
			   [1,0,1,1,1,0,1,0,1,0,0,1,0,1,0,1,1,1,0,1],
			   [1,0,1,0,0,0,1,0,1,1,1,1,0,1,0,0,0,1,0,1],
			   [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
			   [1,0,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,0,1],
			   [1,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,1],
			   [1,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,1],

			   [1,0,1,1,1,1,0,1,0,1,1,1,1,0,1,1,1,1,0,1],
			   [1,0,1,0,0,1,0,1,0,1,0,0,0,0,1,0,0,1,0,1],
			   [1,0,0,0,0,1,0,1,0,1,0,0,0,0,1,0,0,0,0,1],
			   [1,1,1,0,0,1,0,1,1,1,1,1,1,0,1,0,0,1,1,1],

			   [1,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
			   [1,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,1],
			   [1,0,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,0,1],
			   [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
			   [1,0,1,0,0,0,1,0,1,1,1,1,0,1,0,0,0,1,0,1],
			   [1,0,1,1,1,0,1,0,1,0,0,1,0,1,0,1,1,1,0,1],
			   [1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1],
			   [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];


function ShowSettings(){
	$("#userNameGame").text(loginUserName);	

	$("#upKey").text(upKey);
	$("#downKey").text(downKey);
	$("#leftKey").text(leftKey);
	$("#rightKey").text(rightKey);

	$("#amountBalls").text(amountBalls);
	$("#amountMonsters_g").text(amountMonsters);
	$("#gameTotalTime").text(gameTime);

	$("#color5").val(color5pt);
	$("#color15").val(color15pt);
	$("#color25").val(color25pt);
};

// Game
function InitialGame(){
	ShowSettings();

	// PACKMAN 
	packmanImageRight = new Image();
	packmanImageRight.src = "./resources/images/PackmanRight.png";
	packmanImageLeft = new Image();
	packmanImageLeft.src = "./resources/images/PackmanLeft.png";
	packmanImageDown = new Image();
	packmanImageDown.src = "./resources/images/PackmanDown.png";
	packmanImageUp = new Image();
	packmanImageUp.src = "./resources/images/PackmanUp.png";

	winnerImage = new Image();
	winnerImage.src = "./resources/images/Winner.png";
	loserImage = new Image();
	loserImage.src = "./resources/images/Loser.png";

	// GIFTS 
	extraScoreImage = new Image();
	extraScoreImage.src = "./resources/images/Candy.png";
	
	heartImage = new Image();
	heartImage.src = "./resources/images/Heart.png";

	clockImage = new Image();
	clockImage.src = "./resources/images/Clock.png";

	// BALLS
	number5balls = 0.6 * amountBalls;
	number15balls = 0.3 * amountBalls;
	number25balls = 0.1 * amountBalls;

	// MUSIC
	var audio = document.getElementById("myAudio");
	audio.src = "./resources/audio/Background-Audio.mp3";
	audio.play();

	ShowLife();

	cellWidth = canvas.width / boardSize;
	cellHeight = canvas.height / boardSize;
}

function ShowLife(){
	let lifeImage = '';

	for (var i = 0; i < numberOfLife; i++ ) 
		lifeImage += "<img src='./resources/images/Heart.png'/ height='20px' weight='20px'>";
	
	document.getElementById('lifeDiv').innerHTML = lifeImage;
	$("#msgAlert").text(numberOfLife + " LIFE LEFT!!!");
}

function ShowGifts(cnt, CellType) {
	var flag = true;
	while (flag && cnt == 0){
		var x =  Math.floor(Math.random() * (18 - 1 + 1) + 1);
		var y =  Math.floor(Math.random() * (18 - 1 + 1) + 1);

		if (board[x][y] != Cell.Wall && board[x][y] != Cell.Packman) {
			board[x][y] = CellType;
			flag = false;
			cnt = 1;
		}
    }

	if(CellType == Cell.Heart){
		cntHeart = cnt;
		startHeart = new Date();
	}
	else if (CellType == Cell.ExtraScore){
		cntExtra = cnt;
		startExtra = new Date();
	}
	else {
		cntTime = cnt;
		startExtraTime = new Date();
	}
}

function BuildMoreScore() {
	flagBonus = true;
	moreScoreImage = new Image();
	moreScoreImage.src = "./resources/images/bonus-points.png";
	moreScore = new MovingScore(moreScoreImage)
}

function BuildMatrix(){
	for(let i = 0; i < boardSize ; i++)
	{
		for(let j = 0; j <  boardSize ; j++)
		{        
			const char = board[i][j];
			
			const passable = char != Cell.Wall 
			const node = new Node(passable, i, j);

			matrix.set(String(i) + " " + String(j), node);
		}
	}

	for(let i = 0; i  < boardSize; i++){
		for(let j = 0; j < boardSize; j++){
			var node = matrix.get(String(i) + " " + String(j));
			var aboveNode = matrix.get(String(i) + " " + String(j-1));
			var leftNode = matrix.get(String(i-1) + " " + String(j));
			var rightNode = matrix.get(String(i+1) + " " + String(j));
			var downNode = matrix.get(String(i) + " " + String(j+1));

			const neighbours = [aboveNode, leftNode, rightNode, downNode];
			neighbours.forEach(n => {
				if(typeof n != "undefined")
					node.neighbours.push(n);
			});
		}
	}
}

function RandomPackmanLocation() {
	var flag = true;
	while (flag)
    {
		packmanX =  Math.floor(Math.random() * (16 - 4 + 1) + 4);
		packmanY =  Math.floor(Math.random() * (16 - 4 + 1) + 4);

		if (walls[packmanX][packmanY] != 1) 
		{
			board[packmanX][packmanY] = 2;
			flag = false;
			shape.i = packmanX;
			shape.j = packmanY;
		}
    } 
}

function InitialParametes () {
	numberOfLife = 5;
	ShowLife();
	
	counter5 = 0;
	counter15 = 0;
	counter25 = 0;

	cameFrom = 4;

	cntExtra = 0;
	cntHeart = 0;
	cntTime = 0;

	remainBalls = amountBalls;

	flagBonus = false;
	deadMusic = false;

	updatePositionInterval = setInterval(UpdatePosition, 150);
	moveMonstersInterval = setInterval(MoveMonsters, 500);

	showExtraScoreInterval = setInterval( function() { ShowGifts(cntExtra, Cell.ExtraScore); }, 10000 );
	showHeartInterval = setInterval(function() { ShowGifts(cntHeart, Cell.Heart); }, 18000);
	showExtraTimeInterval = setInterval(function() { ShowGifts(cntTime, Cell.Time); }, 29000);

	setTimeout(function(){
		BuildMoreScore();
		movingScoreInterval = setInterval(MoveExtraPoint, 500);
	}, 18000);
}

function ClearAllIntervals (){
	window.clearInterval(updatePositionInterval);
	window.clearInterval(moveMonstersInterval);
	window.clearInterval(showExtraScoreInterval);
	window.clearInterval(showHeartInterval);
	window.clearInterval(showExtraTimeInterval);
	window.clearInterval(movingScoreInterval);
}

function Start() {
	InitialParametes();
	InitialGame();

	board = new Array();
	score = 0;
	ballsTaken = 0;
	var cnt = 1000;
	var food_remain = amountBalls;
	start_time = new Date();
 
	for (var i = 0; i < boardSize; i++) 
		board[i] = new Array();

	RandomPackmanLocation()

	for (var i = 0; i < boardSize; i++) {
		for (var j = 0; j < boardSize; j++) {
			if (walls[i][j] == 1)
				board[i][j] = 4;
			else {
				var randomNum = Math.random();
				if (randomNum <= (1.0 * food_remain) / cnt) {
					food_remain--;
					board[i][j] = 1;
				} 
	
				else 
					board[i][j] = 0;
				cnt--;
			}
		}
	}
	while (food_remain > 0) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 1;
		food_remain--;
	}

	BuildMatrix();

	InitialMonsters();
	InitialBalls();

	keysDown = {};
	addEventListener(
		"keydown",
		function(e) {
			keysDown[e.keyCode] = true;
		},
		false
	);
	addEventListener(
		"keyup",
		function(e) {
			keysDown[e.keyCode] = false;
		},
		false
	);
}

function MoveExtraPoint(){
	moreScore.UpdateMoreScoreLocation()
}

function MuteAudio() { 
	var audio = document.getElementById("myAudio");
	var image = document.getElementById("mute_img");

	if (audio.paused)
	{
		audio.src = "./resources/audio/Background-Audio.mp3"
		audio.play();
		image.src = "./resources/images/UnMute.png"
		deadMusic = false;
	}
	else{
		audio.pause(); 
		deadMusic = false;
		image.src = "./resources/images/Mute.png";
	}
} 

function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * 19 + 1);
	var j = Math.floor(Math.random() * 19 + 1);
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * 19 + 1);
		j = Math.floor(Math.random() * 19 + 1);
	}
	return [i, j];
}

function GetKeyPressed() {
	if (keysDown[upKey.charCodeAt(0)] || keysDown[38]) {
		return 1;
	}
	if (keysDown[downKey.charCodeAt(0)] || keysDown[40]) {
		return 2;
	}
	if (keysDown[leftKey.charCodeAt(0)] || keysDown[37]) {
		return 3;
	}
	if (keysDown[rightKey.charCodeAt(0)] || keysDown[39]) {
		return 4;
	}
}

function InitialBalls(){
	for (var i = 0; i < boardSize; i++) {
		for (var j = 0; j < boardSize; j++) {
			if (board[i][j] == 1) {
				let flag = true;
				while (flag){
					let typeBall = Math.floor(Math.random() * 4);
					if (typeBall == 1 && number5balls > 0){
						number5balls--;
						board[i][j] = Cell.Color5Point;
						flag = false;
					}
					if (typeBall == 2 && number15balls > 0){
						number15balls--;
						board[i][j] = Cell.Color15Point;
						flag = false;
					}
					if (typeBall == 3 && number25balls > 0){
						number25balls--;
						board[i][j] = Cell.Color25Point;
						flag = false;
					}
				}
			}
		}
	}
}

function InitialMonsters(){
	if (amountMonsters == 1) {
		redMonster = new Monster(1, 1, "./resources/images/RedMonsterR.png");
		monsters = [redMonster];

		monsters.push(redMonster);
		board[1][1] = Cell.RedMonster;
	}
	else if (amountMonsters == 2) {
		redMonster = new Monster(1, 1, "./resources/images/RedMonsterR.png");
		orangeMonster = new Monster(18, 18, "./resources/images/OrangeMonsterR.png");
		monsters = [redMonster,orangeMonster];
		
		board[1][1] = Cell.RedMonster;
		board[18][18] = Cell.OrangeMonster;
	}
	else if (amountMonsters == 3) {
		redMonster = new Monster(1, 1, "./resources/images/RedMonsterR.png");
		orangeMonster = new Monster(18, 18, "./resources/images/OrangeMonsterR.png");
		greenMonster = new Monster(1, 18, "./resources/images/GreenMonsterR.png");
		
		monsters = [redMonster,orangeMonster, greenMonster];

		board[1][1] = Cell.RedMonster;
		board[18][18] = Cell.OrangeMonster;
		board[1][18] = Cell.GreenMonster;
	}
	else if (amountMonsters == 4) {
		redMonster = new Monster(1, 1, "./resources/images/RedMonsterR.png");
		orangeMonster = new Monster(18, 18, "./resources/images/OrangeMonsterR.png");
		greenMonster = new Monster(1, 18, "./resources/images/GreenMonsterR.png");
		blueMonster = new Monster(18, 1, "./resources/images/BlueMonsterR.png");
		
		monsters = [redMonster,orangeMonster, greenMonster, blueMonster];

		board[1][1] = Cell.RedMonster;
		board[18][18] = Cell.OrangeMonster;
		board[1][18] = Cell.GreenMonster;
		board[18][1] = Cell.BlueMonster;
	}
}

function DrawAllMonsters() {
	monsters.forEach(monster => {
        monster.DrawMonster();
    });
}

function Draw() {
	remainBalls = 0;
	canvas.width = canvas.width;
	lblScore.value = score;
	lblTime.value = time_elapsed;
	for (var i = 0; i < boardSize; i++) {
		for (var j = 0; j < boardSize; j++) {
			var center = new Object();
			
			center.x = i * cellWidth;
			center.y = j * cellHeight;

			if (board[i][j] == Cell.Packman) {
				if (cameFrom == 1)
					context.drawImage(packmanImageUp, center.x, center.y, cellWidth, cellHeight);				
				else if (cameFrom == 2)
					context.drawImage(packmanImageDown, center.x, center.y, cellWidth, cellHeight);	
				else if (cameFrom == 3)
					context.drawImage(packmanImageLeft, center.x, center.y, cellWidth, cellHeight);	
				else if (cameFrom == 4)
					context.drawImage(packmanImageRight, center.x, center.y, cellWidth, cellHeight);	
			}
			else if (board[i][j] == Cell.ExtraScore){
				var currentTime = new Date();
				if((currentTime - startExtra) / 1000 > 5){
					board[i][j] = Cell.Empty;
					cntExtra = 0;
				}
				else 
					context.drawImage(extraScoreImage, center.x, center.y, cellWidth, cellHeight);
			}
			else if (board[i][j] == Cell.Heart){
				var currentTime = new Date();
				if((currentTime - startHeart) / 1000 > 5){
					board[i][j] = Cell.Empty;
					cntHeart = 0;
				}
				else 
					context.drawImage(heartImage, center.x, center.y, cellWidth, cellHeight);
			}
			else if (board[i][j] == Cell.Time){
				var currentTime = new Date();
				if((currentTime - startExtraTime) / 1000 > 5){
					board[i][j] = Cell.Empty;
					cntTime = 0;
				}
				else 
					context.drawImage(clockImage, center.x, center.y, cellWidth, cellHeight);
			}
			else if (board[i][j] == Cell.Color5Point) {
				remainBalls++;
				context.beginPath()
				context.arc(center.x + cellWidth / 2, center.y + cellHeight / 2, 10, 0, 2 * Math.PI); 
				context.fillStyle = color5pt; 
				context.fill();
				
				context.strokeStyle = "black";
				context.font = "14px Georgia";
				context.lineWidth = 10;
				context.beginPath();
				context.fillStyle = "black";
				context.fillText("5", center.x + 11, center.y + 17);
				context.fill();
				flag = false;
			} 
			else if (board[i][j] == Cell.Color15Point) {
				remainBalls++;
				context.beginPath();
				context.arc(center.x + cellWidth / 2, center.y + cellHeight / 2 , 10, 0, 2 * Math.PI); 
				context.fillStyle = color15pt; 
				context.fill();
				context.strokeStyle = "black";
				context.font = "14px Georgia";
				context.lineWidth = 10;
				context.beginPath();
				context.fillStyle = "black";
				context.fillText("15", center.x + 8, center.y + 17);
				context.fill();
				flag = false;
			} 
			else if (board[i][j] == Cell.Color25Point) {
				remainBalls++;
				context.beginPath();
				context.arc(center.x + cellWidth / 2, center.y + cellHeight / 2, 10, 0, 2 * Math.PI); 
				context.fillStyle = color25pt; 
				context.fill();
				context.strokeStyle = "black";
				context.font = "14px Georgia";
				context.lineWidth = 10;
				context.beginPath();
				context.fillStyle = "black";
				context.fillText("25", center.x + 8, center.y + 17);
				context.fill();
				flag = false;
			} 
			else if (board[i][j] == Cell.Wall) {
				context.beginPath();
				context.rect(center.x, center.y, cellWidth, cellHeight);
				context.fillStyle = "grey"; //color
				context.fill();
			}
		}
	}

}

function MoveMonsters(){
	monsters.forEach(monster => {
        monster.UpdateMonsterLocation();
    });
}

function UpdatePosition() {
	var audio = document.getElementById("myAudio");
	if (audio.paused){
		if (deadMusic){
			audio.src = "./resources/audio/Background-Audio.mp3" 
			audio.play();
			audio.loop = true;
			deadMusic = False;
		}
	}

	board[shape.i][shape.j] = 0;
	var x = GetKeyPressed();

	packmanX = shape.i;
	packmanY = shape.j;
	
	if (x != null)
		cameFrom = x;
	if (x == 1) {
		if (shape.j > 0 && board[shape.i][shape.j - 1] != Cell.Wall) {
			shape.j--;
			packmanY = shape.j;
		}
	}
	if (x == 2) {
		if (shape.j < 19 && board[shape.i][shape.j + 1] != Cell.Wall) {
			shape.j++;
			packmanY = shape.j;
		}
	}
	if (x == 3) {
		if (shape.i > 0 && board[shape.i - 1][shape.j] != Cell.Wall) {
			shape.i--;
			packmanX = shape.i;
		}
	}
	if (x == 4) {
		if (shape.i < 19 && board[shape.i + 1][shape.j] != Cell.Wall) {
			shape.i++;
			packmanX = shape.i;
		}
	}

	monsters.forEach(monster => {
        monster.CheckPackmanMonster();
    });

	if (typeof moreScore != "undefined")
		moreScore.CheckPackmanBonus();

	if (board[shape.i][shape.j] == Cell.Color5Point) {
		score = score + 5;
		board[shape.i][shape.j] = Cell.Empty;
		ballsTaken++;
	}
	else if (board[shape.i][shape.j] == Cell.Color15Point) {
		score = score + 15;
		board[shape.i][shape.j] = Cell.Empty;
		ballsTaken++;
	}
	else if (board[shape.i][shape.j] == Cell.Color25Point) {
		score = score + 25;	
		board[shape.i][shape.j] = Cell.Empty;
		ballsTaken++;
	}
	else if (board[shape.i][shape.j] == Cell.ExtraScore) {
		score = score + 100;
		cntExtra = 0;
		board[shape.i][shape.j] = Cell.Empty;
	}
	else if (board[shape.i][shape.j] == Cell.Heart) {
		numberOfLife++;
		ShowLife();
		cntHeart = 0;
		board[shape.i][shape.j] = Cell.Empty;
	}
	else if (board[shape.i][shape.j] == Cell.Time) {
		gameTime = parseInt(gameTime) + 5;
		$("#gameTotalTime").text(gameTime);
		cntTime = 0;
		board[shape.i][shape.j] = Cell.Empty;
	}
	
	board[shape.i][shape.j] = 2;
	CheckIfGameOver();
}

function CheckIfGameOver(){
	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;

	if (numberOfLife == 0){
		ShowLife();
		$("#msgAlert").text("Loser!!!");	
		context.drawImage(loserImage, 100, 150, 400, 300);				
		ClearAllIntervals();

		var audio = document.getElementById("myAudio");
		audio.src = "./resources/audio/Death.mp3" 
		audio.play();
		audio.loop = false;
	}
	else if(remainBalls == 0){
		$("#msgAlert").text("Winner");
		context.drawImage(winnerImage, 100, 150, 400, 300);	
		
		ClearAllIntervals();
		
		var audio = document.getElementById("myAudio");
		audio.src = "./resources/audio/Win.mp3" 
		audio.play();
		audio.loop = false;
	}	
	else if (time_elapsed > gameTime) {
		var audio = document.getElementById("myAudio");			
		if (score < 100){ 
			$("#msgAlert").text("You are better than " + score + " points!");
			context.drawImage(loserImage, 100, 150, 400, 300);	
			audio.src = "./resources/audio/Death.mp3" 
			audio.play();
		}
		else {
			$("#msgAlert").text("Winner");
			context.drawImage(winnerImage, 100, 150, 400, 300);	
			audio.src = "./resources/audio/Win.mp3" 
			audio.play();
		}
		
		ClearAllIntervals();
		var audio = document.getElementById("myAudio");
		audio.loop = false;
	}
	else {
		Draw();
		DrawAllMonsters();
		if(flagBonus)
			moreScore.DrawMoreScore();
	}
}













