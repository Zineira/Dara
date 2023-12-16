class Game {
    constructor() {
        this.totalPiecesWhite = 12;
        this.totalPiecesBlack = 12;
        this.onBoardWhite = 12;
        this.onBoardBlack = 12;
        this.placedPiecesCount = 0;
        this.gamePhase = 'placement';
        this.currentPlayer = "white";
        this.board = new Board(this); // Pass the game instance to the Board
        this.pieces = new Pieces(this.board, this);
        this.gameMessages = {
            placementWhite: "Vez das Brancas de Colocar",
            placementBlack: "Vez das Pretas de Colocar",
            movementWhite: "Vez das Brancas de Mover",
            movementBlack: "Vez das Pretas de Mover",
            captureWhite: "Brancas Devem Capturar",
            captureBlack: "Pretas Devem Capturar",
            invalidTurnWhite: "Não é o turno das Brancas!",
            invalidTurnBlack: "Não é o turno das Pretas!",
            invalidPos: "Não pode colocar nesse quadrado!",
            invalidMove: "Movimento Inválido, Tente Outravez",
            invalidCapture: "Captura Inválida",
            whiteWin: "Venceram as Brancas!",
            blackWin: "Venceram as Pretas!"
        }; 
    }
    
    joinGame(username, password) {
        this._username = username;
        this._password = password;
        this._gameId = null;

        let SQUARES_NUM_1 = document.getElementById('board_size').value;
        // Compute board size
        if (SQUARES_NUM_1 === 'board1') {
            this._rows = 5;
            this._cols = 6;
        } else if (SQUARES_NUM_1 === 'board2') {
            this._rows = 6;
            this._cols = 6;
        } else {
            console.error('Invalid board size:', SQUARES_NUM_1);
            return Promise.reject('Invalid board size');
        }

        const group = '24'; // Define the group if applicable
        var jsonData = {
            group: group,
            nick: this._username,
            password: this._password,
            size: { rows: this._rows, columns: this._cols }
        }
        return fetch('http://twserver.alunos.dcc.fc.up.pt:8008/join', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonData)
            }).then(response => {
                if (!response.ok) {
                    return response.json().then(json => {
                        throw new Error(json.error || 'Unknown error');
                    });
                }
                return response.json();
            }).then(data => {
                console.log('Join game response:', data);
                this._gameId = data.game;
                return data; 
            }).catch(error => {
                console.error('Error joining game:', error.message);
                console.error(error.stack);
                throw error; 
            });
        
    }

    
    leaveGame() {
        if (!this._gameId) {
            console.error('No game to leave: gameId is not set');
            return Promise.reject('No game to leave');
        }

        const group = '24'; // Assuming group is required for leaving as well

        return fetch('http://twserver.alunos.dcc.fc.up.pt:8008/leave', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nick: this._username,
                password: this._password,
                game: this._gameId
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.error}`);
            }
            return response.json(); // Or handle the response as needed
        })
        .then(data => {
            console.log('Leave game response:', data);
            // Additional logic after successfully leaving the game
            return data; // or you can return a specific part of data or a success message
        })
        .catch(error => {
            console.error('Error leaving game:', error);
            return null; // Resolve the promise with null in case of error
        });
    }

    getRanking(group, rows, columns) {
        if (!this._gameId) {
            console.error('game features are not set');
            return Promise.reject('No results do show');
        }

        // Construct the final URL with the query string
        const url = `http://twserver.alunos.dcc.fc.up.pt:8008/ranking`;

        // Output the final URL
 

        return fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "group": group,
                "size": { "rows": rows, "columns": columns }
            }),
            
        })
            .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.error}`);
            }
            return response.json(); // Or handle the response as needed
        })
        .then(data => {
            //console.log('Leave game response:', data);
            //tableResults=data
            return data; // or you can return a specific part of data or a success message
        })
        .catch(error => {
            console.error('Error presenting results:', error);
            return null; // Resolve the promise with null in case of error
        });

    }
    



    
    sendPlay(row, col) {
        const playData = {
            nick: this._username,
            password: this._password,
            game: this._gameId,
            move: { "row": row, "column": col }
        };
        console.log(playData.move);

        return fetch('http://twserver.alunos.dcc.fc.up.pt:8008/notify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(playData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Play response:', data);
            // Additional logic after successfully sending the play
            return data;
        })
        .catch(error => {
            console.error('Error sending play:', error);
            throw error;
        });
        
    }
    
    switchPlayer() {
        this.currentPlayer = this.currentPlayer === "white" ? "black" : "white";
        this.pieces.updateActivePlayerDisplay(this.currentPlayer);
        this.pieces.disablePiecesForInactivePlayer(this.currentPlayer);
    }

    switchPlayer() {
        if (this.board.checkVictory()) {
            return;
        }
        if (this.board.cancapture) {
            this.updateGameMessage(this.currentPlayer === "white" ? "captureWhite" : "captureBlack");
        } else {
            this.currentPlayer = this.currentPlayer === "white" ? "black" : "white";
            const messageKey = this.gamePhase === 'placement' ? (this.currentPlayer === "white" ? 'placementWhite' : 'placementBlack') : (this.currentPlayer === "white" ? 'movementWhite' : 'movementBlack');
            this.updateGameMessage(messageKey);
        }
    }

    switchGamePhase() {
        if (this.gamePhase === 'placement') {
            this.gamePhase = 'movement';
            this.updateGameMessage('movementWhite')
        }else{
            this.game.gameFinish();
        }
    }

    gameFinish(){
        const victory = this.board.checkVictory();
        if (victory) {
            this.endGame();
        }
    }
    endGame() {
        const boardElement = document.getElementById('board');
        const squares = boardElement.querySelectorAll('.square');
        const messageElement = document.getElementById('gameMessage');
        squares.forEach(square => {
            square.replaceWith(square.cloneNode(true)); 
        });
        boardElement.style.display = 'none';
        messageElement.style.fontSize = '100px';
    }

    updateGameMessage(messageKey) {
        const message = this.gameMessages[messageKey];
        document.getElementById('gameMessage').textContent = message;
    }
}

class Board {
    constructor(game) {
        this.game = game; // Save the game reference
        this.boardState = [];
        this.colors = ['#123456']; // Define your colors if needed
        this.lastPositions = {
            white: null,
            black: null
        };
        this.cancapture = false;
    }
    getRandomColor() {
        const index = Math.floor(Math.random() * this.colors.length);
        return this.colors[index];
    }
    resetColor(element) {
        element.style.backgroundColor = 'rgba(104, 160, 229, 0)';
    }
    setColor(element) {
        const color = this.getRandomColor();
        element.style.backgroundColor = color;
    }
    addClickEvents(square) {
            square.addEventListener('click', () => { 
                if(this.game.gamePhase ==='placement'){
                    if (this.game.pieces.selectedPiece) {
                        
                        this.game.pieces.placePieceOnBoard(square);


                        const parts = square.id.split('-');
                        const r = parseInt(parts[1], 10);
                        const c = parseInt(parts[2], 10);
                        //console.log('quadrado',row, col);
                    }
                } else {
                    if(this.game.board.cancapture) {
                        let playerColor = this.game.currentPlayer;
                        // Tenta capturar a peça e verifica se a captura foi bem-sucedida
                        let captureSuccess = this.game.board.removePiece(square, playerColor);
                        if(captureSuccess) {
                            this.game.board.cancapture = false;
                            this.game.switchPlayer(); // Só muda o estado se a captura foi bem-sucedida
                            // Aqui pode ser um bom lugar para verificar se o jogo acabou ou mudar de fase
                        } else {
                            
                            // Não retorna, pois o jogador deve tentar capturar novamente
                        }
                    } else {
                        
                        // Não retorna, pois o jogador deve tentar capturar novamente
                    }
                }
            });
    }

    addDragEvents(square) {
        square.addEventListener('dragover', (e) => {
            e.preventDefault(); // Allows us to drop.
            // You can add some visual feedback here.
        });
    
        square.addEventListener('drop', (e) => {
            e.preventDefault();
            const pieceId = e.dataTransfer.getData('text/plain');
            const piece = document.getElementById(pieceId);
            const targetSquare = e.target.closest('.square');
            if (piece && targetSquare && this.game.gamePhase === 'movement') {
                this.handlePieceMovement(piece, targetSquare);
            } else {
                this.game.updateGameMessage('invalidMove');
            }
        });
    }
    
    addMouseEvents(square) {
        square.addEventListener('mouseover', () => this.setColor(square));
        square.addEventListener('mouseout', () => this.resetColor(square));
    }
    createBoard(element) {
        element.innerHTML = '';

        const SQUARES_NUM_1 = document.getElementById('board_size').value;
        const board_size = document.getElementById('board');
        let rows, cols;

        // Determinar as dimensões do tabuleiro com base na seleção do usuário
        if (SQUARES_NUM_1 === 'board1') {
            rows = 5;
            cols = 6;
        } else if (SQUARES_NUM_1 === 'board2') {
            rows = 6;
            cols = 6;
        } else {
            // Se necessário, lidar com outros valores ou erro
            console.error('Tamanho do tabuleiro inválido:', SQUARES_NUM_1);
            return; // Sair da função se o valor for inválido
        }
        this.initializeBoardState(rows,cols);
        // Configura as dimensões do CSS grid baseado nas linhas e colunas
        board_size.style.gridTemplateColumns = `repeat(${cols}, 50px)`;
        board_size.style.gridTemplateRows = `repeat(${rows}, 50px)`;
        

        // Criar as células do tabuleiro
        for (let i = 0; i < rows * cols; i++) {
            const square = document.createElement('div');
            square.classList.add('square');
    
            // Calculate row and col here
            const row = Math.floor(i / cols);
            const col = i % cols;
            // Now we have 'row' and 'col' defined, we can set the id
            square.id = `square-${row}-${col}`;
            this.addMouseEvents(square); // Adicionar eventos de mouse
            this.addClickEvents(square); // Adicionar eventos de click
            this.addDragEvents(square);
    
            element.append(square); // Anexar a célula ao tabuleiro
        }
    }

    initializeBoardState(rows, columns) {
        this.boardState = Array.from({ length: rows }, () => Array(columns).fill(null));
    }

    isValidMove(row, col, currentPlayer) {
        // Primeiro, verifica se a casa está livre
        if (this.boardState[row][col] !== null) {
            return false;
        }
    
        // Verifica se colocar uma peça aqui cria uma linha de mais de 3 peças do mesmo jogador
        if (this.wouldCreateLine(row, col, currentPlayer)) {
            return false;
        }
    
        // Se passar por todas as verificações, o movimento é válido
        return true;
    }

    wouldCreateLine(row, col, currentPlayer, fromRow= null,fromCol = null) {
        // Verifica todas as direções: horizontal, vertical e diagonais
        if (this.countInDirection(row, col, 1, 0, currentPlayer,fromRow,fromCol)-1 + this.countInDirection(row, col, -1, 0, currentPlayer,fromRow,fromCol)-1 > 3 // Horizontal
            || this.countInDirection(row, col, 0, 1, currentPlayer,fromRow,fromCol)-1 + this.countInDirection(row, col, 0, -1, currentPlayer,fromRow,fromCol)-1 > 3) // Vertical
        {
            return true;
        }

        return false;
    }

    countInDirection(row, col, dx, dy, currentPlayer,fromRow= null, fromCol = null) {
        let count = 0;
        let r = row + dx;
        let c = col + dy;
        // Conta as peças do mesmo jogador na direção (dx, dy), excluindo a posição anterior da peça
        while (r >= 0 && r < this.boardState.length && c >= 0 && c < this.boardState[r].length && (r !== fromRow || c !== fromCol) && this.boardState[r][c] === currentPlayer) {
            count++;
            r += dx;
            c += dy;
        }
        r = row - dx;
        c = col - dy;
        // Conta as peças do mesmo jogador na direção oposta (-dx, -dy), excluindo a posição anterior da peça
        while (r >= 0 && r < this.boardState.length && c >= 0 && c < this.boardState[r].length && (r !== fromRow || c !== fromCol) && this.boardState[r][c] === currentPlayer) {
            count++;
            r -= dx;
            c -= dy;
        }
        return count;
    }
    // Call countInLine with appropriate direction for horizontal coun

    checkIfAllPiecesPlaced() {
        return this.game.placedPiecesCount === this.game.totalPiecesWhite+this.game.totalPiecesBlack;
    }

    ////////////////////////Movement////////////////////////////////

    handlePieceMovement(piece, targetSquare) {
        if (piece.dataset.color !== this.game.currentPlayer) {
            this.game.updateGameMessage(piece.dataset.color === "white" ? "invalidTurnWhite" : "invalidTurnBlack");
            return;
        }
        
        // Certifique-se de que o alvo é um quadrado válido
        if (!targetSquare || !targetSquare.id.startsWith('square-')) return;
    
        const [_, targetRow, targetCol] = targetSquare.id.split('-');
        const fromRow = parseInt(piece.dataset.row, 10);
        const fromCol = parseInt(piece.dataset.col, 10);
        const toRow = parseInt(targetRow, 10);
        const toCol = parseInt(targetCol, 10);
        if (this.isMoveValid(piece, fromRow, fromCol, toRow, toCol)) {
            this.movePiece(piece,fromRow,fromCol, toRow, toCol);
            this.checkForCaptures(toRow, toCol, piece.dataset.color);
            // Se não houver captura pendente, muda o jogador
            if (!this.canCapture) {
                this.game.switchPlayer();
            }
        } else {
            this.game.updateGameMessage('invalidMove');
        }
        
    }
    canPieceMove(row, col) {
        // Verificar movimentos em todas as direções adjacentes
        const directions = [
            { dx: 1, dy: 0 },  // para baixo
            { dx: -1, dy: 0 }, // para cima
            { dx: 0, dy: 1 },  // para a direita
            { dx: 0, dy: -1 }, // para a esquerda
            // Incluir diagonais se aplicável
        ];
    
        for (let direction of directions) {
            let newRow = row + direction.dx;
            let newCol = col + direction.dy;
    
            // Verifica se a nova posição está dentro dos limites do tabuleiro
            if (newRow >= 0 && newRow < this.boardState.length && newCol >= 0 && newCol < this.boardState[newRow].length) {
                // Verifica se a célula adjacente está vazia (e, portanto, é um movimento válido)
                if (this.boardState[newRow][newCol] === null) {
                    return true; // Pode se mover
                }
            }
        }
    
        return false; // Não pode se mover
    }
    
    isMoveValid(piece,fromRow, fromCol, toRow, toCol) {
        // Verifica se a peça pertence ao jogador atual
        const pieceColor = piece.dataset.color; // 'white' ou 'black'
        const lastPosition = this.lastPositions[pieceColor];

        
        if (pieceColor !== this.game.currentPlayer) {
            return false;
        }
        if (this.boardState[toRow][toCol] !== null) {
            return false;
        }
        if (lastPosition && lastPosition.pieceID === piece.id && lastPosition.row === toRow && lastPosition.col === toCol) {
            return false; // Não pode retornar à posição anterior
        }
        if (this.wouldCreateLine(toRow, toCol, pieceColor, fromRow, fromCol)) {
            return false;
        }
        // Verifica movimento contíguo
        const rowDiff = Math.abs(fromRow - toRow);
        const colDiff = Math.abs(fromCol - toCol);
        if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
            
            return true;
        }
        return false;
    }
    
    // Method getSquare in the Board class to get a square element based on its row and column
    getSquare(row, col) {
        // Assuming each square has an id like 'square-row-col'
        return document.getElementById(`square-${row}-${col}`);
    }
    
    movePiece(piece,fromRow,fromCol,toRow, toCol) {
        const pieceId = piece.id;
        const playerColor = this.game.currentPlayer;
    
        // Atualiza o estado do tabuleiro
        
        this.boardState[fromRow][fromCol] = null;
        this.boardState[toRow][toCol] = playerColor;
    
        // Move a peça visualmente
        const destinationSquare = this.getSquare(toRow, toCol);
        if (destinationSquare) {
            destinationSquare.appendChild(piece);
            const color = piece.dataset.color;
            this.lastPositions[color] = { pieceID: pieceId, row: fromRow, col: fromCol };
            piece.dataset.row = toRow.toString();
            piece.dataset.col = toCol.toString();
    
        }
        this.game.gameFinish();
        return;
    }
    
    
    checkForCaptures(row, col, playerColor) {
        const vertical = this.countInDirection(row, col, 1, 0, playerColor) + this.countInDirection(row, col, -1, 0, playerColor) -1 === 3;
        const horizontal = this.countInDirection(row, col, 0, 1, playerColor) + this.countInDirection(row, col, 0, -1, playerColor) -1 === 3;
        if (horizontal || vertical) {
            this.cancapture = true;
        }else { 
            this.cancapture = false;
        }

    }
    
    
    removePiece(square, playerColor) {
        const opponentColor = playerColor === "white" ? "black" : "white";
        const piece = square.firstChild; // assumindo que a peça é o primeiro filho do quadrado
    
        if (piece && piece.dataset.color === opponentColor) {
            square.removeChild(piece);
            if(opponentColor=== "white"){
                this.game.onBoardWhite--;
            }else{
                this.game.onBoardBlack--;
            }
            // Atualiza o estado do tabuleiro
            const parts = square.id.split('-');
            const row = parseInt(parts[1], 10);
            const col = parseInt(parts[2], 10);
            this.boardState[row][col] = null;
            this.game.gameFinish();
            this.game.switchPlayer();
            return true; // Captura foi bem-sucedida
        } else {
            this.game.updateGameMessage("invalidCapture");
            return false; // Captura falhou
        }
        
    }

    checkVictory() {
        let winner = null;
        if (this.game.onBoardWhite <= 2) {
            this.game.updateGameMessage("blackWin");
            return true; // Brancas perderam
        } else if (this.game.onBoardBlack <= 2) {
            this.game.updateGameMessage("whiteWin");
            return true; // Pretas perderam
        }
        let canMove = false;
        for (let row = 0; row < this.boardState.length; row++) {
            for (let col = 0; col < this.boardState[row].length; col++) {
                if (this.boardState[row][col] === this.game.currentPlayer) {
                    // Verifica se a peça na posição [row, col] pode se mover
                    if (this.canPieceMove(row, col)) {
                        canMove = true;
                        break;
                    }
                }
        }
        if (canMove) break;
        }

        if (!canMove) {
        // O jogador atual não pode se mover, portanto, perde o jogo
        this.game.updateGameMessage(this.game.currentPlayer === "white" ? this.game.gameMessages.blackWin : this.game.gameMessages.whiteWin);
        return true;
        }

        return false;
            
    }   
}

class Pieces {
    constructor(board, game) {
        this.board = board;
        this.game = game;
        this.selectedPiece = "white";
        this.whitePieceCount = 0;
        this.blackPieceCount = 0;
        
        
    }
    initializePieces() {
        let whitePiecesContainer = document.querySelector('.white-pieces-container');
        let blackPiecesContainer = document.querySelector('.black-pieces-container');
        
        whitePiecesContainer.innerHTML = '';
        blackPiecesContainer.innerHTML = '';
        
        for (let i = 0; i < this.game.totalPiecesWhite; i++) {
            whitePiecesContainer.appendChild(this.createPiece("white"));
        }
        for (let i = 0; i < this.game.totalPiecesBlack; i++) {
            blackPiecesContainer.appendChild(this.createPiece("black"));
        }
    }

    createPiece(color){
        this.piece = document.createElement('div');
        this.piece.dataset.color = color;
        this.piece.classList.add('game-piece');
        let pieceId;
        if (color === 'white') {
            this.piece.classList.add('white-player');
            pieceId = `piece-white-${this.whitePieceCount}`;
            this.whitePieceCount++;
        } else if (color === 'black') {
            this.piece.classList.add('black-player');
            pieceId = `piece-black-${this.blackPieceCount}`;
            this.blackPieceCount++;
        }
    this.piece.id = pieceId;

        this.piece.addEventListener('click', () => this.selectPiece(this.piece));
        this.piece.draggable = true; // Isso permite que a peça seja arrastável.
        this.piece.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.id);

            this.selectedPiece = e.target;
            
        });
        return this.piece;
    }

    placePieceOnBoard(square) {
        const messageKey = this.game.currentPlayer === 'white' ? 'placementWhite' : 'placementBlack';
        const parts = square.id.split('-');
        const row = parseInt(parts[1], 10);
        const col = parseInt(parts[2], 10);
    
        this.game.updateGameMessage(messageKey);

        if (this.board.isValidMove(row, col, this.game.currentPlayer)) {
            // Place move
            this.game.sendPlay(row, col)
            if (!square.hasChildNodes()) {
                const pieceToPlace = this.getNextPiece();
                
                this.board.boardState[row][col] = this.game.currentPlayer;
                
                const pieceClone = pieceToPlace.cloneNode(true);
                pieceClone.classList.add('placed');
                pieceClone.dataset.row = row;
                pieceClone.dataset.col = col;
                









                pieceClone.addEventListener('dragstart', (e) => {
                    if (this.game.gamePhase === 'movement') {
                        e.dataTransfer.setData('text/plain', e.target.id);
                        this.selectedPiece = e.target;
                    } else {
                        e.preventDefault(); // Isso impede que a peça seja arrastada na fase de colocação
                    }
                });
                
                
                square.appendChild(pieceClone);
                
                // Remove a peça original da seleção
                pieceToPlace.remove();
                this.game.placedPiecesCount++;
                // Alterna o jogador se o movimento foi válido
                this.game.switchPlayer();
            }
        } else {
            this.game.updateGameMessage('invalidPos');
        }
    
        if (this.board.checkIfAllPiecesPlaced()) {
            this.game.switchGamePhase();
        }
    }

    getNextPiece() {
        const playerContainer = this.game.currentPlayer === 'white' 
        ? document.querySelector('.white-pieces-container') 
        : document.querySelector('.black-pieces-container');
        return playerContainer.querySelector(':not(.placed)');
    }
}
