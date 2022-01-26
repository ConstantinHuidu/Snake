let game_speed = 1000;
let score = 0;
let foodValue = 0;
let grid = document.querySelector(".grid");
grid.hidden = true;
let width = 21;
let direction = 1;
let squares = document.querySelectorAll(".grid div");
let showScore = document.getElementById("showScore");
showScore.hidden = true;
showScore.innerHTML = "Score: " + score;

function play(btn) {
    id = btn.id;
    if (id == "play-easy") {
        game_speed = 300;
        foodValue = 1;
    } else if (id == "play-hard") {
        game_speed = 150;
        foodValue = 5;
    }
    document.getElementById("play-easy").disabled = true;
    document.getElementById("play-hard").disabled = true;
    grid.hidden = false;
    showScore.hidden = false;
    createBoard();
}

//create game board and start game
function createBoard() {
    for (let i = 0; i < width * width; ++i) {
        let div = document.createElement("div");
        grid.appendChild(div);
        div.classList.add("cell");
    }
    createSnake();
    createFood();
    mainLoop();
}

//creates a snake in the center of the grid
function createSnake() {
    let squares = document.querySelectorAll(".grid div");
    let centerOfGrid = Math.floor(width * width / 2);
    currentSnake = [centerOfGrid, centerOfGrid - 1, centerOfGrid - 2];
    currentSnake.forEach(index=>squares[index].classList.add("snake"));
}

//randomly place food on the grid
function createFood() {
    let squares = document.querySelectorAll(".grid div");
    let foodRandomPosition = Math.floor(Math.random() * squares.length);
    squares[foodRandomPosition].classList.add("apple");
}

//listen for user input and draw updated game board
function mainLoop() {
    let squares = document.querySelectorAll(".grid div");
    window.addEventListener('keydown', function(e) {
        var key = e.key;
        if (key == "ArrowUp" && direction != width) {
            direction = -width;
        } else if (key == "ArrowDown" && direction != -width) {
            direction = width;
        } else if (key == "ArrowLeft" && direction != 1) {
            direction = -1;
        } else if (key == "ArrowRight" && direction != -1) {
            direction = 1;
        }
    });
    var interval = setInterval(function() {
        updateGrid(interval, squares);
    }, game_speed);
}

//move the snake on the game board
function moveSnake(squares) {
    let tail = currentSnake.pop();
    squares[tail].classList.remove("snake");
    currentSnake.unshift(currentSnake[0] + direction);
    eatFood(squares, tail);
    squares[currentSnake[0]].classList.add("snake");
}

//check if snake hits walls or run into itself
function checkHit(squares) {
    if ((currentSnake[0] + direction < 0 && direction === -width) || 
        (currentSnake[0] + direction >= (width * width) && direction === width) ||
        (currentSnake[0] % width === width - 1 && direction === 1) ||
        (currentSnake[0] % width === 0 && direction === -1) ||
        (squares[currentSnake[0] + direction].classList.contains("snake"))) {
        return true;
    } else {
        return false;
    }
}

//draw updated grid
function updateGrid(interval, squares) {
    if (checkHit(squares)) {
        squares[currentSnake[0]].classList.add("snakeCollision");
        squares[currentSnake[0]].classList.remove("snake");
        document.getElementById("gameStatus").innerHTML = "Game Over";
        clearInterval(interval);
    } else {
        moveSnake(squares);
    }
}

//eat food and grow snake
function eatFood(squares, tail) {
    if (squares[currentSnake[0]].classList.contains("apple")) {
        squares[currentSnake[0]].classList.remove("apple");
        squares[tail].classList.add("snake");
        for (let i = 0; i < foodValue; ++i) {
            currentSnake.push(tail);
        }
        createFood();
        score += foodValue;
        showScore.innerHTML = "Score: " + score;
    }
}

