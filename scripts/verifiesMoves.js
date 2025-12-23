import {movePiece} from "./moves.js"
import {chess} from "./script.js"

export function checkMove(coordPiece, coordSquare, coord){
    const lista = chess.moves({square: `${coordPiece}`})
    for (let i = 0; i < lista.length; i++){
        if (coordSquare === lista[i]){
            movePiece(coordPiece, coord)
        }
        console.log(lista[i])
    }
}

// function possibleMoves(Pcoord, Scoord){

// }