import { toDefaultPositionController } from './save-game.js';
import { elements } from '../game/main.js';
const modal = document.querySelector("#modal");
const button = document.querySelector("#settings-button");
const mobileButton = document.querySelector("#mobile-settings-button");
const resetBtn = document.getElementById('reset-button');
const soundBtn = document.getElementById('sound-button');
const flipBtn = document.getElementById('flip-button');

resetBtn?.addEventListener('click', toDefaultPositionController);

soundBtn?.addEventListener('click', toggleSound);

function toggleSound(){
    if (elements.sound) {
        elements.sound = false;
        soundBtn.textContent = 'Turn On';
    }else {
        elements.sound = true;
        soundBtn.textContent = 'Turn Off';
    }
}

flipBtn?.addEventListener('click', toggleFlip);

function toggleFlip(){
    if (elements.flip) {
        elements.flip = false;
        flipBtn.textContent = 'Turn On';
    }else {
        elements.flip = true;
        flipBtn.textContent = 'Turn Off';
    }
}

button.addEventListener("click", () => {
    modal.style.display = "block";
});

mobileButton.addEventListener("click", () => {
    modal.style.display = "block";
});

window.addEventListener("click", (e) => {
    if (e.target == modal) {
        modal.style.display = "none";
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
        modal.style.display = "none";
    }
});
