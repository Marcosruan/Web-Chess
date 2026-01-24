import { elements } from '../game/main.js';
import { toDefaultPositionController } from './saveGame.js';

const gameOverDisplay = document.querySelector('#game-over-display');
const playAgain = document.getElementById('play-again-button');
const explore = document.getElementById('explore-button');

export function createGameOverParagraph(reason){
    setGameOverTrue()
    gameOverDisplay.style.display = "block";
    const p = Object.assign(document.createElement('p'), {className: 'game-over-p', textContent: `Game is over by ${reason}`});
    gameOverDisplay?.prepend(p);
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
