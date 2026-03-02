# ♟️ Web Chess

## Descrição

Desenvolvi este projeto com o intuito de aprender fundamentos do frontend (html, css e js). Consiste em um xadrez em um servidor local para 2 jogadores no mesmo dispositivo.

## ⚙️ Funcionalidades

### ♟️ tabuleiro

    - O tabuleiro gira a cada lance feito
    - No tabuleiro ficam registradas as peças capturas pelos jogadores

### 📒 Registro de lances

    - Existe um botão de configurações, no qual é possível efetuar as seguintes funções
        - Alternar entre tabuleiro giratório e tabuleiro estático
        - Alternar entre com ou sem efeitos sonoros
        - Restaurar o jogo para a posição inicial, na intenção de começar uma nova partida

### 🎮 Jogo

    - Todas as regras do xadrez clássico
    - Movimentos no clique ou no arrastar e soltar

## 🛠️ Sugestões de melhoria

    - Adicionar cronômetro 
    - Login de usuário
    - Tema claro e escuro
    - Atualização visual da página
    - IA para analizar as partidas
    - Salvar partidas
    - Aprimoramento do arrastar e soltar de peças 

## 🚀 Como executar

1. Clone o repositório
    ```sh
    git clone https://github.com/Marcosruan/Web-Chess.git
    ```

2. inicialize o Docker

    - Certifique-se de abrir o programa do Docker
    - Na pasta do projeto (importante), abra o terminal e execute:

    ```sh
    docker-compose up -d
    ```

3. Acesse a aplicação

    - Abra o seu navegador e acesse:

    ```sh
    http://localhost:8080
    ```

---

## 📁 **Estrutura de diretórios**

```markdown

WEB CHESS/
├── assets/
│   ├── audio/...
│   ├── icons/...
│   ├── img/...
│   └── pieces/...
├── game/
│   ├── game-rules.js
│   ├── main.js
│   ├── ui.js
├── scripts/
│   ├── arrows.js
│   ├── audio.js
│   ├── drag-and-drop.js
│   ├── game-over.js
│   ├── modal.js
│   ├── moves-history.js
│   ├── piece-advantage-value.js
│   ├── save-game.js
│   └── utils.js
├── styles/
│   ├── desktops/
│   |   ├── board.css 
│   |   └── log_panels.css
│   ├── mobile/
│   |   ├── board.css 
│   |   └── log_panels.css
│   ├── tablets/
│   |   ├── board.css 
│   |   └── log_panels.css
│   ├── coords.css
│   ├── game-over-display.css
│   ├── global.css
│   ├── index.css
│   ├── modal.css
│   ├── pieces.css
│   └── utility.css
├── index.html
└── README.md
```

---

## 🖥️ **Tecnologias usadas**

![JavaScript](https://img.shields.io/badge/JavaScript-yellow?style=for-the-badge&logo=javascript&logoColor=white)
![HTML](https://img.shields.io/badge/HTML-orange?style=for-the-badge&logo=html&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-007ACC?style=for-the-badge&logo=css&logoColor=white)
![Git](https://img.shields.io/badge/Git-red?style=for-the-badge&logo=git&logoColor=white)
![Chess.js](https://img.shields.io/badge/Chess.js-pink?style=for-the-badge&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-blue?style=for-the-badge&logo=docker&logoColor=white)

## 🗃️ **Versão**

    - 1.0.0

## 👨‍💻 Autor

- **Marcos Ruan V. de Figueiredo**  
  [@Marcosruan](https://github.com/Marcosruan)

## 🏛️ **Licença**

    - Distribuído sob a licença GPL2. Acesse `LICENSE.txt` para mais informações.
