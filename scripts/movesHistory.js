import { isWhiteToMove } from './utils.js'

const movesHistory = document.querySelectorAll('.moves-history')


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
        const li = Object.assign(document.createElement("li"), { className: `history ${color} active-history`})
        li.textContent = `${text}`
        ul?.appendChild(li)     
    })
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
