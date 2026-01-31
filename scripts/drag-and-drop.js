import { elements } from "../game/main.js";

elements.board.addEventListener('dragstart', (e) => {
    e.dataTransfer.effectAllowed = "move";
    e.target.classList.remove('highlight');
    e.target.classList.add('bgc-transparent');
    setTimeout(() => {
        e.target.style.opacity = 0; 
    }, 0);
    console.log('start');
});

elements.board.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.dropEffect = "move";
});

elements.board.addEventListener('dragend', (e) => {
    e.target.classList.remove('bgc-transparent');
    e.target.classList.add('highlight');
    e.target.style.opacity = 1; 
    console.log('end')
});