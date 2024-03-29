// --grid-size: 4;
// --cell-size: 20vmin;
// --cell-gap: 2vmin;

const GRID_SIZE = 4;
let CELL_SIZE = 12;
const CELL_GAP = 2;


const scoreBox = document.getElementById('scoreBox')
const highBox = document.getElementById('highBox')
let currentScore = 0
let highScore = 0

export default class Grid {
    #cells

    constructor(gridElement) {
        gridElement.style.setProperty("--grid-size", GRID_SIZE)
        gridElement.style.setProperty("--cell-size", `${CELL_SIZE}vmin`)
        gridElement.style.setProperty("--cell-gap", `${CELL_GAP}vmin`)
        this.#cells = createCellElement(gridElement).map((cellElement, index) => {
            return new Cell(
                cellElement,
                index % GRID_SIZE,
                Math.floor(index / GRID_SIZE)
            )
        })
        // console.log(this.cells)
    }

    get cells() {
        return this.#cells
    }

    get cellsByRow() {
        return this.#cells.reduce((cellGrid, cell) => {
            cellGrid[cell.y] = cellGrid[cell.y] || []
            cellGrid[cell.y][cell.x] = cell
            return cellGrid
        }, [])
    }

    get cellsByColumn() {
        return this.#cells.reduce((cellGrid, cell) => {
            cellGrid[cell.x] = cellGrid[cell.x] || []
            cellGrid[cell.x][cell.y] = cell
            return cellGrid
        }, [])
    }

    get #emptyCells() {
        // console.log(this.#cells)
        return this.#cells.filter(cell => cell.tile == null)
    }

    randomEmptyCell() {
        const randomIndex = Math.floor(Math.random() * this.#emptyCells.length)
        return this.#emptyCells[randomIndex]
    }
}

export class Cell {
    #cellElement
    #x
    #y
    #tile
    #mergeTile

    constructor(cellElement, x, y) {
        this.#cellElement = cellElement
        this.#x = x
        this.#y = y
    }

    get x() {
        return this.#x
    }
    get y() {
        return this.#y
    }

    get tile() {
        return this.#tile
    }
    set tile(value) {
        this.#tile = value
        if (value == null) return
        this.#tile.x = this.#x
        this.#tile.y = this.#y
    }

    get mergeTile() {
        return this.#mergeTile
    }

    set mergeTile(value) {
        this.#mergeTile = value
        if (value == null) return
        this.#mergeTile.x = this.#x
        this.#mergeTile.y = this.#y
        // console.log(this.#mergeTile)
    }

    canAccept(tile) {
        return (
            this.tile == null ||
            (this.mergeTile == null && this.tile.value === tile.value)
        )
    }

    mergeTiles() {
        if (this.tile == null || this.mergeTile == null) return
        this.tile.value = this.tile.value + this.mergeTile.value
        // console.log(this.tile.value)
        this.mergeTile.remove()
        this.mergeTile = null
        currentScore += this.tile.value
        
        if (this.tile.value) {
            let addition = document.createElement("div");
            addition.classList.add(".score-addition");
            addition.textContent = "+" + this.tile.value;
            scoreBox.appendChild(addition);
            console.log(addition.textContent = "+" + this.tile.value)
        }
        
        updateScore(currentScore, this.tile.value)
        updateHighscore(highScore)
        return currentScore
    }
}

function createCellElement(gridElement) {
    const cells = []
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        const cell = document.createElement("div")
        cell.classList.add("cell")
        cells.push(cell)
        gridElement.append(cell)
    }
    return cells
}

function updateScore(currentScore) {
    scoreBox.innerHTML = `<h3>Score<br/>${currentScore}</h3>`
    return currentScore
}

function updateHighscore() {
    if (currentScore >= highScore) {
        highScore = currentScore
    }
    highBox.innerHTML = `<h3>Best<br/>${highScore}</h3>`
    return highScore
}

function resetCurrentScore(){
    currentScore =0;
    updateScore(currentScore, 0)
}

export { updateScore, resetCurrentScore, updateHighscore }