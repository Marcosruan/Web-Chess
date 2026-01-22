import { toDefaultPositionController } from './saveGame.js';
const modal = document.querySelector("#modal");
const button = document.querySelector("#settings-button");
const mobileButton = document.querySelector("#mobile-settings-button");
const resetBtn = document.getElementById('reset-button');

resetBtn?.addEventListener('click', toDefaultPositionController);

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
