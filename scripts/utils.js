import {globals, elements, chess} from './main.js'

export function isWhiteToMove(){
    return chess.turn() === 'w'
} //utils


export async function getPiecePromotionType() {
    const {ul} = elements
    return new Promise((resolve) => {
        ul.addEventListener('mousedown', (e) => {
            const pieceType = e.target.classList[0]
            resolve(pieceType)
        }, { once: true })
    })
} //utils


export function getUlCoord(nextPieceCoord){
    let ulCoord = nextPieceCoord
    let index = 5
    if (!isWhiteToMove()){
        const [file, currentRank] = nextPieceCoord.split('')
        const targetRank = parseInt(currentRank) + 4
        ulCoord = `${file}${targetRank}`
        index = 0
    }
    return {
        coord: ulCoord,
        index: index
    }
} //utils


export function getPieceToRemove(){
    const {enPassantAttackedSquare} = globals
    const [file, rankStr] = enPassantAttackedSquare.split('')
    const currentRank = parseInt(rankStr)
    const targetRank = isWhiteToMove() ? currentRank + 1 : currentRank - 1
    return `${file}${targetRank}`
} //utils


export function initEnPassantAttackSquare(enPassantFen){
    globals.enPassantAttackedSquare = enPassantFen
} //utils


export function getBoardCoords(e){
    const boardRect = elements.board.getBoundingClientRect()
    const numCols = 8
    
    const cellWidth = boardRect.width / numCols
    const cellHeight = boardRect.height / numCols
    
    const xInsideBoard = e.clientX - boardRect.left
    const yInsideBoard = e.clientY - boardRect.bottom
    
    const coordX = Math.floor(xInsideBoard / cellWidth) + 1
    const coordY = Math.floor(yInsideBoard / cellHeight) * -1

    return {"x": coordX, "y": coordY}
} //utils


export function translateCoords(dict){
    const letters = ["a", "b", "c", "d", "e", "f", "g", "h"]
    return `${letters[dict.x-1]}${String(dict.y)}`
} //utils


export function getPieceColor(e) {
    if (e.target.classList.contains('pieces')) {
        if (e.target.classList.contains('w')) return 'w';
        if (e.target.classList.contains('b')) return 'b';
    }
    return undefined;
} //utils


export function getCastlingRookInfo(castlingSide){
    const rank = isWhiteToMove() ? '8' : '1'
    const fileMap = {
        k: {current: 'h', next: 'f'},
        q: {current: 'a', next: 'd'}
    }
    const file = fileMap[castlingSide]
    return {
        rookCurrentPosition: `${file.current}${rank}`,
        rookNextPosition: `${file.next}${rank}`
    }
} //utils


export function getCastlingSide(move){
    if (move.flags.includes('k')) return 'k'
    if (move.flags.includes('q')) return 'q'
} //utils


export function getPossibleCastlingCoord(queenSide){
    const file = queenSide ? 'c' : 'g'
    const rank = isWhiteToMove() ? '1' : '8'
    return `${file}${rank}`
} //utils


export function getPossibleCastlingSide(possibleMovesList){
    let queenSide = false
    possibleMovesList.forEach(move => {
        if (move === 'O-O-O') queenSide = true
    })
    return queenSide
} //utils