import * as main from './main.js'
import * as ui from './ui.js'
import {globals, elements, COORD_REGEX, chess} from './main.js'


export function gameOverController(){
    if (chess.isGameOver()){
        if (chess.isCheckmate()){
            ui.createCheckmateDisplay()
        }else if (chess.isDraw()){
            getDrawReason()
        }
    }
}


function isAPossibleMove(nextPieceCoord){
    let isPossible = 0
    globals.possibleMovesList?.forEach(coord => {
        const square = coord.split((COORD_REGEX))[1]
        if (square && nextPieceCoord === square) isPossible++
    })
    return isPossible ? true : false
}


function isPromotion(){
    if (!elements.pieceElement?.matches('.p, .P')) return false
    const {currentPieceCoord, nextPieceCoord} = globals
    if (!isAPossibleMove(nextPieceCoord)) return false
    const firsts = /(^[a-h]1$)/, seconds = /(^[a-h]2$)/, sevenths = /(^[a-h]7$)/, eighths = /(^[a-h]8$)/
    return (seconds.test(`${currentPieceCoord}`) && firsts.test(`${nextPieceCoord}`)) || (sevenths.test(`${currentPieceCoord}`) && eighths.test(`${nextPieceCoord}`))
}


export function makePromotionMove(pieceType){
    const {currentPieceCoord, nextPieceCoord} = globals
    const move = chess.move({ from: currentPieceCoord, to: nextPieceCoord, promotion: `${pieceType.split('')[1]}` })
    return move
} 


function makeMove(){
    const {currentPieceCoord, nextPieceCoord} = globals
    const move = chess.move({ from: currentPieceCoord, to: nextPieceCoord})
    return move
}


function isDrawByFiftyMoves(){
    const halvesMoves = chess.fen().split(' ')[4]
    return halvesMoves >= 100
}


function getDrawReason(){
    if (chess.isInsufficientMaterial()) return 'draw by insuficient material'
    if (isDrawByFiftyMoves()) return 'draw by fifty moves'
    if (chess.isStalemate()) return 'stalemate'
    if (chess.isThreefoldRepetition()) return 'three fold repetition'

    return 'draw'
}


export function isCastling(possibleMovesList){
    let isCastling = false 
    possibleMovesList.forEach(move => {
        if (move === 'O-O' || move === 'O-O-O') isCastling = true
    })
    return isCastling
}


export async function getMoveObject() {
    try {
        let move
        if (isPromotion()) move = await main.promotionController()
        else move = makeMove()
        return move
    } catch (error) {
        console.log('Movimento inválido segundo as regras do xadrez', error)
    }
}