import { elements, chess } from '../game/main.js';
import { toDefaultPositionController } from './saveGame.js';

const gameOverDisplay = document.querySelector('#game-over-display');
const playAgain = document.getElementById('play-again-button');
const explore = document.getElementById('explore-button');

export function createGameOverParagraph(reason){
    setGameOverTrue()
    clearParags()
    const color = getWinnerColor()
    gameOverDisplay.style.display = "flex";
    const p1 = Object.assign(document.createElement('p'), {className: 'game-over-p', textContent: `${color} wins`});
    const p2 = Object.assign(document.createElement('p'), {className: 'game-over-p', textContent: `Game is over by ${reason}`});
    gameOverDisplay?.prepend(p1, p2);
}

function clearParags(){
    const parags = gameOverDisplay.querySelectorAll('.game-over-p');
    parags?.forEach(parag => {
        parag.remove();
    });
}

function getWinnerColor(){
    let color = 'Nobody';
    if (chess.isCheckmate()){
        if (chess.turn() === 'w') color = 'Black'
        else color = 'White'
    }
    return color;
}

export function setGameOverTrue(){
    elements.gameOver = true
    localStorage.setItem('gameOver', true)
}

export function setGameOverFalse(){
    elements.gameOver = false;
    localStorage.setItem('gameOver', false);
}

playAgain?.addEventListener('click', () =>{
    gameOverDisplay.style.display = "none";
    toDefaultPositionController();
});

explore?.addEventListener('click', () =>{
    gameOverDisplay.style.display = "none";
});
