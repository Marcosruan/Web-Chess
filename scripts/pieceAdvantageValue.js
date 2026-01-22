const oponentScore = document.querySelector('#oponent-score-p')
const playerScore = document.querySelector('#player-score-p')

const values = {
    black: 0,
    white: 0
}


const capturedPieceList = {
    black: [],
    white: []
}


export function capturedPieceTypeController(victim){
    const piece = victim.classList[2]
    const colorNtype = piece.split('')
    const specialCaracter = translatePieceType(colorNtype[1])
    initCapturedPieceList(colorNtype[0], specialCaracter)
    saveCapturedPieceList()
    advantageValueController(colorNtype)
    clearScore()
    updateScoreUI()
}


function initCapturedPieceList(color, specialCaracter){
    if (color === 'w') capturedPieceList.black.push(specialCaracter)
    else capturedPieceList.white.push(specialCaracter)
}


function saveCapturedPieceList(){
    localStorage.setItem('capturedPieceList', JSON.stringify(capturedPieceList))
}


function translatePieceType(piece){
    const types = {r: '♖', n: '♘', b: '♗', q: '♕', p: '♙'}
    return types[piece]
}


function advantageValueController(piece){
    const value = getPieceValue(piece[1])
    initAdvantageValue(piece[0], value)
    saveAdvantageValue()
}


function getPieceValue(piece){
    const types = {r: 5, n: 3, b: 3, q: 9, p: 1}
    return types[piece]
}


function initAdvantageValue(color, value){
    if (color[0] === 'w') values.black += value
    else values.white += value
}


function saveAdvantageValue(){
    localStorage.setItem('advantageValue', JSON.stringify(values))
}


export function updateScoreUI(){ // refatorar ----------------------------------------------------
    const { white:whiteList, black:blackList} = capturedPieceList
    const {white:whiteValue, black:blackValue} = values
    if (blackList.length > 0){
        for (let i = 0; i < blackList.length; i++){
            const li = document.createElement("li")
            li.textContent = `${blackList[i]}`
            oponentScore.appendChild(li)
        }
    }
    if (whiteList.length > 0){
        for (let i = 0; i < whiteList.length; i++){
            const li = document.createElement("li")
            li.textContent = `${whiteList[i]}`
            playerScore.appendChild(li)
        }
    }
    const subtractionValue = whiteValue - blackValue
    if (subtractionValue === 0) return
    if (subtractionValue > 0){
        const li = document.createElement("li")
        li.textContent = `+${subtractionValue}`
        playerScore.prepend(li)
    }else{
        const li = document.createElement("li")
        li.textContent = `+${-subtractionValue}`
        oponentScore.appendChild(li)
    }
}


export function reloadCapturedPieceList(){
    const pieceList = JSON.parse(localStorage.getItem('capturedPieceList'))
    if (!pieceList) return
    const { white, black } = pieceList
    if (black.length > 0) capturedPieceList.black.push(...black)
    if (white.length > 0) capturedPieceList.white.push(...white)
}


export function reloadAdvantageValues(){
    const advantageValue = JSON.parse(localStorage.getItem('advantageValue'))
    if (!advantageValue) return
    const { white, black } = advantageValue
    values.black = black
    values.white = white
}


export function clearScore(){
    oponentScore?.replaceChildren()
    playerScore?.replaceChildren()
}


export function resetVariables(){
    values.black = 0
    values.white = 0
    capturedPieceList.black = []
    capturedPieceList.white = []
}
