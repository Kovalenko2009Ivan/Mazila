const board = document.getElementById('board');
const resultDiv = document.getElementById('result');
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];

function handleClick(index) {
    if (gameBoard[index] === '' && !checkWinner()) {
        gameBoard[index] = currentPlayer;
        renderBoard();

        if (checkWinner()) {
            displayResult(`Гравець ${currentPlayer} виграв!`);
        } else if (!gameBoard.includes('')) {
            displayResult('Нічия! Зіграйте ще раз');
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            if (currentPlayer === 'O') {
                setTimeout(botMove, 500);
            }
        }
    }
}

function botMove() {
    if (!checkWinner() && gameBoard.includes('')) {
        let bestMove;

        const random = Math.random();
        if (random < 0.6) {
            bestMove = findWinningMove();
        } else {
            bestMove = findBlockingMove();
        }

        gameBoard[bestMove] = 'O';
        renderBoard();

        if (checkWinner()) {
            displayResult('Бот виграв!');
        } else if (!gameBoard.includes('')) {
            displayResult('Нічия! Зіграйте ще раз');
        } else {
            currentPlayer = 'X';
        }
    }
}

function findWinningMove() {
    const availableMoves = getAvailableMoves();
    for (const move of availableMoves) {
        gameBoard[move] = 'O';
        if (checkWinner()) {
            gameBoard[move] = '';
            return move;
        }
        gameBoard[move] = '';
    }
    return getRandomMove();
}

function findBlockingMove() {
    const availableMoves = getAvailableMoves();
    for (const move of availableMoves) {
        gameBoard[move] = 'X';
        if (checkWinner()) {
            gameBoard[move] = '';
            return move;
        }
        gameBoard[move] = '';
    }
    return getRandomMove();
}

function getAvailableMoves() {
    return gameBoard.reduce((acc, value, index) => {
        if (value === '') {
            acc.push(index);
        }
        return acc;
    }, []);
}

function getRandomMove() {
    const availableMoves = getAvailableMoves();
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]              // Diagonals
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            return true;
        }
    }

    return false;
}

function renderBoard() {
    board.innerHTML = '';
    gameBoard.forEach((value, index) => {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.textContent = value;
        cell.addEventListener('click', () => handleClick(index));
        board.appendChild(cell);
    });
}

function displayResult(message) {
    let finalMessage = '';

    if (message.includes('Бот')) {
        finalMessage = 'Ботяра сьогодні сильніше тебе';
    } else if (message.includes('Гравець')) {
        finalMessage = 'Гравець сьогодні їсть';
    } else {
        finalMessage = 'Ну ви й криворукі';
    }

    resultDiv.textContent = finalMessage;
    displayPlayAgainButton();
}

function displayPlayAgainButton() {
    const playAgainButton = document.createElement('button');
    playAgainButton.textContent = 'Грати ще раз';
    playAgainButton.addEventListener('click', resetGame);
    resultDiv.appendChild(playAgainButton);
}

function resetGame() {
    resultDiv.textContent = '';
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    renderBoard();
}

renderBoard();