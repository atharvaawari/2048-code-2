import Grid, { updateScore, resetCurrentScore, updateHighscore } from "./Grid.js";
import Tile from "./Tile.js";

let initialX = null;
let initialY = null;
// console.log("Viewport width: " + viewportWidth);
let viewportWidth = window.innerWidth;

const gameBoard = document.getElementById('gameBoard')
const newGame = document.getElementById('newGame')
const startGame = document.getElementById('startGame')
const headBox = document.getElementById('headBox')
const backBtn = document.getElementById('back-btn')

const grid = new Grid(gameBoard)

function loadGame() {
    restartGame()
    handleFullScreen()
    updateScore(0)
    updateHighscore(0)
    startGame.style.display = "none";
    gameBoard.style.display = "grid";
    headBox.style.display = "flex";
    backBtn.style.display = "block";
}

function backToStartgame() {
    startGame.style.display = "block";
    gameBoard.style.display = "none";
    headBox.style.display = "none";
    backBtn.style.display = "none";
    // clearGrid();
}

backBtn.addEventListener('click', function(e){
    backToStartgame()
})
// function goTomainMenu() {
//     let initialX = 0,
//         initialY = 0;
//     let moveElement = false;

//     //Events Object
//     let events = {
//         mouse: {
//             down: "mousedown",
//             move: "mousemove",
//             up: "mouseup",
//         },
//         touch: {
//             down: "touchstart",
//             move: "touchmove",
//             up: "touchend",
//         },
//     };

//     let deviceType = "";

//     //Detech touch device
//     const isTouchDevice = () => {
//         try {
//             //We try to create TouchEvent (it would fail for desktops and throw error)
//             document.createEvent("TouchEvent");
//             deviceType = "touch";
//             return true;
//         } catch (e) {
//             deviceType = "mouse";
//             return false;
//         }
//     };
//     isTouchDevice();

//     //Start (mouse down / touch start)
//     backBtn.addEventListener(events[deviceType].down, (e) => {
//         e.preventDefault();
//         //initial x and y points
//         initialX = !isTouchDevice() ? e.clientX : e.touches[0].clientX;
//         initialY = !isTouchDevice() ? e.clientY : e.touches[0].clientY;

//         //Start movement
//         moveElement = true;
//     });

//     //Move
//     backBtn.addEventListener(events[deviceType].move, (e) => {
//         //if movement == true then set top and left to new X andY while removing any offset
//         if (moveElement) {
//             e.preventDefault();
//             let newX = !isTouchDevice() ? e.clientX : e.touches[0].clientX;
//             let newY = !isTouchDevice() ? e.clientY : e.touches[0].clientY;
//             backBtn.style.top =
//                 backBtn.offsetTop - (initialY - newY) + "px";
//             backBtn.style.left =
//                 backBtn.offsetLeft - (initialX - newX) + "px";
//             initialX = newX;
//             initialY = newY;
//         }
//     });
//     const stopMovement = function(e){
//         moveElement = false;
//        }
//     //mouse up / touch end
//     backBtn.addEventListener( 
//         events[deviceType].up, stopMovement()
//     );

//     backBtn.addEventListener("mouseleave", stopMovement);
//     backBtn.addEventListener(events[deviceType].up, (e) => {
//         moveElement = false;
//     });
// }

// goTomainMenu()

function handleFullScreen() {

    if (viewportWidth >= 1024) {
        // console.log("It is an desktop user")
        // return
    }
    let fullScreen = document.documentElement; // To make the whole page fullscreen; adjust as needed

    if (fullScreen.requestFullscreen) {
        fullScreen.requestFullscreen();
    } else if (fullScreen.mozRequestFullScreen) { /* Firefox */
        fullScreen.mozRequestFullScreen();
    } else if (fullScreen.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        fullScreen.webkitRequestFullscreen();
    } else if (fullScreen.msRequestFullscreen) { /* IE/Edge */
        fullScreen.msRequestFullscreen();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    startGame.addEventListener('click', loadGame)

});

document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
        console.log("User is not available")
        backToStartgame()
    }
})

function restartGame() {
    // Clear the grid
    clearGrid();
    updateScore(0)
    resetCurrentScore();

    // Initialize a new game state
    grid.randomEmptyCell().tile = new Tile(gameBoard);
    grid.randomEmptyCell().tile = new Tile(gameBoard);

    // Re-setup the input listeners
    onSubmitGame()
    setupInputWeb();
    setupInputMobile();
}

function clearGrid() {
    for (const cell of grid.cells) {
        if (cell.tile) {
            cell.tile.remove();
            cell.tile
            cell.tile = null;
        }
    }
}

function setupInputWeb() {
    window.addEventListener("keydown", handleInputWeb, { once: true })
}

//Web EventListner
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

///mobile eventListner
function setupInputMobile() {
    gameBoard.addEventListener("touchstart", handleTouchStart, { passive: true }, { once: true });
}

function handleTouchStart(e) {
    gameBoard.addEventListener("touchmove", handleTouchMove, { passive: true }, { once: true });
    // gameBoard.addEventListener("touchend", handleTouchEnd, { passive: true }, { once: true });

    initialX = e.touches[0].clientX;
    initialY = e.touches[0].clientY;
}
//mobile
async function handleSwipeRight() {
    if (!canMoveRight()) {
        setupInputMobile()
        return
    }
    await moveRight()
    // console.log("Right swipe");
}
async function handleSwipeLeft() {
    if (!canMoveLeft()) {
        setupInputMobile()
        return
    }
    await moveLeft()
    // console.log("Left swipe");
}
async function handleSwipeDown() {
    if (!canMoveDown()) {
        setupInputMobile()
        return
    }
    await moveDown()
    // console.log("Down swipe");
}
async function handleSwipeUp() {
    if (!canMoveUp()) {
        setupInputMobile()
        return
    }
    await moveUp()
    // console.log("Up swipe");
}
//mobile
async function handleTouchMove(e) {
    setupInputMobile()
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
            await handleSwipeRight();
        } else {
            await handleSwipeLeft();
        }
    } else {
        // Vertical movement
        if (deltaY > 0) {
            await handleSwipeDown();
        } else {
            await handleSwipeUp();
        }
    }

    initialX = null;
    initialY = null;

    await grid.cells.forEach(cell => cell.mergeTiles())

    if (grid.cells.some(cell => cell.tile === null)) {
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

}

// function handleTouchEnd(e) {
//     // console.log("end");
// }

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

//Slide Function 
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

//canMove then only take movement
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

newGame.addEventListener('click', restartGame)

const onSubmitGame = () => {
    let options = {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            name: 'user1',
            score: updateHighscore(),
            userId: 1,
        }),
    }
    fetch('https://jsonplaceholder.typicode.com/posts', options)
        .then((response) => response.json())
        .then((json) => console.log(json));
}

