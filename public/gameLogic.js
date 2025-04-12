// Chess movement rules and logic
export function isValidMove(from, to, piece) {
    const dx = to.file - from.file;
    const dy = to.rank - from.rank;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    const color = piece === piece.toUpperCase() ? 'white' : 'black';
    const targetPiece = window.gameState.board[to.rank][to.file];

    // Cannot capture own piece
    if (targetPiece && 
        (targetPiece === targetPiece.toUpperCase()) === (piece === piece.toUpperCase())) {
        return false;
    }

    switch (piece.toLowerCase()) {
        case 'p': return isValidPawnMove(from, to, color, targetPiece);
        case 'r': return (dx === 0 || dy === 0) && !isPathBlocked(from, to);
        case 'n': return (absDx === 2 && absDy === 1) || (absDx === 1 && absDy === 2);
        case 'b': return absDx === absDy && !isPathBlocked(from, to);
        case 'q': return (absDx === absDy || dx === 0 || dy === 0) && !isPathBlocked(from, to);
        case 'k': return absDx <= 1 && absDy <= 1;
        default: return false;
    }
}

function isValidPawnMove(from, to, color, targetPiece) {
    const dx = to.file - from.file;
    const dy = to.rank - from.rank;
    const direction = color === 'white' ? -1 : 1;

    // Normal move
    if (dx === 0) {
        if (dy === direction) return !targetPiece;
        if (dy === 2*direction && from.rank === (color === 'white' ? 6 : 1)) {
            return !window.gameState.board[from.rank + direction][from.file] && !targetPiece;
        }
        return false;
    }
    // Capture
    if (Math.abs(dx) === 1 && dy === direction) {
        return !!targetPiece;
    }
    return false;
}

function isPathBlocked(from, to) {
    const dx = Math.sign(to.file - from.file);
    const dy = Math.sign(to.rank - from.rank);
    let x = from.file + dx;
    let y = from.rank + dy;
    
    while (x !== to.file || y !== to.rank) {
        if (window.gameState.board[y][x]) return true;
        x += dx;
        y += dy;
    }
    return false;
}

export function movePiece(from, to) {
    const piece = window.gameState.board[from.rank][from.file];
    window.gameState.board[to.rank][to.file] = piece;
    window.gameState.board[from.rank][from.file] = null;
    window.gameState.currentTurn = window.gameState.currentTurn === 'white' ? 'black' : 'white';
    window.initBoard();
    window.updateGameStatus();
}
