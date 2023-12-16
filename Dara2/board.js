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
    const rankingContainer = document.getElementById('rankingContainer');
    const playButton = document.getElementById('play');
    const board = document.getElementById('board');
    const rulesbox = document.querySelector('.rules');
    const mainbox = document.querySelector('.box-main');
    const scorebox = document.querySelector('.score');
    const boardSizeSelect = document.getElementById('board_size');
    
    const firstSecondSelect = document.getElementById('firstsecond');
    const  gameMessages = document.getElementById('gameMessage');
    
    // Event listener for the login/register form
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        // Get the values from the form
        var nick = document.getElementById('username').value;
        var password = document.getElementById('password').value;

        if( nick == "" || password == "" ){
            alert("Username and password must be filled out");
            return false;
        }

        // Create JSON data
        var jsonData = {
            nick: nick,
            password: password
        };

        // Send POST request with fetch API
        fetch('http://twserver.alunos.dcc.fc.up.pt:8008/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(json => {
                    throw new Error(json.error || 'Unknown error');
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            alert("User registered successfully");
            document.getElementById('loginForm').style.display = 'none';
            // Handle success here
        })
        .catch((error) => {
            alert(error);
        });
    });
    
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
        const group = '24';  // Group value
       
    
        // Call the getRanking function
        game.getRanking(group, game._rows, game._cols)
            .then(rankingData => {
                // Process the ranking data and update the UI as needed
                console.log('Ranking:', rankingData);
                displayRanking(rankingData);
            })
            .catch(error => {
                // Handle errors
                console.error('Error:', error);
            });
    });




    function getGameData(username, gameId) {
        // Assuming you have the correct endpoint for retrieving game data
        const url = `http://twserver.alunos.dcc.fc.up.pt:8008/update?nick=${username}&game=${gameId}`;

        return fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Game data:', data);
            // Process the data or return it as needed
            return data;
        })
        .catch(error => {
            console.error('Error getting game data:', error.message);
            console.error(error.stack);
            throw error;
        });
    }

    function displayRanking(ranking) {
        // Clear previous content in the ranking container
        rankingContainer.innerHTML = '';

        // Check if there are entries in the ranking
        if (ranking.length > 0) {
            // Create elements to display each ranking entry
            ranking.forEach(entry => {
                const entryElement = document.createElement('div');
                entryElement.textContent = `${entry.player}: ${entry.score}`;
                rankingContainer.appendChild(entryElement);
            });
        } else {
            // Display a message if the ranking is empty
            rankingContainer.textContent = 'No ranking data available.';
        }
    }

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

        // Jogar
        // Call the joinGame method and handle the result
        game.joinGame(document.getElementById('username').value, document.getElementById('password').value)
        .then(gameId => {
            if (gameId) {
                console.log('Joined game with ID:', gameId);
                // Additional logic after successfully joining the game
            } else {
                console.log('Failed to join game or no gameId returned');
                // Handle the scenario where joining the game failed
            }
        })
        .catch(error => {
            console.error('Error during game join:', error);
            alert(error);
            return;
            // Handle any errors that occurred during joinGame
        });

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

        game.leaveGame()
        .then(data => {
            console.log('Successfully left the game:', data);
            // Additional logic after leaving the game
        })
        .catch(error => {
            console.error('Failed to leave the game:', error);
        });

        checkSelections();
    
    });
};
