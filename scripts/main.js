import * as game from './game.js'
import * as utils from './utils.js'
import * as ui from './ui.js'

import { Chess } from 'https://cdn.jsdelivr.net/npm/chess.js@1.0.0-beta.8/+esm';

export const chess = new Chess()
export const COORD_REGEX = /([a-h][1-8])/

// inacabadas ------------------------------------------------------------------------------------------

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

function getHistory(currentFen){
    history.push(currentFen.split(' ')[0])
    return history.at(-1)
}

// rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR 
function translateFenIndex(index){
    const lista = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
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


export const globals = {
    enPassantAttackedSquare: null,
    currentPieceCoord: null,
    nextPieceCoord: null,
    possibleMovesList: null,
    promoting: null
}


export const elements = {
    board: document.querySelector("#chess-board"),
    get whiteKing() {return this.board?.querySelector('.wk')},
    get blackKing() {return this.board?.querySelector('.bk')},
    get checkKing() {return this.board?.querySelector('.check')},
    get currentKing() {return utils.isWhiteToMove() ? this.whiteKing : this.blackKing},

    get ul() {return this.board?.querySelector('.promotionList')},
    get movedPiece() {return this.board?.querySelector('.movedPiece')},
    get highlightPiece() {return this.board?.querySelector('.highlight')},
    get highlightTrail() {return this.board?.querySelector('.moved')},

    get pieceElement() {return this.board?.querySelector(`.${globals.currentPieceCoord}`)}
}


function checkController(){
    ui.clearCheckDisplay()
    if (chess.inCheck() && !(chess.isCheckmate())) ui.createCheckDisplay()
}


function enPassantController(){
    const enPassantFen = chess.fen().split(' ')[3]
    if (enPassantFen !== '-') utils.initEnPassantAttackSquare(enPassantFen)
}


export async function promotionController(){
    const {nextPieceCoord} = globals
    const ulCoord = utils.getUlCoord(nextPieceCoord)
    ui.createPromotionList(ulCoord)
    globals.promoting = true
    const pieceType = await utils.getPiecePromotionType()
    globals.promoting = null
    let make = null
    if (!(pieceType === 'wclose' || pieceType === 'bclose')){
        ui.updatePromotingPiece(pieceType)
        make = game.makePromotionMove(pieceType)
    }
    ui.deletePromotionList()
    return make
}


function movePieceController(){
    ui.moveUIPiece()
    ui.clearPossibleMovesIndicator()
    highlightTrailController()
    movedPieceBackgroundController()
}


function castlingController(move){
    const {possibleMovesList} = globals
    if (!game.isCastling(possibleMovesList)) return
    const castlingSide = utils.getCastlingSide(move)
    const info = utils.getCastlingRookInfo(castlingSide)
    ui.updateRookWhenCastling(info)
}


function movedPieceBackgroundController(){ 
    ui.clearMovedPieceBackground()
    ui.createMovedPieceBackground()
}


function highlightPieceController(coord){ 
    ui.clearHighlightPiece()
    ui.createHighlightPiece(coord)
}


function highlightTrailController(){ 
    ui.clearHighlightTrail()
    ui.createHighlightTrail()
}


function possibleCastlingController(){
    const {possibleMovesList} = globals
    if (game.isCastling(possibleMovesList)){
        const queenSide = utils.getPossibleCastlingSide(possibleMovesList)
        let coord
        if (queenSide === 2){
            for (let i = 0; i < 2; i++){
            coord = utils.getPossibleCastlingCoord(i)
            ui.createPossibleCastlingIndicator(coord)
            }
        }else{
            coord = utils.getPossibleCastlingCoord(queenSide)
            ui.createPossibleCastlingIndicator(coord)
        }
    }
}


function possibleMovesController(){
    const {possibleMovesList} = globals
    ui.clearPossibleMovesIndicator()
    ui.createPossibleMovesIndicator(possibleMovesList)
}


function enPassantUIController(){
    const pieceToRemove = utils.getPieceToRemove()
    ui.removePieceWhenEnPassant(pieceToRemove)
    utils.initEnPassantAttackSquare(null)
}


addEventListener('mousedown', (e) => {
    if (e.target.classList[0] !== 'pieces' || (e.target.classList[1] !== chess.turn())){
        ui.clearHighlightPiece()
        ui.clearPossibleMovesIndicator()
    }
})


elements.board.addEventListener('dragover', (e) => {
    e.preventDefault(); 
    e.dataTransfer.dropEffect = "move"
})


elements.board.addEventListener('mousedown', (e) => {
    if (e.button !== 0 || globals.promoting === true) return
    const coords = utils.getBoardCoords(e)
    const translatedCoords = utils.translateCoords(coords)
    const pieceColor = utils.getPieceColor(e)
    verifyUserClicks(translatedCoords, pieceColor)
})


elements.board.addEventListener('drop', (e) => {
    if (globals.promoting === true) return
    const coords = utils.getBoardCoords(e)
    const translatedCoords = utils.translateCoords(coords)
    const pieceColor = utils.getPieceColor(e)
    verifyUserClicks(translatedCoords, pieceColor)
})


async function verifyUserClicks(coord, pieceColor){
    const element = document.querySelector(`.${coord}:not(.moved)`) ?? elements.board
    if ((globals.currentPieceCoord != null && globals.currentPieceCoord != undefined) && !(chess.turn() === `${pieceColor}`)){
        globals.nextPieceCoord = coord
        await mainController()
        globals.currentPieceCoord = null
        globals.nextPieceCoord = null
    } else if (element.classList.contains('pieces')){
        globals.currentPieceCoord = coord
        globals.possibleMovesList = chess.moves({square: `${globals.currentPieceCoord}`})
        possibleMovesController()
        highlightPieceController()
        possibleCastlingController()
    }
}


async function mainController() {
    const move = await game.getMoveObject()
    checkController()
    enPassantController()
    if (move) {
        castlingController(move)
        if (move.captured) {
            if (move.flags.includes('e')){
                enPassantUIController()
            }else{
                ui.makeCapture()
            }
        }
        movePieceController()
        game.gameOverController()
    }
}
