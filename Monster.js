var deadMusic;

class Monster{
    constructor(x, y, imagePath){
        this.x = x;
        this.y = y;
        this.path = []; 
        this.image = new Image();
        this.image.src = imagePath;
        this.visited = [];
    }

    DrawMonster(){
        context.drawImage(this.image, this.x * cellWidth, this.y * cellHeight, cellWidth, cellHeight);				
    }

    getRandomPoint(){
        var point;
        do {
            var x = Math.floor(Math.random() * (boardSize - 1));
            var y = Math.floor(Math.random() * (boardSize - 1));	
            point = matrix.get(String(x) + " " + String(y));
        } while(typeof point == "undefined" || !point.isPassable); 
        return point;
    }

    constructPathBFS(from, to){
        var visited = new Set();
        var queue = [from]; 
        while(queue.length > 0){ 
            var element = queue.pop();
            visited.add(element); 
    
            if(element === to){ 
                var path = [];
                var current = element; 
                while(current !== from){
                    path.push(current);
                    current = current.prev;
                }
                path.push(from);
                path.reverse();
                return path; 
            }
    
            element.neighbours.forEach(n => {
                if(n.isPassable && !visited.has(n)){
                   n.prev = element;
                   queue.unshift(n);
                }
            });
        }
        return [];
    }

    distanceBetween(x1, y1, x2, y2){
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    }

    UpdateMonsterLocation(){
        var dist = this.distanceBetween(this.x, this.y, packmanX, packmanY)
        if(dist <= 12){
            this.destinationX = packmanX;
            this.destinationY = packmanY;
            this.destination = matrix.get(String(this.destinationX) + " " + String(this.destinationY));
        }
        else 
            this.destination = this.getRandomPoint(); 
        
        this.currentPoint = matrix.get(String(this.x) + " " + String(this.y));

        this.path = this.constructPathBFS(this.currentPoint, this.destination);

        if(this.path.length >= 2){ 
            this.currentTarget = this.path[1];
        } 
        else { 
            this.currentTarget = this.path[0];
            this.destination = this.getRandomPoint(); 
        } 
        
        if(this.currentTarget !== this.currentPoint && !this.visited.includes(this.currentTarget)){     
            this.visited.push(this.currentTarget); 
            if (this.visited.length > 4)
                this.visited.splice(0, 1);
        
            if(this.currentTarget.x > this.currentPoint.x)
                this.x++;
            else if(this.currentTarget.x < this.currentPoint.x)
                this.x--;
            else if(this.currentTarget.y < this.currentPoint.y)
                this.y--;
            else if(this.currentTarget.y > this.currentPoint.y)
                this.y++;
        }
        else
            this.visited.splice(0, 1);
    }
    
    CheckPackmanMonster(){
        if(this.x == packmanX && this.y == packmanY)
        {
            var audio = document.getElementById("myAudio");
            numberOfLife--;
            score = score - 10;
            if (numberOfLife > 0)
            {

                $("#msgAlert").text(numberOfLife + " LIFE LEFT!!!");
                if (!audio.paused) {
                    audio.src = "./resources/audio/Death + Background.mp3";
                    audio.play();
                    audio.loop = false;
                    deadMusic = true;
                }
                else {
                    audio.src = "./resources/audio/Death.mp3";
                    audio.play();
                    audio.loop = false;
                }
                board[packmanX][packmanY] = 0;
                cameFrom = 4;

                RandomPackmanLocation();
                InitialMonsters();
                ShowLife();

            }	
            else if (numberOfLife == 0)
                $("#msgAlert").text("GAME OVER!");
        }
    }
}
