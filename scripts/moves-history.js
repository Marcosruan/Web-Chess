import { isWhiteToMove } from './utils.js'

const movesHistory = document.querySelectorAll('.moves-history')

const globals = {
    index: 0
}

export function movesHistoryController(text){
    let color
    if (isWhiteToMove()) color = 'black-color'
    else color = 'white-color'
    clearActiveHistory()
    updateHistoryLog(text, color)
}


function clearActiveHistory(){
    movesHistory.forEach(ul =>{
        const activeLi = ul?.querySelector('.active-history')
        activeLi?.classList.remove('active-history')
    })
}

function updateHistoryLog(text, color){
    movesHistory.forEach(ul => {
        const li = Object.assign(document.createElement("li"), { className: `history ${color} ${globals.index} active-history`, textContent: `${text}` })
        ul?.appendChild(li);
    })
    saveGlobals()
}

export function initLiMovesIndex(){
    const savedGlobal = JSON.parse(localStorage.getItem('movesLiIndex'));
    globals.index = savedGlobal ? savedGlobal.index : 0;
}

export function resetLiMovesIndex(){
    globals.index = 0;
    localStorage.getItem('movesLiIndex', JSON.stringify(globals));
}

function saveGlobals(){
    globals.index++;
    localStorage.setItem('movesLiIndex', JSON.stringify(globals));
}

export function reloadHistoryLog(){
    const movesList = JSON.parse(localStorage.getItem('history'))
    if (!movesList) return
    for (let i = 0; i < movesList.length; i++){
        const color = i%2==0 ? 'white-color': 'black-color'
        clearActiveHistory()
        updateHistoryLog(movesList[i], color)
    }
}

export function clearHistoryLog(){
    movesHistory.forEach(ul =>{
        ul?.replaceChildren()
    })
}
