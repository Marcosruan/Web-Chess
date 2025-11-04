const BLACK_PAWN_1  = document.getElementById("pawn-b-1")
const teste  = document.getElementById("square-16")

// ---------------------------------------------------------------------

// Evento disparado quando o usuário começa a arrastar o elemento
BLACK_PAWN_1.addEventListener('dragstart', (evento) => {
    // Armazena o ID do elemento que está sendo arrastado
    evento.dataTransfer.setData('text/plain', evento.target.id);
    // Adiciona uma pequena pausa para o navegador capturar a imagem visualmente
    setTimeout(() => {
        evento.target.style.cursor = 'grab';
        evento.target.style.opacity = '0.5'; // Adiciona opacidade enquanto arrasta
    }, 0);
});

// Evento disparado quando o arrasto termina (solta ou cancela)
BLACK_PAWN_1.addEventListener('dragend', (evento) => {
    evento.target.style.opacity = '1';
    evento.target.style.cursor = 'grab';
});

// Evento disparado quando o elemento arrastado entra na área de soltar
teste.addEventListener('dragover', (evento) => {
    evento.preventDefault(); // Previne o comportamento padrão (que é não permitir soltar)
    teste.classList.add('drag-over');
});

teste.addEventListener('drag', (evento) => {
    evento.target.style.cursor = 'grabbing';
});

// Evento disparado quando o elemento arrastado sai da área de soltar
teste.addEventListener('dragleave', () => {
    teste.classList.remove('drag-over');
});

// Evento disparado quando o elemento é solto na área
teste.addEventListener('drop', (evento) => {
    evento.preventDefault();
    teste.classList.remove('drag-over');

    // Obtém o ID do elemento arrastado
    const id = evento.dataTransfer.getData('text/plain');
    const elementoArrastado = document.getElementById(id);

    // Move o elemento para dentro da área de soltar
    teste.appendChild(elementoArrastado);
});
