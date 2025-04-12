// Placeholder for chess game logic
class ChessGame {
    constructor() {
        this.board = this.initializeBoard();
        this.currentTurn = 'white';
    }

    initializeBoard() {
        // Initialize chess board with pieces
        return [
            // Example initial setup
            ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
            ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
            Array(8).fill(null),
            Array(8).fill(null),
            Array(8).fill(null),
            Array(8).fill(null),
            ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
            ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
        ];
    }

    isValidMove(start, end) {
        const piece = this.board[start.rank][start.file];
        if (!piece) return false; // No piece at start

        // Implement piece-specific movement rules
        switch (piece.toLowerCase()) {
            case 'p': // Pawn
                return this.isValidPawnMove(start, end, piece);
            case 'r': // Rook
                return this.isValidRookMove(start, end);
            case 'n': // Knight
                return this.isValidKnightMove(start, end);
            case 'b': // Bishop
                return this.isValidBishopMove(start, end);
            case 'q': // Queen
                return this.isValidQueenMove(start, end);
            case 'k': // King
                return this.isValidKingMove(start, end);
            default:
                return false; // Invalid piece
        }
    }

    isValidPawnMove(start, end, piece) {
        const direction = piece === 'p' ? 1 : -1; // Black pawns move down, white up
        const startRank = start.rank;
        const startFile = start.file;
        const endRank = end.rank;
        const endFile = end.file;
        
        // Normal forward move
        if (startFile === endFile && !this.board[endRank][endFile]) {
            // Single step forward
            if (endRank === startRank + direction) return true;
            // Double step from starting position
            if ((startRank === 1 || startRank === 6) && 
                endRank === startRank + 2 * direction &&
                !this.board[startRank + direction][startFile]) {
                return true;
            }
        }
        // Capture
        if (Math.abs(endFile - startFile) === 1 && 
            endRank === startRank + direction &&
            this.board[endRank][endFile] &&
            this.board[endRank][endFile].toLowerCase() !== this.board[startRank][startFile].toLowerCase()) {
            return true;
        }
        return false;
    }

    isValidRookMove(start, end) {
        if (start.rank !== end.rank && start.file !== end.file) return false;
        return this.isPathClear(start, end);
    }

    isValidKnightMove(start, end) {
        const rankDiff = Math.abs(end.rank - start.rank);
        const fileDiff = Math.abs(end.file - start.file);
        return (rankDiff === 2 && fileDiff === 1) || (rankDiff === 1 && fileDiff === 2);
    }

    isValidBishopMove(start, end) {
        if (Math.abs(end.rank - start.rank) !== Math.abs(end.file - start.file)) return false;
        return this.isPathClear(start, end);
    }

    isValidQueenMove(start, end) {
        return this.isValidRookMove(start, end) || this.isValidBishopMove(start, end);
    }

    isValidKingMove(start, end) {
        const rankDiff = Math.abs(end.rank - start.rank);
        const fileDiff = Math.abs(end.file - start.file);
        return rankDiff <= 1 && fileDiff <= 1;
    }

    isPathClear(start, end) {
        const rankStep = Math.sign(end.rank - start.rank);
        const fileStep = Math.sign(end.file - start.file);
        let currentRank = start.rank + rankStep;
        let currentFile = start.file + fileStep;
        
        while (currentRank !== end.rank || currentFile !== end.file) {
            if (this.board[currentRank][currentFile]) return false;
            currentRank += rankStep;
            currentFile += fileStep;
        }
        return true;
    }

    isInCheck(color) {
        const kingPos = this.findKing(color);
        if (!kingPos) return false;

        // Check if any opponent piece can attack the king
        for (let rank = 0; rank < 8; rank++) {
            for (let file = 0; file < 8; file++) {
                const piece = this.board[rank][file];
                if (piece && this.getPieceColor(piece) !== color) {
                    if (this.isValidMove(
                        {rank, file}, 
                        {rank: kingPos.rank, file: kingPos.file}
                    )) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    isCheckmate(color) {
        if (!this.isInCheck(color)) return false;

        // Check if any move can get out of check
        for (let startRank = 0; startRank < 8; startRank++) {
            for (let startFile = 0; startFile < 8; startFile++) {
                const piece = this.board[startRank][startFile];
                if (piece && this.getPieceColor(piece) === color) {
                    for (let endRank = 0; endRank < 8; endRank++) {
                        for (let endFile = 0; endFile < 8; endFile++) {
                            if (this.isValidMove(
                                {rank: startRank, file: startFile},
                                {rank: endRank, file: endFile}
                            )) {
                                // Test if this move gets out of check
                                const originalBoard = JSON.parse(JSON.stringify(this.board));
                                this.makeMove(
                                    {rank: startRank, file: startFile},
                                    {rank: endRank, file: endFile},
                                    false // Don't validate (already did)
                                );
                                const stillInCheck = this.isInCheck(color);
                                this.board = originalBoard; // Revert
                                
                                if (!stillInCheck) return false;
                            }
                        }
                    }
                }
            }
        }
        return true; // No moves get out of check
    }

    findKing(color) {
        const king = color === 'white' ? 'K' : 'k';
        for (let rank = 0; rank < 8; rank++) {
            for (let file = 0; file < 8; file++) {
                if (this.board[rank][file] === king) {
                    return {rank, file};
                }
            }
        }
        return null;
    }

    getPieceColor(piece) {
        return piece === piece.toLowerCase() ? 'black' : 'white';
    }

    makeMove(start, end, validate = true) {
        if (validate && !this.isValidMove(start, end)) return false;
        
        const piece = this.board[start.rank][start.file];
        this.board[end.rank][end.file] = piece;
        this.board[start.rank][start.file] = null;
        this.currentTurn = this.currentTurn === 'white' ? 'black' : 'white';
        return true;
    }
}

module.exports = ChessGame;
