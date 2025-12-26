import {chess} from "./script.js"
import {checkMove, checkAttack, possibleMoves, removePossibleMove} from "./verifiesMoves.js"
console.log(chess.ascii())

export const board = document.querySelector("#chess-board")


function getBoardCoords(e){
    const boardRect = board.getBoundingClientRect()
    const numCols = 8
    
    const cellWidth = boardRect.width / numCols
    const cellHeight = boardRect.height / numCols
    
    const xInsideBoard = e.clientX - boardRect.left
    const yInsideBoard = e.clientY - boardRect.bottom
    
    const coordX = Math.floor(xInsideBoard / cellWidth) + 1
    const coordY = Math.floor(yInsideBoard / cellHeight) * -1

    return {"x": coordX, "y": coordY}
}

function translateCoords(dict){
    let letters = ["a", "b", "c", "d", "e", "f", "g", "h"]
    return `${letters[dict.x-1]}${String(dict.y)}`
}

function getPieceType(e){
    let pieceType
    if (e.target.classList.contains('pieces')) {
        pieceType = e.target.classList[2];
    }else{
        pieceType = undefined
    }
    return pieceType
}

function getCoordPieceType(coord, pieceType){
    if (pieceType !== undefined){
        let types = ['brq', 'wrq', 'brk', 'wrk',
                    'bnq', 'wnq', 'bnk', 'wnk',
                    'bbq', 'wbq', 'bbk', 'wbk',
                    'bq', 'wq', 'bk', 'wk', 'bp', 'wp'
        ]
        for (let i = 0; i < types.length; i++){
            if (pieceType === types[i]){
                if (i < 4){
                    return `R${coord}`
                }else if(i < 8){
                    return `N${coord}`
                }else if(i < 12){
                    return `B${coord}`
                }else if(i < 14){
                    return `Q${coord}`
                }else if(i < 16){
                    return `K${coord}`
                }else{
                    return coord
                }
            }
        }
    }else{
        return undefined
    }
}

function selectedBg(coord){
    let element = document.querySelector(`.${coord}`)
    let selected = document.querySelector(".selected")
    
    if (selected != null) selected.classList.remove("selected")

    element.classList.add("selected")

    possibleMoves(coord)
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

function movedPieceBg(coord){
    let rastroAnterior = document.querySelector(".movedPiece")
    if (rastroAnterior){
        rastroAnterior.classList.remove('movedPiece')
    }
    let element = document.querySelector(`.${coord}`)
    element.classList.add('movedPiece')
}


export function movePiece(coordPiece, coordSquare){
    let piece = document.querySelector(`.${coordPiece}`)

    chess.move({from: `${coordPiece}`, to: `${coordSquare}`})

    piece.classList.remove(coordPiece)
    piece.classList.add(coordSquare)

    movedBg(coordPiece)
    movedPieceBg(coordSquare)
    selectedPiece = undefined
    pieceTypeStored = undefined
}

var selectedPiece
var pieceTypeStored

function captureMove(coord, pieceType){
    let element = document.querySelector(`.${coord}:not(.moved)`) ?? document.querySelector("#chess-board")
    if (!(element.classList.contains('pieces'))) {
        if (selectedPiece != null && selectedPiece != undefined){
            let coordPieceType = getCoordPieceType(coord, pieceTypeStored)
            checkMove(selectedPiece, coordPieceType, coord)
        }
    } else{
        removePossibleMove()
        selectedBg(coord)
        selectedPiece = coord
        pieceTypeStored = pieceType
    }
}

function captureAttack(attackerCoord, eliminatedCoord) {
    
}

var attack

board.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return
    var attack = checkAttack()
    if (e.target.classList.contains(`${chess.turn()}`) || e.target.id == 'chess-board' || attack === true){
        let coords = getBoardCoords(e)
        let translatedCoords = translateCoords(coords)
        let pieceType = getPieceType(e)
        captureMove(translatedCoords, pieceType)
    }
})


board.addEventListener('drop', (e) => {
    let coords = getBoardCoords(e)
    let translatedCoords = translateCoords(coords)
    let pieceType = getPieceType(e)
    captureMove(translatedCoords, pieceType)
})


board.addEventListener('dragover', (e) => {
    e.preventDefault(); 
    e.dataTransfer.dropEffect = "move"
})
