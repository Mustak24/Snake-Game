class snakeGame{
    #snakeInfo = []
    #snakeDir = [0, 0];
    #speed = 500;
    #snakeHead;
    #gameInterval;
    #snakeFoodInfo;
    #snakeFood;
    #snakeEnd;
    
    gameHiScore = 0;
    gameScore = 0;

    constructor(pixels=[25,25], speed=500){
        this.#speed = speed < 100 ? 100 : speed;
        this.pixels = pixels;
        this.#createBord();
        this.#createHead();
        this.bord.appendChild(this.#createSnakeFood());
        this.displayScore('game-score');
        this.displayHiScore('game-hi-score');
    }

    #createBord(){
        this.bord = document.createElement('div');
        this.bord.classList = 'snake-game-bord';
        this.bord.style.position = 'relative';
        this.bord.style.width = `${this.pixels[0]*20}px`;
        this.bord.style.height = `${this.pixels[1]*20}px`;
        this.bord.id = 'snakeGameBord';
    }

    #createHead(){
        this.#snakeHead = this.#createSnakeBody(12, 12);
        this.#snakeHead.classList = 'snake-head';
        this.bord.appendChild(this.#snakeHead);
    }

    #createSnakeBody(x=0,y=0){
        if(x < 0) x = 0;
        if(x > this.pixels[0]-1) x = 24;
        if(y < 0) y = 0;
        if(y > this.pixels[1]-1) y = 24;

        this.#snakeInfo.push([x, y]);

        let div = document.createElement('div');
        div.id = `snake-body-${this.#snakeInfo.length-1}`;
        div.classList = 'snake-body';
        div.style.width = '20px';
        div.style.height = '20px';
        div.style.position = 'absolute'
        div.style.left = `${x*20}px`;
        div.style.top = `${y*20}px`;
        div.style.transition = 'all .1s'
        return div
    }

    #createSnakeFood(){
        let x = parseInt(Math.random()*this.pixels[0]);
        let y = parseInt(Math.random()*this.pixels[1]);

        if(this.#snakeInfo.includes([x,y])) return this.#createSnakeFood();

        this.#snakeFoodInfo = [x, y];

        let div = document.createElement('div');
        div.classList = 'snake-food'
        div.style.width = '20px';
        div.style.height = '20px';
        div.style.position = 'absolute';
        div.style.left = `${x*20}px`;
        div.style.top = `${y*20}px`;

        this.#snakeFood = div;

        return div
   
    }

    #isSnakeEatFood(){
        return this.#snakeInfo[0][0] == this.#snakeFoodInfo[0] && this.#snakeInfo[0][1] == this.#snakeFoodInfo[1]
    }

    #handleSnakeDirection(key){
        let dic = {
            'w': [0, -1], 'ArrowUp': [0, -1],
            's': [0, 1], 'ArrowDown': [0, 1],
            'a': [-1, 0], 'ArrowLeft': [-1, 0],
            'd': [1, 0], 'ArrowRight': [1, 0],
        }

        let angel = {
            'w': '-90deg', 'ArrowUp': '-90deg',
            's': '90deg', 'ArrowDown': '90deg',
            'a': -'180deg', 'ArrowLeft': '180deg',
            'd': '0deg', 'ArrowRight': '0deg',
        }
        
        if(!dic[key]) return false;
        if(!(dic[key][0] + this.#snakeDir[0]) && !(dic[key][1] + this.#snakeDir[1])) return false;

        this.#snakeDir = dic[key]
        this.#snakeHead.style.rotate = angel[key];


        return this.#run();
    }

    #updateSnakePosition(){
        this.#snakeEnd = this.#snakeInfo[this.#snakeInfo.length-1];

        for(let i=this.#snakeInfo.length-1; i>0; i--){
            console.log('>>', this.#snakeInfo)
            this.#snakeInfo[i][0] = this.#snakeInfo[i-1][0];
            this.#snakeInfo[i][1] = this.#snakeInfo[i-1][1];
        }

        this.#snakeInfo[0][0] += this.#snakeDir[0];
        this.#snakeInfo[0][1] += this.#snakeDir[1];

    }

    #moveSnake(){
        this.#snakeInfo.forEach((e, i) => {
            let snake = document.getElementById(`snake-body-${i}`);
            snake.style.left = `${e[0]*20}px`;
            snake.style.top = `${e[1]*20}px`;
        });
    }

    #isGameOver(){
        let [x, y] = this.#snakeInfo[0];

        if(x < 0 || x > this.pixels[0]-1 || y < 0 || y > this.pixels[1]-1) return true;

        for(let i=1; i<this.#snakeInfo.length; i++){
            let [tempX, tempY] = this.#snakeInfo[i];
            if(x == tempX && y == tempY) return true;
        }

        return false
    }

    #gameOver(afterGameOver=()=>{}){
        clearInterval(this.#gameInterval);
        return afterGameOver()
    }

    #run(){
        this.#updateSnakePosition()
        
        if(this.#isGameOver()) return this.#gameOver();

        this.#moveSnake();

        if(!this.#isSnakeEatFood()) return;

        this.gameScore += 1;
        this.#speed -+ 10;

        if(this.gameScore > this.hiScore) this.gameHiScore = this.gameScore;

        this.#snakeFood.remove()
        this.bord.appendChild(this.#createSnakeFood());
        this.bord.appendChild(this.#createSnakeBody(...this.#snakeEnd));
    }
    
    pause(){
        clearInterval(this.#gameInterval);
        window.removeEventListener('keyup', () => this.#handleSnakeDirection());
    }

    displayScore(id){
        let box = document.getElementById(id);
        if(box) box.innerHTML = this.gameScore;
    }

    displayHiScore(id){
        let box = document.getElementById(id);
        if(box) box.innerHTML = this.gameHiScore;
    }

    play(){
        window.addEventListener('keyup',  (e) => this.#handleSnakeDirection(e.key))
        this.#gameInterval = setInterval(() => {
            this.#run()
        }, this.#speed)
    }
}
