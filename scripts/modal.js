// Modal ON or OFF
const modal = document.querySelector("#modal");
const button = document.querySelector("#settings-button");
const mobileButton = document.querySelector("#mobile-settings-button");

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

// Theme button
const themeButton = document.querySelector("#theme-mode")


// Reset button
const resetButton = document.querySelector("#reset-button")
const board = document.querySelector("#chess-board")

const rect = board.getBoundingClientRect();

const largura = rect.width;
const altura = rect.height;

board.addEventListener('drop', (e) => {
    const boardRect = board.getBoundingClientRect();
    const numCols = 8; 

    const cellWidth = boardRect.width / numCols;
    const cellHeight = boardRect.height / numCols;

    const xInsideBoard = e.clientX - boardRect.left;
    const yInsideBoard = e.clientY - boardRect.bottom;

    const coordX = Math.floor(xInsideBoard / cellWidth) + 1;
    const coordY = Math.floor(yInsideBoard / cellHeight) * -1;
    
    console.log(`Peça movida para a coordenada (X, Y): (${coordX}, ${coordY})`);
});

board.addEventListener('dragover', (e) => {
    e.preventDefault(); 
    e.dataTransfer.dropEffect = "move"; 
});

// resetButton.addEventListener('click', () => {
//     const pieces = [
//         "wrq", "a1",

//     ]
//     // lembrar de resetar o chess.js ----------------------------------------------------------------------------
//     newDiv = document.createElement("div")
//     newDiv.classList.add("pieces", "wrq", "a1")
//     newDiv.setAttribute('draggable', 'true')
//     board.appendChild(newDiv)
// })