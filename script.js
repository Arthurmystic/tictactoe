const docQuery = (function () {
    const gameContainer = document.querySelector("#game-container");
    const cellDiv = document.querySelectorAll(".cell");
    const dialogBox = document.querySelector("[dialogBox]");
    const closeDialog = document.querySelector("#closeButton");
    const resultsDiv = document.querySelector("#results");
    const restartButton = document.querySelector("#restartButton");
    return { gameContainer, cellDiv, resultsDiv, dialogBox, closeDialog, restartButton };
}());

function createPlayer(name, marker) {
    return {
        name,
        marker,
        moves: [],
        playedCells: [],
    };
}

const gameController = (function () {
    const playerOne = createPlayer(prompt('Enter player 1 name')||'Player1', 'X');
    const playerTwo = createPlayer(prompt('Enter player 2 name')||'Player2', 'O');
    const { playedCells } = createPlayer(); // this is for learning 
    // — I don’t actually need `playedCells` to be part of `createPlayer`.
    // I could have simply declared `let playedCells = []` here in gameController
    // instead. I left it inside `createPlayer` just to demonstrate
    // how destructuring works when returning objects.

    let currentRound = 1
    const getCurrentRound = () => currentRound;
    const incrementRound = () => currentRound++;

    return { playerOne, playerTwo, getCurrentRound, incrementRound, playedCells }
}());

function getClickedCellData(e) {
    let clickedCell = e.target.dataset.val;
    // const clickedCell = () => userInput;
    // return {userInput}; this exposes userInput
    return { clickedCell }; // Return the selected cell as private data
}

function markClickedCell(marker, cellIndex) {
    const cellID = Number(cellIndex)
    docQuery.cellDiv[cellID - 1].textContent = marker
}

function processCellClick(e) {
    const { clickedCell } = getClickedCellData(e);
    if (gameController.playedCells.includes(clickedCell)) {
        alert('Cell already marked! Pick an empty one.');
        return; // this stops further execution of the remaining code in the function.
    }

    gameController.playedCells.push(clickedCell);

    const player = (gameController.getCurrentRound() % 2 == 1) ?
        gameController.playerOne :
        gameController.playerTwo; // Determines the current player based on the round number

    player.moves.push(clickedCell);
    markClickedCell(player.marker, clickedCell);
    const { declarationText, isGameOver } = checkWinner(player.name, player.moves);

    if (isGameOver) declareWinner(declarationText);
    gameController.incrementRound();
}

function getWinningCombinations() {
    return [
        [1, 2, 3], [4, 5, 6], [7, 8, 9],
        [1, 4, 7], [2, 5, 8], [3, 6, 9],
        [1, 5, 9], [3, 5, 7]
    ];
}

function declareWinner(winningText) {
    docQuery.resultsDiv.textContent = winningText;
    docQuery.dialogBox.show(); // Displays the 'Game Over' dialog
}

function checkWinner(playerName, playerMoves) {
    const moves = playerMoves.map(Number); // values in playerMoves are strings. this converts them to numbers
    const name = playerName.toUpperCase();
    let isGameOver = false;
    let declarationText;

    if (moves.length > 2) {
        for (const subArray of getWinningCombinations()) {
            if (subArray.every(num => moves.includes(num))) {
                console.log(` -- ${name} WINS -- `);
                isGameOver = true;
                declarationText = ` -- ${name} WINS -- `;
                break; // break out of the for-loop
            }
        }
    }

    if (!isGameOver && gameController.getCurrentRound() === 9) {
        console.log(` -- It's a DRAW -- `);
        isGameOver = true;
        declarationText = ` -- It's a DRAW -- `;
    }

    if (isGameOver) docQuery.gameContainer.removeEventListener('click', processCellClick);
    return { declarationText: declarationText || '', isGameOver }
}

docQuery.gameContainer.addEventListener("click", processCellClick);  // Adds event listener to the game container to handle cell clicks

docQuery.closeDialog.addEventListener("click", () => {
    docQuery.dialogBox.close() // Closes the game over dialog
});

docQuery.restartButton.addEventListener("click", function () {
    location.reload(); //Reloads page 
});