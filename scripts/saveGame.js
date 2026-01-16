import { elements } from './main.js'

localStorage?.removeItem('prompts_storage') 

const globals = {
    index: localStorage.length,
    position: null,
    turn: null,
    castling: null, 
    enPassant: null,
    halvesMoves: null,
    moves: null
}


export function localStorageController(){
    if (isLocalStorageEmpty) toDefaultPosition()
    else toSavedPosition()
}


export function initFenVariables(fen){
    if (!fen) return
    const fenParts = fen.split(" ")
    globals.position = fenParts[0]
    globals.turn = fenParts[1]
    globals.castling = fenParts[2]
    globals.enPassant = fenParts[3]
    globals.halvesMoves = fenParts[4]
    globals.fullMoves = fenParts[5]
    saveFen(fen)
}


function toSavedPosition(){

}


export function toDefaultPositionController(){
    clearBoard()
    const defaultFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    initFenVariables(defaultFen)
    updateBoardByFen(globals.position)
    clearLocalStorage()
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
            index++
            x += updateXCoord(fen[index])
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
    updateUI(coord, colorNType, fenValue)
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


function updateUI(coord, colorNType, fenValue){
    const element = Object.assign(document.createElement("div"), { className: `pieces ${colorNType.color} ${coord} ${fenValue} ${colorNType.type}`})
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


function saveFen(fen){
    localStorage.setItem(globals.index, fen)
    globals.index++
    console.log(`FEN salvo no índice: ${globals.index - 1}
        ${fen}`)
}


function isLocalStorageEmpty(){
    return localStorage.length === 0
}


function clearLocalStorage(){
    localStorage.clear()
    globals.index = 0
}
