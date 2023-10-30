const rightbox = document.querySelector('.rightbox');
const pieces = document.querySelector('.pieces');
const colors = ['#123456'];
let opponentsSelect; // Declaração da variável opponentsSelect
let difficultySelect; // Declaração da variável difficultySelect


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
// funçoes dos botões

function checkSelections() {
    const boardSizeSelect = document.getElementById('board_size');
    const opponentsSelect = document.getElementById('oponents');
    const firstSecondSelect = document.getElementById('firstsecond');
    const difficultySelect = document.getElementById('difficulty');
    const playButton = document.getElementById('play');
    
    if (opponentsSelect.value === 'twoplayer') {
        // Se o adversário for um jogador humano, oculte a seleção de dificuldade
        difficultySelect.style.display = 'none';
    } else {
        // Se o adversário for um bot, exiba a seleção de dificuldade
        difficultySelect.style.display = 'inline-block';
    }

    if (
        boardSizeSelect.value === 'None' ||
        opponentsSelect.value === 'None' || 
        firstSecondSelect.value === 'None'
    ) {
        playButton.disabled = true;
    } else {
        playButton.disabled = false;
    }
    updateBotName();
}
function updateBotName() {
    const opponentsValue = opponentsSelect.value;
    const difficultyValue = difficultySelect.value;
    const difficultyText = difficultyValue.charAt(0).toUpperCase() + difficultyValue.slice(1);  // Capitalize o primeiro caractere

    if (opponentsValue === 'oneplayer') {
        opponentName.textContent = "Bot " + difficultyText;
    } else {
        opponentName.textContent = "Player2";
    }
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

    
    //Regras
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
    //pontuaçoes
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
    //jogar
    const boardSizeSelect = document.getElementById('board_size');
    opponentsSelect = document.getElementById('oponents');
    const firstSecondSelect = document.getElementById('firstsecond');
    difficultySelect = document.getElementById('difficulty');

    boardSizeSelect.addEventListener('change', checkSelections);
    opponentsSelect.addEventListener('change', checkSelections);
    firstSecondSelect.addEventListener('change', checkSelections);
    difficultySelect.addEventListener('change', checkSelections);

    checkSelections();
    
    playButton.addEventListener('click', function(){
        opponentsSelect = document.getElementById('oponents'); // Atualiza a variável opponentsSelect
        checkSelections();
        if (mainbox.style.display !== 'none') {
            // Sempre exiba a board como uma grid quando o botão "Jogar" for clicado
            board.style.display = 'grid';
            // Sempre crie (ou recrie) o tabuleiro quando o botão "Jogar" for clicado
            createBoard(board);
            pieces.style.display= 'flex'; 
            resetButton.style.display = 'block';
        }
        const playerBox = document.querySelector('.player-box');
        const whitePlayer = document.querySelector('.white-player');
        const blackPlayer = document.querySelector('.black-player');
    
        // Mostrar a caixa de informação do jogador
        playerBox.style.display = 'flex';
    
        // Posicionar os elementos do jogador de acordo com a seleção
        const firstSecondValue = firstSecondSelect.value;
        if (firstSecondValue === 'white') {
            whitePlayer.style.order = '1';  // A ordem de flex é 1 para o jogador branco
            blackPlayer.style.order = '2';  // A ordem de flex é 2 para o jogador preto
        } else if (firstSecondValue === 'black') {
            whitePlayer.style.order = '2';  // A ordem de flex é 2 para o jogador branco
            blackPlayer.style.order = '1';  // A ordem de flex é 1 para o jogador preto
        }
        boardSizeSelect.disabled = true;
        opponentsSelect.disabled = true;
        firstSecondSelect.disabled = true;
        difficultySelect.disabled = true;
    });
    // reset
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', function(){
        board.innerHTML = '';
        playButton.disabled = true;
        document.getElementById('board_size').value = 'None';
        document.getElementById('oponents').value = 'None';
        document.getElementById('firstsecond').value = 'None';
        document.getElementById('difficulty').value = 'None';
        boardSizeSelect.disabled = false;
        opponentsSelect.disabled = false;
        firstSecondSelect.disabled = false;
        difficultySelect.disabled = false;
        pieces.style.display= 'none'; 
        resetButton.style.display = 'none';
    
    });
    const opponentDifficulty = document.getElementById('opponent-difficulty');

    


// Defina o valor inicial
opponentsSelect.dispatchEvent(new Event('change'));
    
    overlay.addEventListener('click', function() {
        rulesbox.style.display = 'none';
        mainbox.style.display = 'grid';
        scorebox.style.display = 'none';
        overlay.style.display = 'none';
    });
};

//overlays dos jogadores

const playerInfo = document.getElementById('player-info');
const playerName = document.querySelector('.white-player .player-name');
const playerPiece = document.getElementById('player-piece');

const opponentInfo = document.getElementById('opponent-info');
const opponentName = document.querySelector('.black-player .player-name');
const opponentPiece = document.getElementById('opponent-piece');

// Define as informações do jogador
playerName.textContent = "Player1";  // Substitua "Seu Nome" pelo nome do jogador
playerPiece.textContent = "Peças Brancas";

// Define as informações do oponente (pode ser outro jogador ou computador)
opponentName.textContent = "Bot";  // Substitua "Oponente" pelo nome do oponente
opponentPiece.textContent = "Peças Pretas";