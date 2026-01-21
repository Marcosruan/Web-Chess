import { chess, elements } from './main.js'
import { movesHistoryController, reloadHistoryLog, clearHistoryLog } from './movesHistory.js'
import { reloadCapturedPieceList, reloadAdvantageValues, clearScore, updateScoreUI, resetVariables } from './pieceAdvantageValue.js'

localStorage?.removeItem('prompts_storage') 


const globals = {
    position: null,
    turn: null,
    castling: null, 
    enPassant: null,
    halvesMoves: null,
    fullMoves: null
}


function initFenVariables(fen){
    if (!fen) return
    const fenParts = fen.split(" ")
    globals.position = fenParts[0]
    globals.turn = fenParts[1]
    globals.castling = fenParts[2]
    globals.enPassant = fenParts[3]
    globals.halvesMoves = fenParts[4]
    globals.fullMoves = fenParts[5]
    saveHistory()
    saveGlobals()
}


export function localStorageController(){
    if (isLocalStorageEmpty()) toDefaultPositionController()
    else toSavedPosition()
}


function toSavedPosition(){
    const fen = JSON.parse(localStorage.getItem('fen')).at(-1)
    chess.load(fen)
    initFenVariables(fen)
    updateBoardByFen(globals.position)
    reloadHistoryLog()
    clearScore()
    reloadCapturedPieceList()
    reloadAdvantageValues()
    updateScoreUI()
}


export function toDefaultPositionController(){
    clearBoard()
    clearLocalStorage()
    const defaultFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    chess.load(defaultFen)
    saveFen(defaultFen)
    updateBoardByFen(globals.position)
    clearHistoryLog()
    clearScore()
    resetVariables()
}


function clearBoard(){
    elements.board?.replaceChildren()
}


function updateBoardByFen(fen){
    let y = 8, index = 0
    for (y; y > 0; y--){
        let x = 0
        while (fen[index] && fen[index] !== '/') {
            if (!isNumeric(fen[index])){
                const coord = translateFenIndex(x, y)
                updateUIController(coord, fen[index])
            }
            x += updateXCoord(fen[index])
            index++
        }
        index++
    }
}


function translateFenIndex(x, y){
    const lista = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    return `${lista[x]}${y}`
}


function updateUIController(coord, fenValue){
    if (isNumeric(fenValue)) return
    const colorNType = getColorNTypeByFen(fenValue)
    updateUI(coord, colorNType)
} 


function isNumeric(value){
    return !isNaN(value) && value !== "";
} 


function getColorNTypeByFen(fenValue){
    const re = /[RNQKBP]/
    let color
    if (re.test(fenValue)) color = 'w'
    else color = 'b'
    const types = {R: 'r', N: 'n', B: 'b', Q: 'q', K: 'k', P: 'p'}
    const type = `${color}${types[fenValue.toUpperCase()]}`
    return {color: color, type: type}
}


function updateUI(coord, colorNType){
    const element = Object.assign(document.createElement("div"), { className: `pieces ${colorNType.color} ${colorNType.type} ${coord}`})
    elements.board?.appendChild(element)
} 


function updateXCoord(fenValue){
    if (isNumeric(fenValue)) return convertToNumber(fenValue)
    else return 1 
}


function convertToNumber(value){
    let result = Number(value)
    if (Number.isNaN(result)) return "Error: Couldn't covert to number"    
    return result
}


function saveHistory(){
    const history = chess.history().at(-1)
    if (!history) return
    const addNewHistory = JSON.parse(localStorage.getItem('history') || '[]')
    addNewHistory.push(history)
    localStorage.setItem('history', JSON.stringify(addNewHistory))
    movesHistoryController(history)
}


export function saveFen(fen){
    const addNewFen = JSON.parse(localStorage.getItem('fen') || '[]')
    addNewFen.push(fen)
    localStorage.setItem('fen', JSON.stringify(addNewFen))
    initFenVariables(fen)
}


function saveGlobals(){
    localStorage.setItem('globals', JSON.stringify(globals))
}


function isLocalStorageEmpty(){
    return localStorage.length === 0
}


function clearLocalStorage(){
    localStorage.clear()
}
