class Game {
    constructor() {
        this.gamePhase = 'placement';
        this.currentPlayer = "white";
        this.board = new Board(this); // Pass the game instance to the Board
        this.pieces = new Pieces(this.board, this); // Pass Board and Game instances to Pieces
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === "white" ? "black" : "white";
        this.pieces.updateActivePlayerDisplay(this.currentPlayer);
        this.pieces.disablePiecesForInactivePlayer(this.currentPlayer);
    }

    switchGamePhase() {
        if (this.gamePhase === 'placement' && this.board.checkIfAllPiecesPlaced()) {
            this.gamePhase = 'movement';
            console.log('Game phase changed to movement');
        }
        this.board.updateBoardView();
    }

    
}

class Board {
    constructor(game) {
        this.game = game; // Save the game reference
        this.boardState = [];
        this.colors = ['#123456']; // Define your colors if needed
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
            console.log(this.game.pieces.selectedPiece);
            if (this.game.pieces.selectedPiece) {
                this.game.pieces.placePieceOnBoard(square);
            } else {
                console.log('Nenhuma peça selecionada');
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
            // Atribuir as coordenadas de linha e coluna se necessário
            square.dataset.row = Math.floor(i / cols);
            square.dataset.col = i % cols;

            this.addMouseEvents(square); // Adicionar eventos de mouse
            this.addClickEvents(square); // Adicionar eventos de click
            
            square.addEventListener('dragover', (e) => {
                e.preventDefault(); // Isso permite que recebamos o evento drop.
            });
            
            square.addEventListener('drop', (e) => {
                e.preventDefault();
                const startRow = parseInt(this.game.pieces.selectedPiece.dataset.row, 10);
                const startCol = parseInt(this.game.pieces.selectedPiece.dataset.col, 10);
                const endRow = parseInt(e.target.dataset.row, 10);
                const endCol = parseInt(e.target.dataset.col, 10);
            
                // Chame movePiece somente se for a fase de movimento e o movimento for válido.
                if (this.game.gamePhase === 'movement' && this.isValidMove(endRow, endCol, this.game.currentPlayer)) {
                    this.game.pieces.movePiece(startRow, startCol, endRow, endCol);
                    this.game.switchPlayer();
                }
            });
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

    wouldCreateLine(row, col, currentPlayer) {
        // Verifica todas as direções: horizontal, vertical e diagonais
        if (this.countInDirection(row, col, 1, 0, currentPlayer) + this.countInDirection(row, col, -1, 0, currentPlayer) - 1 > 3 // Horizontal
            || this.countInDirection(row, col, 0, 1, currentPlayer) + this.countInDirection(row, col, 0, -1, currentPlayer) - 1 > 3) // Vertical
        {
            return true;
        }

        return false;
    }

    countInDirection(row, col, dx, dy, currentPlayer) {
        let count = 0;
        let r = row + dx;
        let c = col + dy;
        // Conta as peças do mesmo jogador na direção (dx, dy)
        while (r >= 0 && r < this.boardState.length && c >= 0 && c < this.boardState[r].length && this.boardState[r][c] === currentPlayer) {
            count++;
            r += dx;
            c += dy;
        }
        r = row - dx;
        c = col - dy;
        // Conta as peças do mesmo jogador na direção oposta (-dx, -dy)
        while (r >= 0 && r < this.boardState.length && c >= 0 && c < this.boardState[r].length && this.boardState[r][c] === currentPlayer) {
            count++;
            r -= dx;
            c -= dy;
        }
        return count;
    }
    // Call countInLine with appropriate direction for horizontal coun

    checkIfAllPiecesPlaced() {
        return this.boardState.every(row => row.every(col => col !== null));
    }

    updateBoardView() {
    }
}

class Pieces {
    constructor(board, game) {
        this.board = board;
        this.game = game;
        this.selectedPiece = "white";
        
    }
    initializePieces() {
        let whitePiecesContainer = document.querySelector('.white-pieces-container');
        let blackPiecesContainer = document.querySelector('.black-pieces-container');
        
        whitePiecesContainer.innerHTML = '';
        blackPiecesContainer.innerHTML = '';
        
        for (let i = 0; i < 12; i++) {
            whitePiecesContainer.appendChild(this.createPiece("white"));
        }
        for (let i = 0; i < 12; i++) {
            blackPiecesContainer.appendChild(this.createPiece("black"));
        }
    }

    createPiece(color){
        this.piece = document.createElement('div');
        this.piece.dataset.color = color;
        this.piece.classList.add('game-piece');
        if (color === 'white') {
            this.piece.classList.add('white-player');
        } else if (color === 'black') {
            this.piece.classList.add('black-player');
        }
        this.piece.addEventListener('click', () => this.selectPiece(this.piece));
        this.piece.draggable = true; // Isso permite que a peça seja arrastável.
        this.piece.addEventListener('dragstart', (e) => {
        // Guarde uma referência para a peça arrastada.
        this.selectedPiece = e.target;});
        return this.piece;
    }

    updateActivePlayerDisplay(currentPlayer) {
        const playerDisplay = document.querySelector('.current-player-display');
        if (playerDisplay) {
            playerDisplay.textContent = currentPlayer === "white" ? "Jogador Branco" : "Jogador Preto";
        }
        // Atualizar a visualização das peças para mostrar quais são selecionáveis (clickable)
        const allPieces = document.querySelectorAll('.game-piece');
        allPieces.forEach(piece => {
            if (piece.dataset.color === currentPlayer) {
                piece.classList.add('clickable');
            } else {
                piece.classList.remove('clickable');
            }
        });
    }

    disablePiecesForInactivePlayer(currentPlayer) {
        const inactivePlayer = currentPlayer === 'white' ? 'black' : 'white';
        const piecesToDisable = document.querySelectorAll(`.game-piece[data-color="${inactivePlayer}"]`);
        piecesToDisable.forEach(piece => {
            piece.classList.remove('clickable'); // ou algum outro método para desabilitar o clique
        });
    }

    placePieceOnBoard(square) {
        const row = parseInt(square.dataset.row, 10);
        const col = parseInt(square.dataset.col, 10);

        if (this.game.gamePhase === 'placement') {
            // A lógica para verificar se o movimento é válido já está sendo feita, mas parece que está sendo passada a propriedade errada (string em vez de número)
            if (this.game.board.isValidMove(row, col, this.game.currentPlayer)) {
                // Então verificamos se o quadrado está vazio
                if (!square.hasChildNodes()) {
                    const pieceToPlace = this.getNextPiece();
                    if (!pieceToPlace) {
                        alert('Não há mais peças disponíveis.');
                        return;
                    }
                    
                    // Faz a colocação da peça no estado do tabuleiro
                    this.board.boardState[row][col] = this.game.currentPlayer;
                    
                    // Cria um clone da peça e adiciona ao tabuleiro
                    const pieceClone = pieceToPlace.cloneNode(true);
                    pieceClone.classList.add('placed');
                    square.appendChild(pieceClone);
                    
                    // Remove a peça original da seleção
                    pieceToPlace.remove();
                    
                    // Alterna o jogador se o movimento foi válido
                    this.game.switchPlayer()
                } else {
                    alert('Este espaço já está ocupado.');
                }
            } else {
                alert('Movimento inválido!');
            }
        } else if (this.game.gamePhase === 'movement') {
            // Movimento de peças
            if (this.selectedPiece) {
                // Verifique se a seleção e movimento são válidos
                if (this.game.board.isValidMove(square.dataset.row, square.dataset.col, this.game.currentPlayer)) {
                    this.movePiece(Board.boardState, parseInt(this.selectedPiece.dataset.row, 10), parseInt(this.selectedPiece.dataset.col, 10), row, col);
                    Board.updateBoardView(); // Atualize o tabuleiro com base no novo estado
                    this.game.switchPlayer() // Alterne para o próximo jogador
                } else {
                    alert('Movimento inválido!');
                }
            } else {
                alert('Nenhuma peça selecionada para mover!');
            }
        }
    }
    movePiece(startRow, startCol, endRow, endCol) {
        // Atualiza o estado do tabuleiro removendo a peça da posição inicial e colocando na posição final.
        this.board.boardState[startRow][startCol] = null;
        this.board.boardState[endRow][endCol] = this.game.currentPlayer;
    
        // Encontra a peça no DOM baseada nos dados de sua posição inicial.
        const pieceElement = document.querySelector(`.square[data-row="${startRow}"][data-col="${startCol}"] .game-piece`);
        const targetSquare = document.querySelector(`.square[data-row="${endRow}"][data-col="${endCol}"]`);
    
        if (pieceElement && targetSquare) {
            // Remove a peça do quadrado inicial.
            pieceElement.remove();
            
            // Adiciona a peça ao quadrado de destino.
            targetSquare.appendChild(pieceElement);
            
            // Atualize os atributos de dados da peça com a nova posição.
            pieceElement.dataset.row = endRow;
            pieceElement.dataset.col = endCol;
    
            // Atualize a visualização.
            this.board.updateBoardView();
        }
    }
    selectPiece(pieceElement) {
        if (pieceElement.dataset.color !== this.game.currentPlayer) {
            return;
        }

        if (this.selectedPiece) {
            this.selectedPiece.classList.remove('selected');
        }
        this.selectedPiece = pieceElement;
        this.selectedPiece.classList.add('selected');
    }

    getNextPiece() {
        const playerContainer = this.game.currentPlayer === 'white' 
        ? document.querySelector('.white-pieces-container') 
        : document.querySelector('.black-pieces-container');
        return playerContainer.querySelector(':not(.placed)');
    }
}
