let game;
let pieces = document.querySelector(".pieces-container")
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
        opponentName.textContent = "Player1";
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
    
    
    //Regras
    instructionsButton.addEventListener('click', function() {
        if (rulesbox.style.display != 'block') {
            rulesbox.style.display = 'block';
            mainbox.style.display = 'none';
            scorebox.style.display = 'none';
            
        } else {
            rulesbox.style.display = 'none';
            mainbox.style.display = 'grid';
            scorebox.style.display = 'none';
           
        }
    });
    //pontuaçoes
    rankingButton.addEventListener('click', function() {
        if (scorebox.style.display != 'block') {
            scorebox.style.display = 'block';
            mainbox.style.display = 'none';
            rulesbox.style.display = 'none';
            
        } else {
            scorebox.style.display = 'none';
            mainbox.style.display = 'grid';
            rulesbox.style.display = 'none';
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
        game = new Game();
        checkSelections();
        
        if (mainbox.style.display !== 'none') {
            board.style.display = 'grid';
            resetButton.style.display = 'block';
        }else{
            if (rulesbox.style.display !== 'none') {
                rulesbox.style.display = 'none';
                mainbox.style.display = 'grid';
            }
        
            if (scorebox.style.display !== 'none') {
                scorebox.style.display = 'none';
                mainbox.style.display = 'grid';
            }
        }
        game.board.createBoard(document.getElementById('board'));
        console.log(game.board.boardState);
        game.pieces.initializePieces();
        
        boardSizeSelect.disabled = true;
        opponentsSelect.disabled = true;
        firstSecondSelect.disabled = true;
        difficultySelect.disabled = true;


        pieces.style.display = 'flex';

        const playerBox = document.querySelector('.player-box');
        playerBox.style.display = 'flex';
    
        const firstSecondValue = firstSecondSelect.value;
        if (firstSecondValue === 'white') {
            playerName.textContent = "Player1";
            opponentName.textContent = "Bot";
            updateBotName();
        } else if (firstSecondValue === 'black') {
            playerName.textContent = "Bot";
            opponentName.textContent = "Player1";
        }

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
        game.pieces.initializePieces();
        resetButton.style.display = 'none';
        const playerBox = document.querySelector('.player-box');
        playerBox.style.display = 'none';

    
    });
    const opponentDifficulty = document.getElementById('opponent-difficulty');

    


// Defina o valor inicial
opponentsSelect.dispatchEvent(new Event('change'));
    
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


// Define as informações do oponente (pode ser outro jogador ou computador)
opponentName.textContent = "Bot";  // Substitua "Oponente" pelo nome do oponente