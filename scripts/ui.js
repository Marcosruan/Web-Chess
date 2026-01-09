import * as utils from './utils.js'
import {globals, elements, COORD_REGEX} from './main.js'

export function removePieceWhenEnPassant(pieceToRemove) {
    const victim = document.querySelector(`.${pieceToRemove}`)
    victim?.remove()
}


export function createPromotionList(ulCoord){
    const promotions = ['bclose', 'bb', 'br', 'bn', 'bq', 'wq', 'wn', 'wr', 'wb', 'wclose']
    const ul = Object.assign(document.createElement("ul"), { className: `pieces promotionList ${ulCoord.coord}`})
    elements.board.appendChild(ul)
    let index = ulCoord.index
    for (let i = 0; i < 5; i++){
        const li = Object.assign(document.createElement("li"), { className: `${promotions[index++]} pieces promotionItem `})
        ul.appendChild(li)
    }
}


function verifyAttackedPiece(possibleMoveElement){
    const pieces = document.querySelectorAll('.pieces:not(.moved)')
    const coord = possibleMoveElement.classList[0]
    pieces.forEach(divPiece => {
        if (divPiece.classList.contains(coord) || coord === globals.enPassantAttackedSquare){
            possibleMoveElement.classList.add('possibleCapture')
        }else{
            possibleMoveElement.classList.add('possibleMove')
        }
    })
}


export function deletePromotionList(){
    elements.ul?.remove()
}


export function updatePromotingPiece(pieceType){
    if (utils.isWhiteToMove()) elements.pieceElement?.classList.remove('wp')
    else elements.pieceElement?.classList.remove('bp') 
    elements.pieceElement?.classList.add(`${pieceType}`)
}


export function moveUIPiece(){
    const {currentPieceCoord, nextPieceCoord} = globals
    const {pieceElement} = elements
    pieceElement?.classList.remove(currentPieceCoord)
    pieceElement?.classList.add(nextPieceCoord)
}


export function createHighlightPiece(){
    const element = document.querySelector(`.${globals.currentPieceCoord}`)
    element.classList.add("highlight")
}


export function clearHighlightPiece(){
    elements.highlightPiece?.classList.remove("highlight")
}


export function createHighlightTrail(){
    const element = Object.assign(document.createElement("div"), { className: `pieces moved ${globals.currentPieceCoord}`})
    elements.board.appendChild(element)
}


export function clearHighlightTrail(){
    elements.highlightTrail?.remove()
}


export function clearMovedPieceBackground(){
    elements.movedPiece?.classList.remove('movedPiece')
}


export function createMovedPieceBackground(){
    const element = document.querySelector(`.${globals.nextPieceCoord}`)
    element?.classList.add('movedPiece')
}


export function createPossibleCastlingIndicator(coord){
    const element = Object.assign(document.createElement("div"), { className: `${coord} castling`})
    elements.board.appendChild(element)
}


export function createPossibleMovesIndicator(possibleMovesList){
    for (let i = 0; i < possibleMovesList.length; i++){
        const square = possibleMovesList[i].split((COORD_REGEX))[1]
        if (square){
            const element = Object.assign(document.createElement("div"), { className: `${square}`})
            elements.board.appendChild(element)
            verifyAttackedPiece(element)
        }
    }
}


export function makeCapture() {
    const {nextPieceCoord} = globals
    const potentialVictims = document.querySelectorAll(`.pieces.${nextPieceCoord}`)
    
    potentialVictims.forEach(victim => {
        if (victim !== elements.pieceElement) {
            victim?.remove()
        }
    })
}


export function clearPossibleMovesIndicator(){
    const element = document.querySelectorAll('.possibleMove, .possibleCapture, .castling')
    element.forEach(div => {
        div.remove()
    })
}


export function createCheckmateDisplay(){
    elements.currentKing?.classList.add('checkmate')
}


export function createCheckDisplay(){
    elements.currentKing?.classList.add('check')
}


export function clearCheckDisplay(){
    elements.checkKing?.classList.remove('check') 
}


export function updateRookWhenCastling(info){
    const element = document.querySelector(`.${info.rookCurrentPosition}`)
    element?.classList.remove(info.rookCurrentPosition)
    element?.classList.add(info.rookNextPosition)
}