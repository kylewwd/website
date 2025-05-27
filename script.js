// JavaScript for interactivity will go here
document.addEventListener('DOMContentLoaded', () => {
    const boxes = document.querySelectorAll('.box');
    boxes.forEach(box => {
        box.addEventListener('animationend', function handleAnimationEnd(event) {
            if (event.target === this) {
                this.classList.add('animation-completed');
                // Remove listener to prevent it from firing again for this specific event
                this.removeEventListener('animationend', handleAnimationEnd);
            }
        });
    });

    const golWidget = document.getElementById('gol-widget');
    if (golWidget) {
        const gridContainer = document.getElementById('gol-grid-container');
        const nextGenBtn = document.getElementById('gol-next-gen-btn');
        const resetBtn = document.getElementById('gol-reset-btn');

        const numRows = 20;
        const numCols = 19;
        let grid = createGrid(numRows, numCols, true);
        let isMouseDown = false;

        function createGrid(rows, cols, addGlider = false) {
            let arr = new Array(rows);
            for (let i = 0; i < rows; i++) {
                arr[i] = new Array(cols).fill(0);
            }
            if (addGlider) {
                if (rows >= 5 && cols >= 5) {
                    const midRow = Math.floor(rows / 2) -1;
                    const midCol = Math.floor(cols / 2) -1;
                    
                    arr[midRow -1][midCol] = 1;
                    arr[midRow][midCol + 1] = 1;
                    arr[midRow + 1][midCol -1] = 1;
                    arr[midRow + 1][midCol] = 1;
                    arr[midRow + 1][midCol + 1] = 1;
                }
            }
            return arr;
        }

        function renderGrid() {
            gridContainer.innerHTML = '';
            gridContainer.style.setProperty('--gol-cols', numCols);

            for (let i = 0; i < numRows; i++) {
                for (let j = 0; j < numCols; j++) {
                    const cell = document.createElement('div');
                    cell.classList.add('gol-cell');
                    if (grid[i][j] === 1) {
                        cell.classList.add('alive');
                    }
                    cell.dataset.row = i;
                    cell.dataset.col = j;

                    cell.addEventListener('click', () => toggleCell(i, j));
                    cell.addEventListener('mousedown', () => isMouseDown = true);
                    cell.addEventListener('mouseup', () => isMouseDown = false);
                    cell.addEventListener('mousemove', () => {
                        if(isMouseDown) {
                           if(grid[i][j] === 0) toggleCell(i,j);
                        }
                    });
                    gridContainer.appendChild(cell);
                }
            }
        }
        
        gridContainer.addEventListener('mouseleave', () => isMouseDown = false);

        function toggleCell(row, col) {
            grid[row][col] = grid[row][col] === 1 ? 0 : 1;
            const cellElement = gridContainer.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            if (cellElement) {
                if (grid[row][col] === 1) cellElement.classList.add('alive');
                else cellElement.classList.remove('alive');
            } else {
                 renderGrid(); 
            }
        }

        function calculateNextGeneration() {
            let nextGrid = createGrid(numRows, numCols);
            for (let i = 0; i < numRows; i++) {
                for (let j = 0; j < numCols; j++) {
                    const aliveNeighbors = countAliveNeighbors(i, j);
                    if (grid[i][j] === 1) {
                        if (aliveNeighbors < 2 || aliveNeighbors > 3) {
                            nextGrid[i][j] = 0;
                        } else {
                            nextGrid[i][j] = 1;
                        }
                    } else {
                        if (aliveNeighbors === 3) {
                            nextGrid[i][j] = 1;
                        } else {
                            nextGrid[i][j] = 0;
                        }
                    }
                }
            }
            grid = nextGrid;
            renderGrid();
        }

        function countAliveNeighbors(row, col) {
            let count = 0;
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (i === 0 && j === 0) continue;
                    const r = row + i;
                    const c = col + j;
                    if (r >= 0 && r < numRows && c >= 0 && c < numCols && grid[r][c] === 1) {
                        count++;
                    }
                }
            }
            return count;
        }

        nextGenBtn.addEventListener('click', calculateNextGeneration);
        resetBtn.addEventListener('click', () => {
            grid = createGrid(numRows, numCols, true);
            renderGrid();
        });

        window.addEventListener('resize', () => {
            if (document.getElementById('gol-widget')) {
                 renderGrid();
            }
        });
        renderGrid();
    }
}); 