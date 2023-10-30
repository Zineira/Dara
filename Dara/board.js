const rightbox = document.querySelector('.rightbox');
const pieces = document.querySelector('.pieces');
const colors = ['#123456'];


function createBoard(element){
    element.innerHTML = '';

    const SQUARES_NUM_1= document.getElementById('board_size').value;
    const board_size = document.getElementById('board');
    if (SQUARES_NUM_1 === 'board1'){
        board_size.style.gridTemplateColumns = 'repeat(6, 50px)';
        board_size.style.gridTemplateRows = 'repeat(5, 50px)';
        for(let i =0;i <6*5;i++){
            const square = document.createElement('div');
            square.classList.add('square')

            square.addEventListener('mouseover', () => setColor(square))
            square.addEventListener('mouseout', () => resetColor(square))

            element.append(square)
        }
    }else if(SQUARES_NUM_1 === 'board2'){
        board_size.style.gridTemplateColumns = 'repeat(6, 50px)';
        board_size.style.gridTemplateRows = 'repeat(6, 50px)';
        for(let i =0;i <6*6;i++){
            const square = document.createElement('div');
            square.classList.add('square')

            square.addEventListener('mouseover', () => setColor(square))
            square.addEventListener('mouseout', () => resetColor(square))

            element.append(square)
        }
    }    
}

// Crie e posicione as peças na "rightbox"
function createPiece(color) {
    const piece = document.createElement("div");
    if (color === 'white') {
        piece.className = "game-piece white-piece";  // Adicione a classe 'white-piece'
    } else {
        piece.className = "game-piece black-piece";  // Adicione a classe 'black-piece'
    }
    piece.className = "game-piece " + color;
    piece.style.backgroundColor = color === 'white' ? 'white' : 'black';
    return piece;
}

// Lista de peças (12 brancas e 12 pretas)
const piece_list = [];
for (let i = 0; i < 12; i++) {
    piece_list.push(createPiece("white"));
}
for (let i = 0; i < 12; i++) {
    piece_list.push(createPiece("black"));
}

// Adicionar peças ao container
piece_list.forEach(piece => pieces.appendChild(piece));

function setColor(element) {
    const color = getRandomColor();
    element.style.backgroundColor = color;
}

function resetColor(element) {
    element.style.backgroundColor = 'rgba(104, 160, 229, 0)';
}

function getRandomColor() {
    const index = Math.floor(Math.random() * colors.length);
    return colors[index];
}

window.onload = () => {
    const instructionsButton = document.getElementById('instrbutton');
    const rankingButton = document.getElementById('rankbutton');
    const playButton = document.getElementById('play');
    const board = document.getElementById('board');
    const rulesbox = document.querySelector('.rules');
    const mainbox = document.querySelector('.box-main');
    const scorebox = document.querySelector('.score');
    const overlay = document.querySelector('.overlay');

    instructionsButton.addEventListener('click', function() {
        if (rulesbox.style.display != 'block') {
            rulesbox.style.display = 'block';
            mainbox.style.display = 'none';
            scorebox.style.display = 'none';
            overlay.style.display = 'block'; // Mostra a cobertura
        } else {
            rulesbox.style.display = 'none';
            mainbox.style.display = 'grid';
            scorebox.style.display = 'none';
            overlay.style.display = 'none'; // Oculta a cobertura
        }
    });

    rankingButton.addEventListener('click', function() {
        if (scorebox.style.display != 'block') {
            scorebox.style.display = 'block';
            mainbox.style.display = 'none';
            rulesbox.style.display = 'none';
            overlay.style.display = 'block'; // Mostra a cobertura
        } else {
            scorebox.style.display = 'none';
            mainbox.style.display = 'grid';
            rulesbox.style.display = 'none';
            overlay.style.display = 'none'; // Oculta a cobertura
        }
    });
    playButton.addEventListener('click', function(){
        console.log("Botão Jogar clicado");
        if (mainbox.style.display !== 'none') {
            if (board.style.display !== 'grid') {
                board.style.display = 'grid';
                if (!board.hasChildNodes()) {  // Verifica se o tabuleiro já foi criado
                    createBoard(board);
                }
            } else {
                board.style.display = 'none';
            }
        }
        pieces.style.display= 'flex'; 
        resetButton.style.display = 'block';
    });

    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', function(){
    // Limpa o tabuleiro
    board.innerHTML = '';
    // Reseta as configurações
    document.getElementById('board_size').value = 'None';
    document.getElementById('oponents').value = 'None';
    document.getElementById('firstsecond').value = 'None';
    document.getElementById('difficulty').value = 'None';
    // Oculta o botão reset
    pieces.style.display= 'none'; 
    resetButton.style.display = 'none';
});
    // Adicione um evento de clique na cobertura para fechar as instruções ou o ranking
    overlay.addEventListener('click', function() {
        rulesbox.style.display = 'none';
        mainbox.style.display = 'grid';
        scorebox.style.display = 'none';
        overlay.style.display = 'none';
    });
};


const playerInfo = document.getElementById('player-info');
const playerName = document.getElementById('player-name');
const playerPiece = document.getElementById('player-piece');

const opponentInfo = document.getElementById('opponent-info');
const opponentName = document.getElementById('opponent-name');
const opponentPiece = document.getElementById('opponent-piece');

// Define as informações do jogador
playerName.textContent = "Player1";  // Substitua "Seu Nome" pelo nome do jogador
playerPiece.textContent = "Peças Brancas";

// Define as informações do oponente (pode ser outro jogador ou computador)
opponentName.textContent = "Player2";  // Substitua "Oponente" pelo nome do oponente
opponentPiece.textContent = "Peças Pretas";