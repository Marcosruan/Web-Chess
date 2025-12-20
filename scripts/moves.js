import {chess} from "./script.js"
console.log(chess.ascii())

const board = document.querySelector("#chess-board")


function getBoardCoords(e){
    const boardRect = board.getBoundingClientRect();
    const numCols = 8; 
    
    const cellWidth = boardRect.width / numCols;
    const cellHeight = boardRect.height / numCols;
    
    const xInsideBoard = e.clientX - boardRect.left;
    const yInsideBoard = e.clientY - boardRect.bottom;
    
    const coordX = Math.floor(xInsideBoard / cellWidth) + 1;
    const coordY = Math.floor(yInsideBoard / cellHeight) * -1;

    return {"x": coordX, "y": coordY}
}


function translateCoords(dict){
    let letters = ["a", "b", "c", "d", "e", "f", "g", "h"]
    return `${letters[dict.x-1]}${String(dict.y)}`
}


function selectedBg(coord){
    let element = document.querySelector(`.${coord}`)
    let selected = document.querySelector(".selected")
    
    if (selected != null) selected.classList.remove("selected")

    element.classList.add("selected")
}


function movedBg(coord){
    let rastroAnterior = document.querySelector(".moved")
    if (rastroAnterior){
        rastroAnterior.remove()
    }
    let element = Object.assign(document.createElement("div"), { className: "pieces moved"})
    element.classList.add(`${coord}`)
    board.appendChild(element)
}


function movePiece(Pcoord, Scoord){
    let piece = document.querySelector(`.${Pcoord}`)

    piece.classList.remove(Pcoord)
    piece.classList.add(Scoord)

    movedBg(Pcoord)
}

var selectedPiece

function checkMove(coord){
    let element = document.querySelector(`.${coord}:not(.moved)`) ?? document.querySelector("#chess-board");
    if (!(element.classList.contains('pieces'))) {
        if (selectedPiece != null && selectedPiece != undefined){
            movePiece(selectedPiece, coord)
            selectedPiece = undefined
        }
    } else{
        selectedBg(coord)
        selectedPiece = coord
    }
}


board.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    let coords = getBoardCoords(e)
    let translatedCoords = translateCoords(coords)
    checkMove(translatedCoords)
    // console.log(translatedCoords)
});


board.addEventListener('drop', (e) => {
    let coords = getBoardCoords(e)
    let translatedCoords = translateCoords(coords)
    // console.log(translatedCoords)
});


board.addEventListener('dragover', (e) => {
    e.preventDefault(); 
    e.dataTransfer.dropEffect = "move"; 
});
