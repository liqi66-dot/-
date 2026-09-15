const board = document.getElementById("game-board");
const restartButton = document.getElementById("restart");
const scoreDisplay = document.getElementById("score");
const bestScoreDisplay = document.getElementById("best-score");

let bestScore = Number(localStorage.getItem("bestScore")) || 0;
const gameMessage = document.getElementById("game-message");
const messageTitle = document.getElementById("message-title");
const messageText = document.getElementById("message-text");
const messageRestart = document.getElementById("message-restart");

let gameOver = false;
let hasWon = false;

let grid = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];

let score = 0;


// ====================
// 显示棋盘
// ====================

function createBoard() {

    board.innerHTML = "";

    for (let row = 0; row < 4; row++) {

        for (let col = 0; col < 4; col++) {

            const tile = document.createElement("div");

            tile.classList.add("tile");

            if (grid[row][col] !== 0) {

    const value = grid[row][col];

    tile.textContent = value;
    tile.classList.add("tile-" + value);

}

            board.appendChild(tile);
        }
    }

    scoreDisplay.textContent = score;
    bestScoreDisplay.textContent = bestScore;
}


// ====================
// 随机生成数字
// ====================

function addRandomTile() {

    const emptyTiles = [];

    for (let row = 0; row < 4; row++) {

        for (let col = 0; col < 4; col++) {

            if (grid[row][col] === 0) {

                emptyTiles.push({
                    row: row,
                    col: col
                });

            }
        }
    }

    if (emptyTiles.length === 0) {
        return;
    }

    const randomTile =
        emptyTiles[Math.floor(Math.random() * emptyTiles.length)];

    grid[randomTile.row][randomTile.col] =
        Math.random() < 0.9 ? 2 : 4;
}


// ====================
// 处理一行数字
// ====================

function processLine(line) {

    // 删除空格
    let numbers = line.filter(value => value !== 0);

    let result = [];
    let gainedScore = 0;

    for (let i = 0; i < numbers.length; i++) {

        if (numbers[i] === numbers[i + 1]) {

            const merged = numbers[i] * 2;

            result.push(merged);

            gainedScore += merged;

            i++;

        } else {

            result.push(numbers[i]);
        }
    }

    while (result.length < 4) {
        result.push(0);
    }

    return {
        line: result,
        score: gainedScore
    };
}


// ====================
// 检查棋盘是否改变
// ====================

function gridsEqual(oldGrid, newGrid) {

    for (let row = 0; row < 4; row++) {

        for (let col = 0; col < 4; col++) {

            if (oldGrid[row][col] !== newGrid[row][col]) {
                return false;
            }

        }
    }

    return true;
}


// ====================
// 向左
// ====================

function moveLeft() {

    const oldGrid = grid.map(row => [...row]);

    for (let row = 0; row < 4; row++) {

        const result = processLine(grid[row]);

        grid[row] = result.line;

        score += result.score;
    }

    finishMove(oldGrid);
}


// ====================
// 向右
// ====================

function moveRight() {

    const oldGrid = grid.map(row => [...row]);

    for (let row = 0; row < 4; row++) {

        const reversed = [...grid[row]].reverse();

        const result = processLine(reversed);

        grid[row] = result.line.reverse();

        score += result.score;
    }

    finishMove(oldGrid);
}


// ====================
// 向上
// ====================

function moveUp() {

    const oldGrid = grid.map(row => [...row]);

    for (let col = 0; col < 4; col++) {

        let column = [];

        for (let row = 0; row < 4; row++) {
            column.push(grid[row][col]);
        }

        const result = processLine(column);

        for (let row = 0; row < 4; row++) {
            grid[row][col] = result.line[row];
        }

        score += result.score;
    }

    finishMove(oldGrid);
}


// ====================
// 向下
// ====================

function moveDown() {

    const oldGrid = grid.map(row => [...row]);

    for (let col = 0; col < 4; col++) {

        let column = [];

        for (let row = 0; row < 4; row++) {
            column.push(grid[row][col]);
        }

        column.reverse();

        const result = processLine(column);

        result.line.reverse();

        for (let row = 0; row < 4; row++) {
            grid[row][col] = result.line[row];
        }

        score += result.score;
    }

    finishMove(oldGrid);
}


// ====================
// 完成一次移动
// ====================

function finishMove(oldGrid) {

    const changed = !gridsEqual(oldGrid, grid);

    if (!changed) {
        return;
    }

    if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("bestScore", bestScore);
}

    addRandomTile();

    createBoard();

    // 检查是否达到 2048
    if (!hasWon && checkWin()) {

        hasWon = true;

        showMessage(
            "YOU WIN!",
            "🎉 你成功达到 2048！"
        );

        return;
    }

    // 检查游戏是否结束
    if (!canMove()) {

        gameOver = true;

        showMessage(
            "GAME OVER",
            "没有可以移动的方块了！"
        );
    }
}

// ====================
// 键盘控制
// ====================

document.addEventListener("keydown", function(event) {

    if (event.key === "ArrowLeft") {

        event.preventDefault();
        moveLeft();

    }

    if (event.key === "ArrowRight") {

        event.preventDefault();
        moveRight();

    }

    if (event.key === "ArrowUp") {

        event.preventDefault();
        moveUp();

    }

    if (event.key === "ArrowDown") {

        event.preventDefault();
        moveDown();

    }

});


// ====================
// 开始游戏
// ====================

function startGame() {

    gameOver = false;
    hasWon = false;

    hideMessage();

    grid = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    score = 0;

    addRandomTile();
    addRandomTile();

    createBoard();
}

restartButton.addEventListener("click", startGame);

startGame();

// ====================
// 手机滑动控制
// ====================

let touchStartX = 0;
let touchStartY = 0;

board.addEventListener("touchstart", function(event) {

    const touch = event.touches[0];

    touchStartX = touch.clientX;
    touchStartY = touch.clientY;

}, { passive: true });


board.addEventListener("touchend", function(event) {

    const touch = event.changedTouches[0];

    const touchEndX = touch.clientX;
    const touchEndY = touch.clientY;

    const differenceX = touchEndX - touchStartX;
    const differenceY = touchEndY - touchStartY;

    const minimumSwipe = 30;

    // 如果滑动距离太短，就不做任何事情
    if (
        Math.abs(differenceX) < minimumSwipe &&
        Math.abs(differenceY) < minimumSwipe
    ) {
        return;
    }

    // 横向滑动
    if (Math.abs(differenceX) > Math.abs(differenceY)) {

        if (differenceX > 0) {
            moveRight();
        } else {
            moveLeft();
        }

    }

    // 纵向滑动
    else {

        if (differenceY > 0) {
            moveDown();
        } else {
            moveUp();
        }

    }

}, { passive: true });

// ====================
// 检查是否达到 2048
// ====================

function checkWin() {

    for (let row = 0; row < 4; row++) {

        for (let col = 0; col < 4; col++) {

            if (grid[row][col] === 2048) {
                return true;
            }

        }
    }

    return false;
}


// ====================
// 检查是否还能移动
// ====================

function canMove() {

    // 还有空格
    for (let row = 0; row < 4; row++) {

        for (let col = 0; col < 4; col++) {

            if (grid[row][col] === 0) {
                return true;
            }

        }
    }

    // 检查横向是否还有相同数字
    for (let row = 0; row < 4; row++) {

        for (let col = 0; col < 3; col++) {

            if (grid[row][col] === grid[row][col + 1]) {
                return true;
            }

        }
    }

    // 检查纵向是否还有相同数字
    for (let row = 0; row < 3; row++) {

        for (let col = 0; col < 4; col++) {

            if (grid[row][col] === grid[row + 1][col]) {
                return true;
            }

        }
    }

    return false;
}


// ====================
// 显示消息
// ====================

function showMessage(title, text) {

    messageTitle.textContent = title;
    messageText.textContent = text;

    gameMessage.classList.remove("hidden");
}


// ====================
// 隐藏消息
// ====================

function hideMessage() {

    gameMessage.classList.add("hidden");
}


// ====================
// 重新开始
// ====================

messageRestart.addEventListener("click", function() {

    hideMessage();

    startGame();

});