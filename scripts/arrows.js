import { chess , checkController } from '../game/main.js'
import { createCheckmateDisplay } from '../game/ui.js'
import { updateBoardByFen, clearBoard } from './save-game.js';
import { setGameOverTrue, setGameOverFalse } from './game-over.js';

const mobile_moves_history = document.getElementById('mobile-moves-history')
const moves_history = document.getElementById('moves-history')
const prev_button = document.querySelector('#prev-button');
const next_button = document.querySelector('#next-button');
const mobile_prev_button = document.querySelector('#mobile-prev-button');
const mobile_next_button = document.querySelector('#mobile-next-button');

const globals = {
    index: 0
}

mobile_moves_history.addEventListener('click', (e) => {
    goToMoveByClickController(e)
})

moves_history.addEventListener('click', (e) => {
    goToMoveByClickController(e)
})

function goToMoveByClickController(e, mobile){
    if (!(e.target.classList.contains('history'))) return
    const fenList = JSON.parse(localStorage.getItem('fen'));
    const index = parseInt(e.target.classList[2]);
    const moveIndex = index + 1
    const fenTarget = fenList.at(moveIndex);
    const lastFen = fenList.at(-1);
    isLastPosition(lastFen, fenTarget);
    initIndexByClick(index - fenList.length)
    changeActiveLogByClick(e.target, mobile);
    updateBoardController(fenTarget);
    saveGlobal();
}

function initIndexByClick(newIndex){
    globals.index = newIndex + 2;
}

function changeActiveLogByClick(li){
    const atuais = document.querySelectorAll('.active-history');
    atuais.forEach(atual => {
        atual.classList?.remove('active-history');
        li.classList?.add('active-history');
    })
}

prev_button.addEventListener('click', prevController);

next_button.addEventListener('click', nextController);

mobile_prev_button.addEventListener('click', prevController);

mobile_next_button.addEventListener('click', nextController);

function prevController(){
    prevNextController(true)
}

function nextController(){
    prevNextController(false)
}

function prevNextController(prev){
    initIndex(prev);
    const fenList = JSON.parse(localStorage.getItem('fen'));
    const firstFen = fenList.at(0);
    const lastFen = fenList.at(-1);
    const fenTarget = fenList.at(globals.index - 1);
    if (isArrowActionImpossible(firstFen, fenTarget, prev)) return
    isLastPosition(lastFen, fenTarget)
    changeActiveLog(prev);
    updateBoardController(fenTarget);
    saveGlobal();
}

function initIndex(prev){
    if (prev) globals.index--;
    else globals.index++;
}

function isLastPosition(lastFen, fenTarget){
    if (lastFen === fenTarget) setGameOverFalse();
    else setGameOverTrue()
}

function isArrowActionImpossible(firstFen, fenTarget, prev){
    if (firstFen === fenTarget || !fenTarget){
        if (prev) initIndex(false);
        else initIndex(true);
        return true
    }
    return false
}

function changeActiveLog(prev){
    const atuais = document.querySelectorAll('.active-history');
    atuais.forEach(atual => {
        atual.classList?.remove('active-history');
        const target = prev ? atual.previousElementSibling : atual.nextElementSibling;
        target.classList?.add('active-history');
    })
}

function updateBoardController(fen){
    clearBoard();
    const fenPart = fen.split(' ');
    chess.load(fen);
    updateBoardByFen(fenPart[0]);
    checkController()
    if (chess.isCheckmate()) createCheckmateDisplay();
}

function saveGlobal(){
    localStorage.setItem('movesLogIndex', JSON.stringify(globals));
}
