(function(document){
	var cfg = {
		canvas: document.getElementById('canvas'),
		row: 16,
		col: 16,
		img: 80
	};
	function Game(config){
		this.canvas = config.canvas;
		this.row = (config.row%2?Math.abs(config.row)+1:Math.abs(config.row)) || 10;
		this.col = (config.col%2?Math.abs(config.col)+1:Math.abs(config.col)) || 10;
		this.img = config.img || 30;
		this.gezi = [];
		this.ctx = this.canvas.getContext('2d');
		this.canvasW = this.canvas.width;
		this.canvasH = this.canvas.height;
		this.sPos = [-1,-1];
		this.ePos = [-1,-1];
		this.cellW = this.canvasW/this.col;
		this.cellH = this.canvasH/this.row;
		this.allPosObj = {};
	}
	Game.prototype = {
		startGame: function(){
			var that = this;
			this.init();
			this.canvas.addEventListener('click',function(e){
				var x = Math.floor(e.offsetX/that.cellW);
				var y = Math.floor(e.offsetY/that.cellH);
				if(that.gezi[y][x]===0){
					return;
				}
				if(that.sPos[0] === -1){
					that.sPos[0] = x;
					that.sPos[1] = y;
					return;
				}else{
					if(x === that.sPos[0] && y === that.sPos[1]){
						that.sPos[0] = -1;
						that.sPos[1] = -1;
						return;
					}
					that.ePos[0] = x;
					that.ePos[1] = y;
				}
				that.selectClaerImg();
			});
		},
		init: function(){
			var imgNum = 0;
			var cou = 0;
			var r = 0;
			var c = 0;
			var that = this;
			var lent = (this.row-2)*(this.col-2)/2;
			for(var i = 0; i < this.row; i++){
				this.gezi[i] = [];
				for(var j = 0; j < this.col; j++){
					this.gezi[i][j] = 0;
				}
			}
			for(var i = 0; i < lent; i++){
				imgNum = Math.floor(Math.random()*this.img)+1;
				cou = 0;
				while(cou < 2){
					r = Math.floor(Math.random()*(this.row-2))+1;
					c = Math.floor(Math.random()*(this.col-2))+1;
					if(this.gezi[r][c] === 0){
						cou++;
						this.gezi[r][c] = imgNum;
					}
				}
			}
			if(this.isDeadLock()){
				this.drawUI(this.gezi);
			}else{
				this.init();
			};
		},
		drawUI: function(arr){
			var that = this;
			for(var r = 1; r < this.row-1; r++){
				for(var c = 1; c < this.col-1; c++){
					if(arr[r][c] === 0){
						break;
					}
					(function(r,c){
						var img = new Image();
						img.src = 'img/' + arr[r][c] + '.png';
						img.onload = function(){
							that.ctx.drawImage(img,c*that.cellW,r*that.cellH,that.cellW,that.cellH);
						}
					})(r,c);
				}
			}
		},
		isDeadLock: function(){
			this.allPosObj = {};
			var leng = 0;
			var isUpdata = true;
			var imgArr = [];
			var num = 0;
			var cou = 0;
			var that = this;
			var r = 0;
			var c = 0;
			for(var i = 1; i < this.row-1; i++){
				for(var j = 1; j < this.col-1; j++){
					if(this.gezi[i][j] !== 0){
						var posObj = {r:i,c:j};						
						if(!this.allPosObj[this.gezi[i][j]]){
							this.allPosObj[this.gezi[i][j]] = [];
						}
						this.allPosObj[this.gezi[i][j]].push(posObj);
					}
				}
			}
			for(var i = 1; i <= this.img; i++){
				if(this.allPosObj[i]){
					leng = this.allPosObj[i].length;
					for(var j = 0; j < leng-1; j++){
						for(var k = j+1; k < leng; k++){
							this.sPos[0] = this.allPosObj[i][j].c;
							this.sPos[1] = this.allPosObj[i][j].r;
							this.ePos[0] = this.allPosObj[i][k].c;
							this.ePos[1] = this.allPosObj[i][k].r;
							isUpdata = this.pathComparison();
							if(!isUpdata){
								this.sPos[0] = -1;
								this.sPos[1] = -1;
								this.ePos[0] = -1;
								this.ePos[1] = -1;
								return true;
							}
						}
					}
				}
			}
			this.sPos[0] = -1;
			this.sPos[1] = -1;
			this.ePos[0] = -1;
			this.ePos[1] = -1;
			return false;
		},
		selectClaerImg: function(){
			var cou = 0;
			var imgNumArr = [];
			if(this.gezi[this.sPos[1]][this.sPos[0]] === this.gezi[this.ePos[1]][this.ePos[0]]){
				var roadBlock = this.pathComparison();
				if(roadBlock){
//					console.log('此路不通！请绕道！')
				}else{
					this.ctx.clearRect(this.sPos[0]*this.cellW,this.sPos[1]*this.cellH,this.cellW,this.cellH);
					this.ctx.clearRect(this.ePos[0]*this.cellW,this.ePos[1]*this.cellH,this.cellW,this.cellH);
					this.gezi[this.sPos[1]][this.sPos[0]] = 0;
					this.gezi[this.ePos[1]][this.ePos[0]] = 0;
					//检查是否锁死
					if(!this.isDeadLock()){
						this.ctx.clearRect(0,0,this.canvasW,this.canvasH);
						for(var k in this.allPosObj){
							for(var i = 0; this.allPosObj[k][i]; i++){
								this.gezi[this.allPosObj[k][i].r][this.allPosObj[k][i].c] = 0;
							}
							imgNumArr.push(k);
						}
						for(var i = 0; i < imgNumArr[i]; i++){
							cou = 0;
							while(cou < 2){
								r = Math.floor(Math.random()*(this.row-2))+1;
								c = Math.floor(Math.random()*(this.col-2))+1;
								if(this.gezi[r][c] === 0){
									cou++;
									this.gezi[r][c] = imgNumArr[i];
								}
							}
						}
						this.drawUI(this.gezi);
					};
				}
			}else{
//				console.log('选中图片不一样！不予处理');
			}
			this.sPos[0] = -1;
			this.sPos[1] = -1;
			this.ePos[0] = -1;
			this.ePos[1] = -1;
			this.spathArr = [];
			this.epathArr = [];
		},
		pathComparison: function(){
			var tmp1 = [];
			var tmp2 = [];
			var sR = this.sPos[1];
			var sC = this.sPos[0];
			var eR = this.ePos[1];
			var eC = this.ePos[0];
			var max = 0;
			var min = 0;
			var isReturn = true;
			if((sR === 0 && eR === 0)||(sR === this.row-1 && eR === this.row-1)||(sC === 0 && eC === 0)||(sC === this.col-1 && eC === this.col-1)){
				return false;
			}
			if((sR === eR && sC+1 === eC)||(sR === eR && sC-1 === eC)||(sC === eC && sR+1 === eR)||(sC === eC && sR-1 === eR)){
				return false;
			}
			tmp1 = this.findPath(this.sPos);
			tmp2 = this.findPath(this.ePos);
			for(var i = 0; tmp1[i]; i++){
				for(var j = 0; tmp2[j]; j++){
					if(tmp1[i].r === tmp2[j].r && tmp1[i].c === tmp2[j].c){
						return false;
					}
				}
			}
			for(var i = 0; tmp1[i]; i++){
				for(var j = 0; tmp2[j]; j++){
					if(tmp1[i].c === tmp2[j].c){
						isReturn = true;
						max = tmp1[i].r>tmp2[j].r?tmp1[i].r:tmp2[j].r;//1
						min = tmp1[i].r<tmp2[j].r?tmp1[i].r:tmp2[j].r;//5
						for(min += 1; min < max; min++){
							if(this.gezi[min][tmp1[i].c] !== 0){
								isReturn = false;
								break;
							}
						}
						if(isReturn){
							return false;
						}
					}
					if(tmp1[i].r === tmp2[j].r){
						isReturn = true;
						max = tmp1[i].c>tmp2[j].c?tmp1[i].c:tmp2[j].c;//1
						min = tmp1[i].c<tmp2[j].c?tmp1[i].c:tmp2[j].c;//5
						for(min += 1; min < max; min++){
							if(this.gezi[tmp1[i].r][min] !== 0){
								isReturn = false;
								break;
							}
						}
						if(isReturn){
							return false;
						}
					}
				}
			}
			return true;
		},
		findPath: function(arr){
			var sR = arr[1];
			var sC = arr[0];
			var tmp = [];
			//向下寻找
			for(var i = sR + 1; i < this.row; i++){
				if(this.gezi[i][sC] !== 0){
					break;
				}
				tmp.push({r:i,c:sC});
			}
			//向上寻找
			for(var i = sR - 1; i >= 0; i--){
				if(this.gezi[i][sC] !== 0){
					break;
				}
				tmp.push({r:i,c:sC});
			}
			//向左寻找
			for(var i = sC - 1; i >= 0; i--){
				if(this.gezi[sR][i] !== 0){
					break;
				}
				tmp.push({r:sR,c:i});
			}
			//向右寻找
			for(var i = sC + 1; i < this.col; i++){
				if(this.gezi[sR][i] !== 0){
					break;
				}
				tmp.push({r:sR,c:i});
			}
			return tmp;
		}
	}
	var game = new Game(cfg);
	game.startGame();
	
	
})(document)
