class game {
    constructor(rows, cols, fstplayer){
        this._board = [[]];
        this._rows = rows;
        this._cols = cols;
        this._player = fstplayer;
        this._winner = 'n';
        this._whitelastmovex;
        this._whitelastmovey;
        this._blacklastmovex;
        this._blacklastmovey;

        for(let i = 0; i < this._rows; i++){
            for(let j = 0; j < this._rows; j++){
                board[i][j] = 'n';
            }
        }
    }

    playerSwitcher() {
        if (player == 'w') player = 'b';
        else player = 'w';
    }

    piecePlacer(row, col){
        board[row][col] = player;
        this.playerSwitcher();
    }

    pieceMover(row, col, nrow, ncol){
        if(nrow === row && (ncol === col - 1 || ncol === col + 1)){
            board[nrow][ncol] = player;
            this.lastMove(nrow, ncol)
            return true;
        }
        if(ncol === col && (nrow === row - 1 || nrow === row + 1)){
            board[nrow][ncol] = player;
            this.lastMove(nrow, ncol)
            return true;
        }
        return false;
    }

    spaceChecker(row, col){
        if(board[row][col] === 'n') return true;
        else return false;
    }

    pieceRemover(row, col){
        board[row][col] = 'n';
    }

    gameOverChecker(){
        b = 0;
        w = 0;
        for(let i = 0; i < rows; i++){
            for(let j = 0; j < cols; j++){
                if(board[i][j] === 'w') w++;
                if(board[i][j] === 'b') b++;
            }
        }
        if(w <= 2){
            winner = 'w';
            return true;
        }
        if(b <= 2){
            winner = 'b';
            return true;
        } 
        return false;
    }

    lineChecker(row, col){
        let up = 0, down = 0, left = 0, right = 0;
        for(let i = 0; i < 3; i++){
            if(row + 3 < rows){
                if(board[row + i][col] === player) right++;
            }
            if(row - 3 >= 0){
                if(board[row - i][col] === player) left++;
            }
            if(col + 3 < cols){
                if(board[row][col + i] === player) down++;
            }
            if(row - 3 <= 0){
                if(board[row][col - i] === player) up++;
            }
        }
        if(up === 3 || down === 3 || right === 3 || left === 3) return true;
        else return false;
    }

    lastMove(row, col){
        if(player === 'w'){
            whitelastmovex = row;
            whitelastmovey = col;
        }else{
            blacklastmovex = row;
            blacklastmovey = col;
        }
    }

}