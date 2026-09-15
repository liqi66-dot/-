const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const startButton = document.getElementById("startButton");

const gridSize = 20;

// 蛇
let snake = [
    { x: 200, y: 200 },
    { x: 180, y: 200 },
    { x: 160, y: 200 }
];

// 食物
let food = {
    x: 100,
    y: 100
};

// 方向
let direction = "right";

// 分数
let score = 0;

// 游戏状态
let gameRunning = false;

// 游戏计时器
let gameTimer;


// ====================
// 画蛇
// ====================
function drawSnake() {

    snake.forEach((part, index) => {

        if (index === 0) {
            ctx.fillStyle = "#4CAF50";
        } else {
            ctx.fillStyle = "#81C784";
        }

        ctx.fillRect(
            part.x,
            part.y,
            gridSize,
            gridSize
        );
    });
}


// ====================
// 画食物
// ====================
function drawFood() {

    ctx.fillStyle = "#ff5252";

    ctx.fillRect(
        food.x,
        food.y,
        gridSize,
        gridSize
    );
}


// ====================
// 生成食物
// ====================
function generateFood() {

    const maxPosition =
        canvas.width / gridSize;

    food.x =
        Math.floor(Math.random() * maxPosition)
        * gridSize;

    food.y =
        Math.floor(Math.random() * maxPosition)
        * gridSize;
}


// ====================
// 检查撞墙
// ====================
function checkWallCollision(head) {

    return (
        head.x < 0 ||
        head.x >= canvas.width ||
        head.y < 0 ||
        head.y >= canvas.height
    );
}


// ====================
// 检查撞到自己
// ====================
function checkSelfCollision(head) {

    for (let i = 1; i < snake.length; i++) {

        if (
            head.x === snake[i].x &&
            head.y === snake[i].y
        ) {
            return true;
        }
    }

    return false;
}


// ====================
// 移动蛇
// ====================
function moveSnake() {

    const head = {
        x: snake[0].x,
        y: snake[0].y
    };

    if (direction === "up") {
        head.y -= gridSize;
    }

    if (direction === "down") {
        head.y += gridSize;
    }

    if (direction === "left") {
        head.x -= gridSize;
    }

    if (direction === "right") {
        head.x += gridSize;
    }


    // ====================
    // 检查撞墙
    // ====================

    if (checkWallCollision(head)) {
        gameOver();
        return;
    }


    // ====================
    // 检查撞自己
    // ====================

    if (checkSelfCollision(head)) {
        gameOver();
        return;
    }


    // 新蛇头
    snake.unshift(head);


    // ====================
    // 检查吃食物
    // ====================

    if (
        head.x === food.x &&
        head.y === food.y
    ) {

        score++;

        scoreElement.textContent = score;

        generateFood();

    } else {

        snake.pop();

    }
}


// ====================
// 游戏画面
// ====================
function drawGame() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawSnake();
    drawFood();
}


// ====================
// Game Over
// ====================
function gameOver() {

    gameRunning = false;

    clearInterval(gameTimer);

    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.fillStyle = "white";

    ctx.font = "40px Arial";

    ctx.textAlign = "center";

    ctx.fillText(
        "Game Over",
        canvas.width / 2,
        canvas.height / 2
    );

    ctx.font = "20px Arial";

    ctx.fillText(
        "Score: " + score,
        canvas.width / 2,
        canvas.height / 2 + 40
    );

    startButton.textContent = "Restart";
}


// ====================
// 游戏循环
// ====================
function gameLoop() {

    if (!gameRunning) {
        return;
    }

    moveSnake();

    if (gameRunning) {
        drawGame();
    }
}


// ====================
// 键盘控制
// ====================
document.addEventListener("keydown", function(event) {

    if (
        event.key === "ArrowUp" &&
        direction !== "down"
    ) {
        direction = "up";
    }

    if (
        event.key === "ArrowDown" &&
        direction !== "up"
    ) {
        direction = "down";
    }

    if (
        event.key === "ArrowLeft" &&
        direction !== "right"
    ) {
        direction = "left";
    }

    if (
        event.key === "ArrowRight" &&
        direction !== "left"
    ) {
        direction = "right";
    }
});


// ====================
// 开始 / 重新开始
// ====================
startButton.addEventListener("click", function() {

    // 如果正在游戏，就不要重复开始
    if (gameRunning) {
        return;
    }

    // 重置蛇
    snake = [
        { x: 200, y: 200 },
        { x: 180, y: 200 },
        { x: 160, y: 200 }
    ];

    // 重置方向
    direction = "right";

    // 重置分数
    score = 0;

    scoreElement.textContent = score;

    // 重新生成食物
    generateFood();

    // 开始游戏
    gameRunning = true;

    startButton.textContent = "Restart";

    // 游戏速度
    gameTimer = setInterval(gameLoop, 150);

    drawGame();
});


// 第一次显示
drawGame();

// ====================
// 手机滑动控制
// ====================

let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener("touchstart", function(event) {

    const touch = event.touches[0];

    touchStartX = touch.clientX;
    touchStartY = touch.clientY;

}, { passive: true });


canvas.addEventListener("touchend", function(event) {

    const touch = event.changedTouches[0];

    const touchEndX = touch.clientX;
    const touchEndY = touch.clientY;

    const differenceX = touchEndX - touchStartX;
    const differenceY = touchEndY - touchStartY;

    // 防止轻轻碰一下就改变方向
    const minimumSwipe = 30;

    // 横向滑动比较明显
    if (Math.abs(differenceX) > Math.abs(differenceY)) {

        if (Math.abs(differenceX) < minimumSwipe) {
            return;
        }

        if (
            differenceX > 0 &&
            direction !== "left"
        ) {
            direction = "right";
        }

        if (
            differenceX < 0 &&
            direction !== "right"
        ) {
            direction = "left";
        }

    } 
    
    // 纵向滑动比较明显
    else {

        if (Math.abs(differenceY) < minimumSwipe) {
            return;
        }

        if (
            differenceY > 0 &&
            direction !== "up"
        ) {
            direction = "down";
        }

        if (
            differenceY < 0 &&
            direction !== "down"
        ) {
            direction = "up";
        }
    }

}, { passive: true });