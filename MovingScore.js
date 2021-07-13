class MovingScore {
	constructor(imagePath){
		this.SetRandomLocation();
		this.image = imagePath;
		this.visited = [];
    }

	DrawMoreScore(){
		context.drawImage(this.image, this.x * cellWidth, this.y * cellHeight, cellWidth, cellHeight);				
	}

	SetRandomLocation() {
		var flag = true;
		var xLocation =  10;
		var yLocation =  10;
		while (flag)
		{
			monsters.forEach(monster => {
				if (xLocation == monster.x && yLocation == monster.y)
					flag = false;
			});

			if (flag && board[xLocation][yLocation] != Cell.Wall && board[xLocation][yLocation] != Cell.Packman) {
				this.x = xLocation;
				this.y = yLocation;
				flag = false
			}
			else {
				flag = true;
				var direction = Math.floor(Math.random() * 4) + 1 ;
				if(direction == 1)
					yLocation = yLocation - 1;
				
				else if(direction == 2)
					yLocation = yLocation + 1;
				
				else if(direction == 3)
					xLocation= xLocation - 1;
				else
					xLocation = xLocation + 1;
			}		
		}
	}

	ChooseLocation(xLocation, yLocation){
		var direction = Math.floor(Math.random() * 4) + 1 ;
		if(direction == 1)
			yLocation = yLocation - 1;
		
		else if(direction == 2)
			yLocation = yLocation + 1;
		
		else if(direction == 3)
			xLocation= xLocation - 1;
		else
			xLocation = xLocation + 1;
		
		return matrix.get(String(xLocation) + " " + String(yLocation));
	}

	UpdateMoreScoreLocation()
	{
		flag = true;
		while (flag) {
			var direction = this.ChooseLocation(this.x, this.y);
			if(this.CheckLocation(direction)){
				flag = false;
				
				this.x = direction.x;
				this.y = direction.y;

				this.visited.push(direction); 
				if (this.visited.length > 3)
					this.visited.splice(0, 1);
			}
		}
	}

	CheckLocation(direction){ 
		var xLocation = direction.x;
		var yLocation = direction.y;

		monsters.forEach(monster => {
			if(monster.x == xLocation && monster.y == yLocation)
				return false;
		});

		if (xLocation > 0 && yLocation > 0 && xLocation < 19 && yLocation < 19)
			if(!this.visited.includes(direction))
				if (board[xLocation][yLocation] != Cell.Wall && board[xLocation][yLocation] != Cell.Packman && (board[xLocation][yLocation] == Cell.Empty || board[xLocation][yLocation] == Cell.Color5Point || board[xLocation][yLocation] == Cell.Color15Point || board[xLocation][yLocation] == Cell.Color25Point))
					return true;
			else
				this.visited.splice(0, 1);

		return false;
	}

	CheckPackmanBonus(){
		if(this.x == packmanX && this.y == packmanY){
			score = score + 50;
			lblScore.value = score;
			flagBonus = false;
			thix.x = -1;
			this.y = -1;
			window.clearInterval(movingScoreInterval);
		}
	}
}