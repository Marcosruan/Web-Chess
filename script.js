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
// -------------------------------------------------------------------------------------------------------

// utils +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function isWhiteToMove(){
    return chess.turn() === 'w'
} //utils


async function getPiecePromotionType() {
    const {ul} = elements
    return new Promise((resolve) => {
        ul.addEventListener('mousedown', (e) => {
            const pieceType = e.target.classList[0]
            resolve(pieceType)
        }, { once: true })
    })
} //utils


function getUlCoord(nextPieceCoord){
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


function getPieceToRemove(){
    const {enPassantAttackedSquare} = globals
    const [file, rankStr] = enPassantAttackedSquare.split('')
    const currentRank = parseInt(rankStr)
    const targetRank = isWhiteToMove() ? currentRank + 1 : currentRank - 1
    return `${file}${targetRank}`
} //utils


function initEnPassantAttackSquare(enPassantFen){
    globals.enPassantAttackedSquare = enPassantFen
} //utils


function getBoardCoords(e){
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


function translateCoords(dict){
    const letters = ["a", "b", "c", "d", "e", "f", "g", "h"]
    return `${letters[dict.x-1]}${String(dict.y)}`
} //utils


function getPieceColor(e) {
    if (e.target.classList.contains('pieces')) {
        if (e.target.classList.contains('w')) return 'w';
        if (e.target.classList.contains('b')) return 'b';
    }
    return undefined;
} //utils


function getCastlingRookInfo(castlingSide){
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


function getCastlingSide(move){
    if (move.flags.includes('k')) return 'k'
    if (move.flags.includes('q')) return 'q'
} //utils


function getPossibleCastlingCoord(queenSide){
    const file = queenSide ? 'c' : 'g'
    const rank = isWhiteToMove() ? '1' : '8'
    return `${file}${rank}`
} //utils


function getPossibleCastlingSide(possibleMovesList){
    let queenSide = false
    possibleMovesList.forEach(move => {
        if (move === 'O-O-O') queenSide = true
    })
    return queenSide
} //utils


//  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// game *************************************************************************************************
function gameOverController(){
    if (chess.isGameOver()){
        if (chess.isCheckmate()){
            createCheckmateDisplay()
        }else if (chess.isDraw()){
            getDrawReason()
        }
    }
} //game


function isAPossibleMove(nextPieceCoord){
    let isPossible = 0
    globals.possibleMovesList?.forEach(coord => {
        const square = coord.split((COORD_REGEX))[1]
        if (square && nextPieceCoord === square) isPossible++
    })
    return isPossible ? true : false
} //game


function isPromotion(){
    if (!elements.pieceElement?.matches('.p, .P')) return false
    const {currentPieceCoord, nextPieceCoord} = globals
    if (!isAPossibleMove(nextPieceCoord)) return false
    const firsts = /(^[a-h]1$)/, seconds = /(^[a-h]2$)/, sevenths = /(^[a-h]7$)/, eighths = /(^[a-h]8$)/
    return (seconds.test(`${currentPieceCoord}`) && firsts.test(`${nextPieceCoord}`)) || (sevenths.test(`${currentPieceCoord}`) && eighths.test(`${nextPieceCoord}`))
} //game


function makePromotionMove(pieceType){
    const {currentPieceCoord, nextPieceCoord} = globals
    const move = chess.move({ from: currentPieceCoord, to: nextPieceCoord, promotion: `${pieceType.split('')[1]}` })
    return move
} //game 


function makeMove(){
    const {currentPieceCoord, nextPieceCoord} = globals
    const move = chess.move({ from: currentPieceCoord, to: nextPieceCoord})
    return move
} //game


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
} //game


function isDrawByFiftyMoves(){
    const halvesMoves = chess.fen().split(' ')[4]
    return halvesMoves >= 100
} //game


function getDrawReason(){
    if (chess.isInsufficientMaterial()) return 'draw by insuficient material'
    if (isDrawByFiftyMoves()) return 'draw by fifty moves'
    if (chess.isStalemate()) return 'stalemate'
    if (chess.isThreefoldRepetition()) return 'three fold repetition'

    return 'draw'
} //game


function isCastling(possibleMovesList){
    let isCastling = false 
    possibleMovesList.forEach(move => {
        if (move === 'O-O' || move === 'O-O-O') isCastling = true
    })
    return isCastling
} //game


async function getMoveObject() {
    try {
        let move
        if (isPromotion()) move = await promotionController()
        else move = makeMove()
        return move
    } catch (error) {
        console.log('Movimento inválido segundo as regras do xadrez', error)
    }
} //game


// ****************************************************************************************************

// ui /////////////////////////////////////////////////////////////////////////////////////////////////
function removePieceWhenEnPassant(pieceToRemove) {
    const victim = document.querySelector(`.${pieceToRemove}`)
    victim?.remove()
} //ui


function createPromotionList(ulCoord){
    const promotions = ['bclose', 'bb', 'br', 'bn', 'bq', 'wq', 'wn', 'wr', 'wb', 'wclose']
    const ul = Object.assign(document.createElement("ul"), { className: `pieces promotionList ${ulCoord.coord}`})
    elements.board.appendChild(ul)
    let index = ulCoord.index
    for (let i = 0; i < 5; i++){
        const li = Object.assign(document.createElement("li"), { className: `${promotions[index++]} pieces promotionItem `})
        ul.appendChild(li)
    }
} //ui


function deletePromotionList(){
    elements.ul?.remove()
} //ui


function updatePromotingPiece(pieceType){
    if (isWhiteToMove()) elements.pieceElement?.classList.remove('wp')
    else elements.pieceElement?.classList.remove('bp') 
    elements.pieceElement?.classList.add(`${pieceType}`)
} //ui


function moveUIPiece(){
    const {currentPieceCoord, nextPieceCoord} = globals
    const {pieceElement} = elements
    pieceElement?.classList.remove(currentPieceCoord)
    pieceElement?.classList.add(nextPieceCoord)
} //ui


function createHighlightPiece(){
    const element = document.querySelector(`.${globals.currentPieceCoord}`)
    element.classList.add("highlight")
} //ui


function clearHighlightPiece(){
    elements.highlightPiece?.classList.remove("highlight")
} //ui


function createHighlightTrail(){
    const element = Object.assign(document.createElement("div"), { className: `pieces moved ${globals.currentPieceCoord}`})
    elements.board.appendChild(element)
} //ui


function clearHighlightTrail(){
    elements.highlightTrail?.remove()
} //ui


function clearMovedPieceBackground(){
    elements.movedPiece?.classList.remove('movedPiece')
} //ui


function createMovedPieceBackground(){
    const element = document.querySelector(`.${globals.nextPieceCoord}`)
    element?.classList.add('movedPiece')
} //ui


function createPossibleCastlingIndicator(coord){
    const element = Object.assign(document.createElement("div"), { className: `${coord} castling`})
    elements.board.appendChild(element)
} //ui


function createPossibleMovesIndicator(possibleMovesList){
    for (let i = 0; i < possibleMovesList.length; i++){
        const square = possibleMovesList[i].split((COORD_REGEX))[1]
        if (square){
            const element = Object.assign(document.createElement("div"), { className: `${square}`})
            elements.board.appendChild(element)
            verifyAttackedPiece(element)
        }
    }
} //ui


function makeCapture() {
    const {nextPieceCoord} = globals
    const potentialVictims = document.querySelectorAll(`.pieces.${nextPieceCoord}`)
    
    potentialVictims.forEach(victim => {
        if (victim !== elements.pieceElement) {
            victim?.remove()
        }
    })
} //ui

function enPassantUIController(){
    const pieceToRemove = getPieceToRemove()
    removePieceWhenEnPassant(pieceToRemove)
    initEnPassantAttackSquare(null)
} //ui


function clearPossibleMovesIndicator(){
    const element = document.querySelectorAll('.possibleMove, .possibleCapture, .castling')
    element.forEach(div => {
        div.remove()
    })
} //ui


function createCheckmateDisplay(){
    elements.currentKing?.classList.add('checkmate')
} //ui


function createCheckDisplay(){
    elements.currentKing?.classList.add('check')
} //ui


function clearCheckDisplay(){
    elements.checkKing?.classList.remove('check') 
} //ui


function updateRookWhenCastling(info){
    const element = document.querySelector(`.${info.rookCurrentPosition}`)
    element?.classList.remove(info.rookCurrentPosition)
    element?.classList.add(info.rookNextPosition)
} //ui

// /////////////////////////////////////////////////////////////////////////////////////////////////

// main ===========================================================================================

const globals = {
    enPassantAttackedSquare: null,
    currentPieceCoord: null,
    nextPieceCoord: null,
    possibleMovesList: null,
    promoting: null
} //main


const elements = {
    board: document.querySelector("#chess-board"),
    get whiteKing() {return this.board?.querySelector('.wk')},
    get blackKing() {return this.board?.querySelector('.bk')},
    get checkKing() {return this.board?.querySelector('.check')},
    get currentKing() {return isWhiteToMove() ? this.whiteKing : this.blackKing},

    get ul() {return this.board?.querySelector('.promotionList')},
    get movedPiece() {return this.board?.querySelector('.movedPiece')},
    get highlightPiece() {return this.board?.querySelector('.highlight')},
    get highlightTrail() {return this.board?.querySelector('.moved')},

    get pieceElement() {return this.board?.querySelector(`.${globals.currentPieceCoord}`)}
} //main


function checkController(){
    clearCheckDisplay()
    if (chess.inCheck() && !(chess.isCheckmate())) createCheckDisplay()
} //main


function enPassantController(){
    const enPassantFen = chess.fen().split(' ')[3]
    if (enPassantFen !== '-') initEnPassantAttackSquare(enPassantFen)
} //main


async function promotionController(){
    const {nextPieceCoord} = globals
    const ulCoord = getUlCoord(nextPieceCoord)
    createPromotionList(ulCoord)
    globals.promoting = true
    const pieceType = await getPiecePromotionType()
    globals.promoting = null
    let make = null
    if (!(pieceType === 'wclose' || pieceType === 'bclose')){
        updatePromotingPiece(pieceType)
        make = makePromotionMove(pieceType)
    }
    deletePromotionList()
    return make
} //main


function movePieceController(){
    moveUIPiece()
    clearPossibleMovesIndicator()
    highlightTrailController()
    movedPieceBackgroundController()
} //main


function castlingController(move){
    const {possibleMovesList} = globals
    if (!isCastling(possibleMovesList)) return
    const castlingSide = getCastlingSide(move)
    const info = getCastlingRookInfo(castlingSide)
    updateRookWhenCastling(info)
} //main


function movedPieceBackgroundController(){ 
    clearMovedPieceBackground()
    createMovedPieceBackground()
} //main


function highlightPieceController(coord){ 
    clearHighlightPiece()
    createHighlightPiece(coord)
} //main


function highlightTrailController(){ 
    clearHighlightTrail()
    createHighlightTrail()
} //main


function possibleCastlingController(){
    const {possibleMovesList} = globals
    if (isCastling(possibleMovesList)){
        const queenSide = getPossibleCastlingSide(possibleMovesList)
        const coord = getPossibleCastlingCoord(queenSide)
        createPossibleCastlingIndicator(coord)
    }
}

function possibleMovesController(){
    const {possibleMovesList} = globals
    clearPossibleMovesIndicator()
    createPossibleMovesIndicator(possibleMovesList)
} //main


addEventListener('mousedown', (e) => {
    if (e.target.classList[0] !== 'pieces' || (e.target.classList[1] !== chess.turn())){
        clearHighlightPiece()
        clearPossibleMovesIndicator()
    }
}) //main


elements.board.addEventListener('dragover', (e) => {
    e.preventDefault(); 
    e.dataTransfer.dropEffect = "move"
}) //main


elements.board.addEventListener('mousedown', (e) => {
    if (e.button !== 0 || globals.promoting === true) return
    const coords = getBoardCoords(e)
    const translatedCoords = translateCoords(coords)
    const pieceColor = getPieceColor(e)
    verifyUserClicks(translatedCoords, pieceColor)
}) //main


elements.board.addEventListener('drop', (e) => {
    if (globals.promoting === true) return
    const coords = getBoardCoords(e)
    const translatedCoords = translateCoords(coords)
    const pieceColor = getPieceColor(e)
    verifyUserClicks(translatedCoords, pieceColor)
}) //main


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
} //main


async function mainController() {
    const move = await getMoveObject()
    checkController()
    enPassantController()
    if (move) {
        castlingController(move)
        if (move.captured) {
            if (move.flags.includes('e')){
                enPassantUIController()
            }else{
                makeCapture()
            }
        }
        movePieceController()
        gameOverController()
    }
} //main


// =====================================================================================================
