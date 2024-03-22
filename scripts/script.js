import Grid, { updateScore, resetCurrentScore } from "./Grid.js";
import Tile from "./Tile.js";

let initialX = null;
let initialY = null;
let viewportWidth = window.innerWidth;

console.log("Viewport width: " + viewportWidth);

const gameBoard = document.getElementById('gameBoard')
const newGame = document.getElementById('newGame')

newGame.addEventListener('click', restartGame)

const grid = new Grid(gameBoard)
// console.log(grid.randomEmptyCell())
grid.randomEmptyCell().tile = new Tile(gameBoard)
grid.randomEmptyCell().tile = new Tile(gameBoard)

if(viewportWidth < 650){
    setupInputMobile()
    // console.log("setupdoneMobile")
} else{
    setupInputWeb()
    // console.log("setupdoneWeb")
}



function setupInputWeb() {
    window.addEventListener("keydown", handleInputWeb, { once: true })
}

function setupInputMobile(){
    gameBoard.addEventListener("event", handleInputMobile, {once: true})
}
gameBoard.addEventListener("touchstart", handleTouchStart);
gameBoard.addEventListener("touchmove", handleTouchMove);
gameBoard.addEventListener("touchend", handleTouchEnd);


async function handleInputMobile(e) {
    switch (e.key) {
        case handleSwipeUp():
            if (!canMoveUp()) {
                setupInputMobile()
                return
            }
            await moveUp()
            break;
        case handleSwipeDown():
            if (!canMoveUp()) {
                setupInputMobile()
                return
            }
            await moveDown()
            break;
        case handleSwipeLeft():
            if (!canMoveUp()) {
                setupInputMobile()
                return
            }
            await moveLeft()
            break;
        case handleSwipeRight():
            if (!canMoveUp()) {
                setupInputMobile()
                return
            }
            await moveRight()
            break;
    
        default:
           setupInputMobile()
           return
    }

    grid.cells.forEach(cell => cell.mergeTiles())

    const newTile = new Tile(gameBoard)
    grid.randomEmptyCell().tile = newTile

    if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
        newTile.waitForTransition(true).then(() => {
            alert("You Lose")
        })
        return
    }
    setupInputMobile()
}

async function handleInputWeb(e) {
    // console.log(e.key)
    switch (e.key) {
        case "ArrowUp":
            if (!canMoveUp()) {
                setupInputWeb()
                return
            }
            await moveUp()
            break
        case "ArrowDown":
            if (!canMoveDown()) {
                setupInputWeb()
                return
            }
            await moveDown()
            break
        case "ArrowLeft":
            if (!canMoveLeft()) {
                setupInputWeb()
                return
            }
            await moveLeft()
            break
        case "ArrowRight":
            if (!canMoveRight()) {
                setupInputWeb()
                return
            }
            await moveRight()
            break
        default:
            setupInputWeb()
            return
    }

    // grid.cells.forEach(cell => cell.mergeTiles())
    grid.cells.forEach(cell => cell.mergeTiles())

    const newTile = new Tile(gameBoard)
    grid.randomEmptyCell().tile = newTile

    if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
        newTile.waitForTransition(true).then(() => {
            alert("You Lose")
        })
        return
    }
    setupInputWeb()
}

//Mobile
function handleTouchStart(e) {
    initialX = e.touches[0].clientX;
    initialY = e.touches[0].clientY;
}

function handleSwipeRight() {
    moveRight()
    console.log("Right swipe");
}
function handleSwipeLeft() {
    moveLeft()
    console.log("Left swipe");
}
function handleSwipeDown() {
    moveDown()
    console.log("Down swipe");
}
function handleSwipeUp() {
    moveUp()
    console.log("Up swipe");
}

function handleTouchMove(e) {
    if (!initialX || !initialY) {
        return;
    }

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;

    const deltaX = currentX - initialX;
    const deltaY = currentY - initialY;

    // Check if movement is predominantly horizontal or vertical
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal movement
        if (deltaX > 0) {
            handleSwipeRight();
        } else {
            handleSwipeLeft();
        }
    } else {
        // Vertical movement
        if (deltaY > 0) {
            handleSwipeDown();
        } else {
            handleSwipeUp();
        }
    }

    initialX = null;
    initialY = null;
}

function handleTouchEnd(e) {
    console.log("end");
}

//web
function moveUp() {
    slideTiles(grid.cellsByColumn)
}
function moveDown() {
    slideTiles(grid.cellsByColumn.map(column => [...column].reverse()))
}
function moveLeft() {
    slideTiles(grid.cellsByRow)
}
function moveRight() {
    slideTiles(grid.cellsByRow.map(row => [...row].reverse()))
}


function slideTiles(cells) {
    return Promise.all(
        cells.flatMap(group => {
            const promises = []
            for (let i = 1; i < group.length; i++) {
                const cell = group[i]
                if (cell.tile == null) continue
                let lastValidCell
                for (let j = i - 1; j >= 0; j--) {
                    const moveToCell = group[j]
                    if (!moveToCell.canAccept(cell.tile)) break
                    lastValidCell = moveToCell
                }

                if (lastValidCell != null) {
                    promises.push(cell.tile.waitForTransition())
                    if (lastValidCell.tile != null) {
                        lastValidCell.mergeTile = cell.tile
                    } else {
                        lastValidCell.tile = cell.tile
                    }
                    cell.tile = null
                }
            }
            return promises
        }))
}

function canMoveUp() {
    return canMove(grid.cellsByColumn)
}
function canMoveDown() {
    return canMove(grid.cellsByColumn.map(column => [...column].reverse()))
}
function canMoveLeft() {
    return canMove(grid.cellsByRow)
}
function canMoveRight() {
    return canMove(grid.cellsByRow.map(row => [...row].reverse()))
}

function canMove(cells) {
    return cells.some(group => {
        return group.some((cell, index) => {
            if (index === 0) return false
            if (cell.tile == null) return true
            const moveToCell = group[index - 1]
            return moveToCell.canAccept(cell.tile)
        })
    })
}


function restartGame() {
    // Clear the grid
    clearGrid();
    updateScore(0)
    resetCurrentScore();
    
    // Initialize a new game state
    grid.randomEmptyCell().tile = new Tile(gameBoard);
    grid.randomEmptyCell().tile = new Tile(gameBoard);

    // Re-setup the input listeners
    setupInputWeb();
}

function clearGrid() {
    for (const cell of grid.cells) {
        if (cell.tile ) {
            cell.tile.remove();
            cell.tile 
            cell.tile = null;
        }
    }
}