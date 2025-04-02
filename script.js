$(document).ready(function () {
    let gridSize = 10;
    let maxMoves = 20;
    let gameFinished = false;
    const colors = ['red','orange','yellow','lime','aqua','blue'];

    const colorButtonsContainer = document.getElementById('color-buttons');
    const movesCountElement = document.getElementById('move-count');
    movesCountElement.textContent = maxMoves;
    
    function createGrid(size) {
        const gameBoard = document.getElementById('game-board');
        gameBoard.innerHTML='';
        gameBoard.style.gridTemplate = `repeat(${size}, 1fr) / repeat(${size}, 1fr)`;
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = row;
                cell.dataset.col = col;
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                cell.style.backgroundColor = randomColor;
                gameBoard.appendChild(cell);
            }
        }
    }
    
    for (const color of colors) {
        const colorButton = document.createElement('button');
        colorButton.style.backgroundColor = color;
        colorButton.addEventListener('click', function () {
            if (!gameFinished) {
                const selectedColor = color;
                const originalCell = document.querySelector('.cell[data-row="0"][data-col="0"]');
                const originalColor = originalCell.style.backgroundColor;
                if (selectedColor !== originalColor) {
                    maxMoves--;
                    movesCountElement.textContent = maxMoves;
                    const visited = [];
                    originalCell.style.backgroundColor = selectedColor;
                    changeColorRecursive(originalCell, selectedColor, originalColor, visited);
                    if(maxMoves==0 && !isGameFinished()) {
                        gameFinished=true;
                        $("#modal-lose").dialog("open");
                    } else if (isGameFinished()) {
                        gameFinished=true;
                        $("#modal-win").dialog("open");
                    }
                }
            }
        });
        colorButtonsContainer.appendChild(colorButton);
    }

    function isGameFinished() {
        const allCells = document.querySelectorAll('.cell');
        for (const cell of allCells) {
            if (cell.style.backgroundColor !== allCells[0].style.backgroundColor) {
                return false;
            }
        }
        return true;
    }

    function changeColorRecursive(cell, selectedColor, originalColor, visited) {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        if (visited[row] && visited[row][col]) {
            return;
        }
        visited[row] = visited[row] || [];
        visited[row][col] = true;
        const neighbors = [
            { row: row, col: col + 1 },
            { row: row, col: col - 1 }, 
            { row: row + 1, col: col }, 
            { row: row - 1, col: col }  
        ];
        for (const neighbor of neighbors) {
            const neighborCell = document.querySelector(`.cell[data-row="${neighbor.row}"][data-col="${neighbor.col}"]`);
            if (neighborCell && neighborCell.style.backgroundColor === originalColor) {
                neighborCell.style.backgroundColor = selectedColor;
                changeColorRecursive(neighborCell, selectedColor, originalColor, visited);
            }
        }
    }

    document.getElementById('easy').addEventListener('click', function () {
        gridSize = 8;
        maxMoves = 20;
        gameFinished = false;
        movesCountElement.textContent = maxMoves;
        createGrid(8);
    });

    document.getElementById('medium').addEventListener('click', function () {
        gridSize = 10;
        maxMoves = 20;
        gameFinished = false;
        movesCountElement.textContent = maxMoves;
        createGrid(10);
    });

    document.getElementById('hard').addEventListener('click', function () {
        gridSize = 12;
        maxMoves = 20;
        gameFinished = false;
        movesCountElement.textContent = maxMoves;
        createGrid(12);
    });

    $("#modal-win").dialog({
        autoOpen: false,
        modal: true,
        buttons: {
          "Попробовать снова!": function () {
            maxMoves = 20;
            gameFinished = false;
            movesCountElement.textContent = maxMoves;
            createGrid(gridSize);
            $(this).dialog("close");
          }
        }
    });

    $("#modal-lose").dialog({
        autoOpen: false,
        modal: true,
        buttons: {
          "Попробовать снова!": function () {
            maxMoves = 20;
            gameFinished = false;
            movesCountElement.textContent = maxMoves;
            createGrid(gridSize);
            $(this).dialog("close");
          }
        }
    });

    createGrid(gridSize);
});