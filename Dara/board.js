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
}

window.onload = () => {
    const instructionsButton = document.getElementById('instrbutton');
    const rankingButton = document.getElementById('rankbutton');
    const playButton = document.getElementById('play');
    const board = document.getElementById('board');
    const rulesbox = document.querySelector('.rules');
    const mainbox = document.querySelector('.box-main');
    const scorebox = document.querySelector('.score');
    const boardSizeSelect = document.getElementById('board_size');
    const firstSecondSelect = document.getElementById('firstsecond');
    const  gameMessages = document.getElementById('gameMessage');
    
    
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
    opponentsSelect = document.getElementById('oponents');
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
            document.getElementById('gameMessage').style.display = 'block'; // Mostra a mensagem
            game.updateGameMessage('placementWhite'); // Inicia com a mensagem das Brancas, por exemplo
        }else{
            if (rulesbox.style.display !== 'none') {
                rulesbox.style.display = 'none';
                mainbox.style.display = 'block';
                board.style.display = 'grid';
                resetButton.style.display = 'block';
                document.getElementById('gameMessage').style.display = 'block'; // Mostra a mensagem
                game.updateGameMessage('placementWhite'); // Inicia com a mensagem das Brancas, por exemplo
            }
        
            if (scorebox.style.display !== 'none') {
                scorebox.style.display = 'none';
                mainbox.style.display = 'block';
                board.style.display = 'grid';
                resetButton.style.display = 'block';
                document.getElementById('gameMessage').style.display = 'block'; // Mostra a mensagem
                game.updateGameMessage('placementWhite'); // Inicia com a mensagem das Brancas, por exemplo
            }
        }
        game.board.createBoard(document.getElementById('board'));
        console.log(game.board.boardState);
        game.pieces.initializePieces();
        
        boardSizeSelect.disabled = true;
        opponentsSelect.disabled = true;
        firstSecondSelect.disabled = true;
        difficultySelect.disabled = true;
        playButton.disabled = true;


        pieces.style.display = 'flex';


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
        playButton.disabled =false;
        pieces.style.display= 'none'; 
        game.pieces.initializePieces();
        resetButton.style.display = 'none';
        const playerBox = document.querySelector('.player-box');
        gameMessages.style.display = 'none';
        gameMessages.style.fontSize = '25px';

        checkSelections();
    
    });
    
};
