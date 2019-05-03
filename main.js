function Snake(initLength, board) {
	
	this.body;
	
	this.move = function(direction) {
		
		var bodyLength = this.body.length-1;
		var matrixLength = board.matrix[0].length-1;
	
		var newSquare;
		switch(direction) {
			case 'up':
				var newSquare = {x: this.body[bodyLength].x, y: this.body[bodyLength].y-1};
				if(newSquare.y < 0 || board.matrix[newSquare.y][newSquare.x] === 1) return -1;
			break;
			case 'down':
				var newSquare = {x: this.body[bodyLength].x, y: this.body[bodyLength].y+1};
				if(newSquare.y > matrixLength || board.matrix[newSquare.y][newSquare.x] === 1) return -1;
			break;
			case 'left':
				var newSquare = {x: this.body[bodyLength].x-1, y: this.body[bodyLength].y};
				if(newSquare.x < 0 || board.matrix[newSquare.y][newSquare.x] === 1) return -1;
			break;
			case 'right':
				var newSquare = {x: this.body[bodyLength].x+1, y: this.body[bodyLength].y};
				if(newSquare.x > matrixLength || board.matrix[newSquare.y][newSquare.x] === 1) return -1;
			break;
		}
		
		if(board.matrix[newSquare.y][newSquare.x] === 2) { 
			board.drawRandomPoint();
		} else {
			var oldSquare = this.body[0];
			this.body.shift();
			board.drawSquare('remove', oldSquare);
		}
		
		this.body.push(newSquare);
		board.drawSquare('add', newSquare);
		
	}
	
	this.init = function() {
		this.body = [];
		for(var i = 0; i < initLength; i++){
			var point = {x: 0, y: i};
			this.body.push(point);
			board.drawSquare('add', point);
		}
	}

}

function Board(size) {
	
	var boardElement = document.getElementById('board');
	
	this.size = size || 10;
	
	this.matrix;
	
	this.drawSquare = function(action, point){
		this.matrix[point.y][point.x] = action === 'remove' ? 0 : 1;
		var squareId = 'square_' + point.y + '_' + point.x;
		var square = document.getElementById(squareId);
		square.style.background = action === 'remove' ? 'white' : 'gray';		
	}
	
	this.renderGameBoard = function(point, snake) {
		this.matrix = [];
		boardElement.innerHTML = '';
		var borderProp = '1px solid black';
		function drawRow(element) {
			var rowWidth = size * 31;
			element.style.borderLeft = borderProp;
			element.style.borderTop = borderProp;
			element.style.width = rowWidth+'px';
			element.style.height = '30px';
		}
		
		function drawCol(element, point) {
			element.style.width = '30px';
			element.style.borderRight = borderProp;
			element.style.display = 'inline-block';
			element.style.height = '30px';
			element.setAttribute('id', 'square_' + (point.x + '_' + point.y));
		}
		
		var row;
		for(var i = 0; i < size; i++) {
			row = document.createElement('div');
			drawRow(row);
			this.matrix[i] = [];
			for(var j = 0; j < size; j++) {
				var col = document.createElement('div');
				drawCol(col, {x: i, y: j});
				row.appendChild(col);
				this.matrix[i][j] = 0;
			}
			boardElement.appendChild(row);
		}
		row.style.borderBottom = '1px solid black';
	}
	
	this.getRandomPoint = function() {
		return{x: parseInt(Math.random() * this.size), y: parseInt(Math.random() * this.size)}
	}
	
	this.drawRandomPoint = function() {
		do{
			var point = this.getRandomPoint();
		} while (this.matrix[point.x][point.y] !== 0)
			
		this.matrix[point.x][point.y] = 2;
		var squareId = 'square_' + point.x + '_' + point.y;
		document.getElementById(squareId).style.background = 'brown';
	}
	
}

function Game(snake, board) {
	
	var direction, interval, self = this, moveLocked = false;
	self.init = function(){
		direction = '';
		interval = null;
		board.renderGameBoard();
		snake.init();
		board.drawRandomPoint();
	}	
	
	document.onkeydown = checkKey;
	
	self.start = function() {	
		interval = setInterval(() => {
			moveLocked = false;
			if(snake.move(direction) === -1) {
				alert('Game Over!');
				clearInterval(interval);
				self.init();
			} 
		}, 200);		
		
	}
	
	function checkKey(e) {
		
		if(moveLocked) return;
		moveLocked = true;
		
		if(!interval) {
			self.start();
		}

		e = e || window.event;

		if (e.keyCode == '38') {
			direction !== 'down' && (direction = 'up');
		}
		else if (e.keyCode == '40') {
			direction !== 'up' && (direction = 'down');
		}
		else if (e.keyCode == '37') {
		   direction !== 'right' && (direction = 'left');
		}
		else if (e.keyCode == '39') {
		   direction !== 'left' && (direction = 'right');
		}

	}

}

var board = new Board(10);
var snake = new Snake(5, board);
var game = new Game(snake, board);

board.renderGameBoard();
game.init();
