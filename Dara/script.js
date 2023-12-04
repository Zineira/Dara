///Estás a tratar dos erros das funções, usa o chatgpt para ires resolvendo os erros, tens de fazer mover as peças, updateboard view , captura de peças, check de vitoria, mensagens variaveis, e recolha dos dados

class Game {
    constructor() {
        this.totalPieces = 24; // Total de peças disponíveis
        this.placedPiecesCount = 0;
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
        if (this.gamePhase === 'placement') {
            this.gamePhase = 'movement';
            console.log('Game phase changed to movement');
        }
    }
    updateBoardView(){
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
                if (this.game.pieces.selectedPiece) {
                    this.game.pieces.placePieceOnBoard(square);
                } else {
                    console.log('Nenhuma peça selecionada');
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
                alert('Movimento inválido ou não permitido nesta fase!');
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
        console.log('placedPiecesCount',this.game.placedPiecesCount)
        console.log('totalPieces',this.game.totalPieces)
        return this.game.placedPiecesCount === this.game.totalPieces;
    }

    ////////////////////////Movement////////////////////////////////

    handlePieceMovement(piece, targetSquare) {
        if (piece.dataset.color !== this.game.currentPlayer) {
            console.log('Não é a vez das ',piece.dataset.color);
            return;
        }
        
        // Certifique-se de que o alvo é um quadrado válido
        if (!targetSquare || !targetSquare.id.startsWith('square-')) return;
    
        const [_, targetRow, targetCol] = targetSquare.id.split('-');
        const fromRow = parseInt(piece.dataset.row, 10);
        const fromCol = parseInt(piece.dataset.col, 10);
        const toRow = parseInt(targetRow, 10);
        const toCol = parseInt(targetCol, 10);
    
        if (this.isMoveValid(piece,fromRow, fromCol, toRow, toCol)) {
            this.movePiece(piece, toRow, toCol);
            this.checkForCaptures(toRow, toCol, piece.dataset.color);
            this.game.switchPlayer();
        } else {
            alert('Movimento inválido!');
        }
    }
    
    isMoveValid(piece,fromRow, fromCol, toRow, toCol) {
        // Verifica se a peça pertence ao jogador atual
        const pieceColor = piece.dataset.color; // 'white' ou 'black'
        const lastPosition = this.lastPositions[pieceColor];
        console.log(`Última posição conhecida para ${piece.dataset.color}:`, lastPosition);

        // console.log('linhainicial',fromRow,'colunainicial', fromCol,'linhafinal', toRow,'colunafinal', toCol,'Color:', pieceColor);
        if (pieceColor !== this.game.currentPlayer) {
            return false;
        }
        if (this.boardState[toRow][toCol] !== null) {
            return false;
        }
        if (lastPosition && lastPosition.row === toRow && lastPosition.col === toCol) {
            console.log('Movimento para a última posição cancelado');
            return false; // Não pode retornar à posição anterior
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
    
    movePiece(piece, toRow, toCol) {
        const pieceId = piece.id;
        console.log(pieceId);
        const playerColor = this.game.currentPlayer;
    
        // Atualiza o estado do tabuleiro
        const fromRow = parseInt(piece.dataset.row, 10);
        const fromCol = parseInt(piece.dataset.col, 10);
        this.boardState[fromRow][fromCol] = null;
        this.boardState[toRow][toCol] = playerColor;
    
        // Move a peça visualmente
        const destinationSquare = this.getSquare(toRow, toCol);
        if (destinationSquare) {
            destinationSquare.appendChild(piece);
            const color = piece.dataset.color;
            this.lastPositions[color] = { row: fromRow, col: fromCol };
            console.log(`Atualizado lastPositions para ${color}:`, this.lastPositions[color]);
            // Atualiza os dados da peça
            piece.dataset.row = toRow.toString();
            piece.dataset.col = toCol.toString();
    
            // Atualiza a última posição da peça
            
            console.log('deu',this.lastPositions);
        } else {
            console.error(`No destination square found at row ${toRow} and col ${toCol}`);
            return;
        }
    }
    
    
    checkForCaptures(row, col, playerColor) {
        // Verifica se uma linha de 3 foi formada em qualquer direção
        const horizontal = this.countInDirection(row, col, 1, 0, playerColor) + this.countInDirection(row, col, -1, 0, playerColor) >= 3;
        const vertical = this.countInDirection(row, col, 0, 1, playerColor) + this.countInDirection(row, col, 0, -1, playerColor) >= 3;
    
        if (horizontal || vertical) {
            // Captura uma peça do oponente
            this.captureOpponentPiece(playerColor);
        }
    }
    
    captureOpponentPiece(playerColor) {
        // Implementa a lógica para capturar uma peça do oponente
        // Isso pode envolver permitir que o jogador escolha uma peça do oponente para ser removida
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
        const parts = square.id.split('-');
        const row = parseInt(parts[1], 10);
        const col = parseInt(parts[2], 10);
        if (this.game.gamePhase === 'placement') {
            // A lógica para verificar se o movimento é válido já está sendo feita, mas parece que está sendo passada a propriedade errada (string em vez de número)
            if (this.board.isValidMove(row, col, this.game.currentPlayer)) {
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
                    this.game.switchPlayer()
                } else {
                    alert('Este espaço já está ocupado.');
                }
            } else {
                alert('Movimento inválido!');
            }
            console.log(this.board.boardState);
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
