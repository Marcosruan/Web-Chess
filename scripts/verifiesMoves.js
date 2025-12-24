import {movePiece, board} from "./moves.js"
import {chess} from "./script.js"

export function checkMove(coordPiece, coordSquare, coord){
    const lista = chess.moves({square: `${coordPiece}`})
    for (let i = 0; i < lista.length; i++){
        if (coordSquare === lista[i]){
            movePiece(coordPiece, coord)
            removePossibleMove()
        }
    }
}

export function checkAttack(coordPiece, coordSquare, coord){
    const lista = chess.moves({square: `${coordPiece}`})
    for (let i = 0; i < lista.length; i++){
        if (coordSquare === lista[i]){
            movePiece(coordPiece, coord)
            removePossibleMove()
        }
    }
}

export function possibleMoves(coordPiece){
    const lista = chess.moves({square: `${coordPiece}`})
    for (let i = 0; i < lista.length; i++){
        let element = Object.assign(document.createElement("div"), { className: `pieces possibleMove ${lista[i]}`})
        board.appendChild(element)
    }
}

export function removePossibleMove(){
    let element = document.querySelectorAll('.possibleMove')
    element.forEach(div => {
        div.remove()
    });
}