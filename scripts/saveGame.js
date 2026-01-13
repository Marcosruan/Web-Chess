import {chess} from './main.js'

localStorage?.removeItem('prompts_storage')

const globals = {
    index: localStorage.length
}


export function localStorageController(){
    if (isLocalStorageEmpty) return
}


function isLocalStorageEmpty(){
    return localStorage.length === 0
}


export function saveFen(fen){
    localStorage.setItem(globals.index, fen)
    globals.index++

    console.log(`FEN salvo no índice: ${globals.index - 1}
        ${fen}`)
}


export function clearLocalStorage(){
    localStorage.clear()
    globals.index = 0
}
