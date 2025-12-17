import {chess} from "./script.js"
console.log(chess.ascii())

// Captura as coordenadas que o mouse clica e que as peças são arrastadas
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

board.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    let coords = getBoardCoords(e)
    let translatedCoords = translateCoords(coords)
    console.log(translatedCoords)
});

board.addEventListener('drop', (e) => {
    let coords = getBoardCoords(e)
    let translatedCoords = translateCoords(coords)
    console.log(translatedCoords)
});

board.addEventListener('dragover', (e) => {
    e.preventDefault(); 
    e.dataTransfer.dropEffect = "move"; 
});