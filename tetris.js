const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = canvas.width / COLS;

let board = Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
let score = 0;
let gameRunning = true;

// Tetromino pieces
const pieces = [
    [[1, 1, 1, 1]], // I
    [[1, 1], [1, 1]], // O
    [[0, 1, 1], [1, 1, 0]], // S
    [[1, 1, 0], [0, 1, 1]], // Z
    [[1, 0, 0], [1, 1, 1]], // J
    [[0, 0, 1], [1, 1, 1]], // L
    [[0, 1, 0], [1, 1, 1]] // T
];

let currentPiece = { shape: pieces[Math.floor(Math.random() * pieces.length)], x: 3, y: 0 };

function drawBoard() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (board[r][c]) {
                ctx.fillStyle = '#0f0';
                ctx.fillRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
            }
        }
    }
}

function drawPiece() {
    ctx.fillStyle = '#f00';
    currentPiece.shape.forEach((row, r) => {
        row.forEach((val, c) => {
            if (val) {
                ctx.fillRect((currentPiece.x + c) * BLOCK_SIZE, (currentPiece.y + r) * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
            }
        });
    });
}

function canMove(x, y, shape) {
    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c]) {
                const newX = x + c;
                const newY = y + r;
                if (newX < 0 || newX >= COLS || newY >= ROWS || (newY >= 0 && board[newY][newX])) {
                    return false;
                }
            }
        }
    }
    return true;
}

function lockPiece() {
    currentPiece.shape.forEach((row, r) => {
        row.forEach((val, c) => {
            if (val && currentPiece.y + r >= 0) {
                board[currentPiece.y + r][currentPiece.x + c] = 1;
            }
        });
    });
    clearLines();
    currentPiece = { shape: pieces[Math.floor(Math.random() * pieces.length)], x: 3, y: 0 };
    if (!canMove(currentPiece.x, currentPiece.y, currentPiece.shape)) {
        gameRunning = false;
    }
}

function clearLines() {
    for (let r = ROWS - 1; r >= 0; r--) {
        if (board[r].every(val => val)) {
            board.splice(r, 1);
            board.unshift(Array(COLS).fill(0));
            score += 10;
            r++;
        }
    }
}

function rotate(shape) {
    return shape[0].map((_, i) => shape.map(row => row[i]).reverse());
}

function update() {
    if (!gameRunning) return;

    if (canMove(currentPiece.x, currentPiece.y + 1, currentPiece.shape)) {
        currentPiece.y++;
    } else {
        lockPiece();
    }
}

function draw() {
    drawBoard();
    drawPiece();
}

document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    
    if (e.key === 'ArrowLeft' && canMove(currentPiece.x - 1, currentPiece.y, currentPiece.shape)) {
        currentPiece.x--;
    } else if (e.key === 'ArrowRight' && canMove(currentPiece.x + 1, currentPiece.y, currentPiece.shape)) {
        currentPiece.x++;
    } else if (e.key === 'ArrowDown' && canMove(currentPiece.x, currentPiece.y + 1, currentPiece.shape)) {
        currentPiece.y++;
    } else if (e.key === 'q' || e.key === 'Q') {
        const rotated = rotate(currentPiece.shape);
        if (canMove(currentPiece.x, currentPiece.y, rotated)) {
            currentPiece.shape = rotated;
        }
    } else if (e.key === 'w' || e.key === 'W') {
        const rotated = rotate(rotate(rotate(currentPiece.shape)));
        if (canMove(currentPiece.x, currentPiece.y, rotated)) {
            currentPiece.shape = rotated;
        }
    }
});

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}