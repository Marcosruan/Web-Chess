import { Chess } from 'https://cdn.jsdelivr.net/npm/chess.js@1.0.0-beta.8/+esm';

export const chess = new Chess()
export const board = document.querySelector("#chess-board")
var re = /([a-z]\d)/

// console.log(chess.ascii())
// console.log(chess.fen())
// var history = ['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR']


// function verifyFen(){
//     let i = 0, index = 0
//     let currentFen = chess.fen()
//     let history = getHistory(currentFen)
//     while (currentFen[i++] != ' '){
//         if (currentFen[i] !== '/'){

//             index++
//         }
//     }
// }

function verifyGameOver(){
    let halvesMoves = chess.fen().split(' ')[4]
    if (chess.isGameOver()){
        if (chess.isCheckmate()){
            if (chess.turn() === 'w'){
                let king = document.querySelector('.K')
                king.classList.add('checkmate')
            }else{
                let king = document.querySelector('.k')
                king.classList.add('checkmate')
            }
        }else if (chess.isDraw()){
            if(chess.isInsufficientMaterial()){
                console.log('draw by insuficient material')
            }else if (halvesMoves >= 100){
                console.log('draw by fifty moves')
            }else if (chess.isStalemate()){
                console.log('stalemate')
            }else if (chess.isThreefoldRepetition()){
            console.log('three fold repetition')
            }
        }
    }
}

function getHistory(currentFen){
    history.push(currentFen.split(' ')[0])
    return history.at(-1)
}

var pieceToRemove
var enPassantAttack

function verifyEnPassant(){
    let enPassantFen = chess.fen().split(' ')[3]
    if (enPassantFen !== '-'){
        enPassantAttack = enPassantFen
        let aux
        aux = enPassantFen.split('')
        if (chess.turn() === 'w'){
            aux[1] = `${String(Number(aux[1]) - 1)}`
        }else {
            aux[1] = `${String(Number(aux[1]) + 1)}`
        }
        pieceToRemove = aux.join('')
    }
}

function verifyCheck(){
    let kingInCheck = document.querySelector('.check')
    if (kingInCheck) kingInCheck.classList.remove('check') 
    if (chess.inCheck() && !(chess.isCheckmate())){
        if (chess.turn() === 'w'){
            let king = document.querySelector('.K')
            king.classList.add('check')
        }else{
            let king = document.querySelector('.k')
            king.classList.add('check')
        }
    }
}

function verifyPromotion(currentPieceCoord, nextPieceCoord){
    let pawn = document.querySelector(`.${currentPieceCoord}`)
    if (!pawn.matches('.p, .P')) return false

    let lista = chess.moves({square: `${currentPieceCoord}`})
    lista.forEach(coord => {
        let square = coord.split((re))[1]
        let i = 0
        if (square){
            if (nextPieceCoord === square) i++
        }
        if (!i) return false
    })

    let sevenths = /(^[a-h]7$)/
    let eighths = /(^[a-h]8$)/
    return sevenths.test(`${currentPieceCoord}`) && eighths.test(`${nextPieceCoord}`)
}

// function getPieceType(nextPieceCoord){
//     let ul = Object.assign(document.createElement("ul"), { className: `${nextPieceCoord}`})
//     board.appendChild(ul)
//     let promotions = ['bb', 'br', 'bn', 'bq', 'wq', 'wn', 'wr', 'wb']
//     let j
//     if (chess.turn() === 'w'){
//         j = 4
//     }else {
//         j = 0
//     }
//     for (let i = 0; i < 4; i++){
//         let li = Object.assign(document.createElement("ul"), { className: `${promotions[j++]}`})
//         ul.appendChild(li)
//     }
// }

function verifyMovementInfo(currentPieceCoord, nextPieceCoord) {
    try {
        let pieceElement = document.querySelector(`.${currentPieceCoord}`)
        let move
        if (verifyPromotion(currentPieceCoord, nextPieceCoord)){
            let pieceType = getPieceType(nextPieceCoord)
            move = chess.move({ from: currentPieceCoord, to: nextPieceCoord, promotion: `${pieceType}` })
        }else{
            move = chess.move({ from: currentPieceCoord, to: nextPieceCoord})
        }

        verifyCheck()

        verifyEnPassant()

        if (move) {
            if (move.flags.includes('k')){
                castling('k')
            }else if (move.flags.includes('q')){
                castling('q')
            }
            if (move.captured) {
                if (move.flags.includes('e')){
                    enPassant(pieceToRemove)
                }else{
                    Capture(nextPieceCoord, pieceElement)
                }
            }
            movePiece(currentPieceCoord, nextPieceCoord, pieceElement)
        }
    } catch (error) {
        console.log('Movimento inválido segundo as regras do xadrez', error)
    }
}

function movePiece(currentPieceCoord, nextPieceCoord, pieceElement){
    pieceElement.classList.remove(currentPieceCoord)
    pieceElement.classList.add(nextPieceCoord)

    removePossibleMove()
    movedBg(currentPieceCoord)
    movedPieceBG(nextPieceCoord)
    selectedPiece = undefined
    verifyGameOver()
}

var selectedPiece

function verifyMove(coord, pieceColor){
    let element = document.querySelector(`.${coord}:not(.moved)`) ?? document.querySelector("#chess-board")
    if ((selectedPiece != null && selectedPiece != undefined) && !(chess.turn() === `${pieceColor}`)){
        verifyMovementInfo(selectedPiece, coord)
    } else if (element.classList.contains('pieces')){
        removePossibleMove()
        selectedPieceBG(coord)
        selectedPiece = coord
    }
}

// rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR -------------------------------------------------------------
function translateFenIndex(index){
    let lista = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    let num
    if (index < 8){
        num = '8'
    }else if (index < 16){
        num = '7'
    }else if (index < 24){
        num = '6'
    }else if (index < 32){
        num = '5'
    }else if (index < 40){
        num = '4'
    }else if (index < 48){
        num = '3'
    }else if (index < 56){
        num = '2'
    }else{
        num = '1'
    }
    return `${lista[index]}${num}`
}

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

function getpieceColor(e) {
    if (e.target.classList.contains('pieces')) {
        if (e.target.classList.contains('w')) return 'w';
        if (e.target.classList.contains('b')) return 'b';
    }
    return undefined;
}

function selectedPieceBG(coord){
    removeSelectedPieceBG()
    let element = document.querySelector(`.${coord}`)
    element.classList.add("selected")
    possibleMoves(coord)
}

function removeSelectedPieceBG(){
    let selected = document.querySelector(".selected")
    if (selected != null) selected.classList.remove("selected")
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

function movedPieceBG(coord){
    let rastroAnterior = document.querySelector(".movedPiece")
    if (rastroAnterior){
        rastroAnterior.classList.remove('movedPiece')
    }
    let element = document.querySelector(`.${coord}`)
    element.classList.add('movedPiece')
}

addEventListener('mousedown', (e) => {
    if (e.target.classList[0] !== 'pieces' || (e.target.classList[1] !== chess.turn())){
        removeSelectedPieceBG()
        removePossibleMove()
    }
})

board.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return
    let coords = getBoardCoords(e)
    let translatedCoords = translateCoords(coords)
    let pieceColor = getpieceColor(e)
    verifyMove(translatedCoords, pieceColor)
})


board.addEventListener('drop', (e) => {
    let coords = getBoardCoords(e)
    let translatedCoords = translateCoords(coords)
    let pieceColor = getpieceColor(e)
    verifyMove(translatedCoords, pieceColor)
})


board.addEventListener('dragover', (e) => {
    e.preventDefault(); 
    e.dataTransfer.dropEffect = "move"
})

function possibleMoves(currentPieceCoord){
    let lista = chess.moves({square: `${currentPieceCoord}`})
    let queenSide = false
    lista.forEach(coord => {
        if (coord === 'O-O'){
            possibleRook(queenSide)
        }else if (coord === 'O-O-O'){
            queenSide = true
            possibleRook(queenSide)
        }
    })
    for (let i = 0; i < lista.length; i++){
        let square = lista[i].split((re))[1]
        if (square !== undefined){
            let element = Object.assign(document.createElement("div"), { className: `${square}`})
            board.appendChild(element)
            verifyAttackedPiece(element)
        }
    }
}

function verifyAttackedPiece(possibleMoveElement){
    const pieces = document.querySelectorAll('.pieces')
    const coord = possibleMoveElement.classList[0]
    pieces.forEach(divPiece => {
        if (divPiece.classList.contains(coord)){
            possibleMoveElement.classList.add('possibleCapture')
        }else if (coord === enPassantAttack){
            possibleMoveElement.classList.add('possibleCapture')
        }else{
            possibleMoveElement.classList.add('possibleMove')
        }
    })
}

function Capture(coord, pieceMovedElement) {
    const potentialVictims = document.querySelectorAll(`.pieces.${coord}`)
    
    potentialVictims.forEach(victim => {
        if (victim !== pieceMovedElement) {
            victim.remove()
        }
    })
}

function enPassant(coord) {
    const victim = document.querySelector(`.${coord}`)
    if (!victim) return
    victim.remove()
}

function removePossibleMove(){
    let element = document.querySelectorAll('.possibleMove, .possibleCapture, .castling')
    element.forEach(div => {
        div.remove()
    })
}

function possibleRook(queenSide){
    let turn = chess.turn()
    let coord
    if (queenSide){
        if (turn === 'w'){
            coord = 'c1'
        }else{
            coord = 'c8'
        }
    }else {
        if (turn === 'w'){
            coord = 'g1'
        }else{
            coord = 'g8'
        }
    }
    let element = Object.assign(document.createElement("div"), { className: `${coord} castling`})
    board.appendChild(element)
}

function castling(castlingSide){
    let side, coord
    if (castlingSide === 'k'){
        if (chess.turn() === 'b'){
            side = 'f1'
            coord = 'h1'
        }else {
            side = 'f8'
            coord = 'h8'
        }
    }else if(castlingSide === 'q'){
        if (chess.turn() === 'b'){
            side = 'd1'
            coord = 'a1'
        }else {
            side = 'd8'
            coord = 'a8'
        }
    }
    let element = document.querySelector(`.${coord}`)
    element.classList.remove(coord)
    element.classList.add(side)
}
