window.onload = function() {
	var startPage = document.getElementById("startPage");
	var startBtn = document.getElementById("startBtn");
	var score = document.getElementById("score");
	var map = document.getElementById("map");
	var lose = document.getElementById("lose");
	var restartBtn = document.getElementById("restartBtn");
	var loserScore = document.getElementById("loserScore");
	var snakeMove;
	var speed = 200;
	bingKeyEvent();

	function init() {
		startPage.style.display = "none";
		lose.style.display = 'none';
		this.mapW = parseInt(getComputedStyle(map).width) - 2;
		this.mapH = parseInt(getComputedStyle(map).height) - 2;
		//食物
		this.foodW = 30;
		this.foodH = 30;
		this.foodX = 0;
		this.foodY = 0;
		//蛇
		this.snakeW = 30;
		this.snakeH = 30;
		//
		this.snakeBody = [
			[3, 1, "head"],
			[2, 1, "body"],
			[1, 1, "body"]
		]
		this.direct = 'right';
		this.right = false;
		this.left = false;
		this.up = true;
		this.down = true;
		this.isKeyDown = true;
		//分数
		this.score = 0;
		score.innerHTML = this.score;
		startGame();

	}

	function startGame() {
		food();
		snake();
		snakeMove = setInterval(function() {
			this.mapW = parseInt(getComputedStyle(map).width) - 2;
			this.mapH = parseInt(getComputedStyle(map).height) - 2;
			move();
			this.isKeyDown = true;
		}, speed)
		bingKeyEvent();

	}

	function reloadGame() {
		removeClass('snake');
		removeClass('food');
		clearInterval(snakeMove);
		this.down = true;
		lose.style.display = "block";
		loserScore.innerHTML = this.score;

	}

	function food() {
		var food = document.createElement('div');
		food.style.width = this.foodW + "px";
		food.style.height = this.foodH + "px";
		food.style.position = "absolute";
		this.foodX = Math.floor(Math.random() * (this.mapW / 30));
		this.foodY = Math.floor(Math.random() * (this.mapH / 30));
		food.style.top = this.foodY * 30 + "px";
		food.style.left = this.foodX * 30 + "px";
		this.map.appendChild(food).setAttribute("class", "food");
	}

	function snake() {
		for(var i = 0; i < this.snakeBody.length; i++) {
			var snake = document.createElement('div');
			snake.style.width = this.snakeW + "px";
			snake.style.height = this.snakeH + "px";
			snake.style.position = "absolute";
			snake.style.left = this.snakeBody[i][0] * 30 + "px";
			snake.style.top = this.snakeBody[i][1] * 30 + "px";
			snake.classList.add(this.snakeBody[i][2])
			this.map.appendChild(snake).classList.add("snake");
		}

	}

	function move() {
		for(var i = this.snakeBody.length - 1; i > 0; i--) {
			this.snakeBody[i][0] = this.snakeBody[i - 1][0];
			this.snakeBody[i][1] = this.snakeBody[i - 1][1];

		}
		switch(this.direct) {
			case 'right':
				this.snakeBody[0][0] += 1;
				break;
			case 'up':
				this.snakeBody[0][1] -= 1;
				break;
			case 'left':
				this.snakeBody[0][0] -= 1;
				break;
			case 'down':
				this.snakeBody[0][1] += 1;
				break;
			default:
				break;
		}
		removeClass('snake');
		snake();
		if(this.snakeBody[0][0] == this.foodX && this.snakeBody[0][1] == this.foodY) {
			this.score += 1;
			score.innerHTML = this.score;
			removeClass('food');
			food();
			var snakeEndX = this.snakeBody[this.snakeBody.length - 1][0];
			var snakeEndY = this.snakeBody[this.snakeBody.length - 1][1];
			switch(this.direct) {
				case 'right':
					this.snakeBody.push([snakeEndX + 1, snakeEndY, "body"]);
					break;
				case 'up':
					this.snakeBody.push([snakeEndX, snakeEndY - 1, "body"]);
					break;
				case 'left':
					this.snakeBody.push([snakeEndX - 1, snakeEndY, "body"]);
					break;
				case 'down':
					this.snakeBody.push([snakeEndX, snakeEndY + 1, "body"]);
					break;
				default:
					break;
			}

		}
		if(this.snakeBody[0][0] <= 0 || this.snakeBody[0][0] >= this.mapW / 30) {
			reloadGame();
		}
		if(this.snakeBody[0][1] <= 0 || this.snakeBody[0][1] >= this.mapH / 30) {
			reloadGame();
		}
		var snakeHX = this.snakeBody[0][0];
		var snakeHY = this.snakeBody[0][1];
		for(var i = 1; i < this.snakeBody.length; i++) {
			if(snakeHX == this.snakeBody[i][0] && snakeHY == this.snakeBody[i][1]) {
				reloadGame();
			}
		}

	}

	function removeClass(className) {
		var ele = document.getElementsByClassName(className);
		while(ele.length > 0) {
			ele[0].parentNode.removeChild(ele[0]);
		}
	}

	function setDirect(code) {
		if(this.isKeyDown === false) {
			return;
		}
		this.isKeyDown = false;
		switch(code) {
			case 37:
				if(this.left) {
					this.direct = 'left';
					this.left = false;
					this.right = false;
					this.up = true;
					this.down = true;
				}
				break;
			case 38:
				if(this.up) {
					this.direct = 'up';
					this.left = true;
					this.right = true;
					this.up = false;
					this.down = false;
				}
				break;

			case 39:
				if(this.right) {
					this.direct = 'right';
					this.left = false;
					this.right = false;
					this.up = true;
					this.down = true;
				}
				break;
			case 40:
				if(this.down) {
					this.direct = 'down';
					this.left = true;
					this.right = true;
					this.up = false;
					this.down = false;
				}
				break;
			default:
				break;
		}
	}

	function bingKeyEvent() {
		document.addEventListener('keydown',function(e){
			var code = e.keyCode;
			setDirect(code);
		});
		restartBtn.addEventListener('click', function() {
			reloadGame();
			init();
		});
		startBtn.addEventListener('click', function(e) {
			e.stopPropagation();
			init();
		})

	}
}