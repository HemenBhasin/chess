// UI and display logic
export const pieceSymbols = {
    'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
    'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
};

export function initBoard() {
    const board = document.getElementById('chess-board');
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = [8, 7, 6, 5, 4, 3, 2, 1];

    board.innerHTML = '';
    board.style.display = 'grid';
    board.style.gridTemplateColumns = 'repeat(8, 1fr)';
    board.style.gridTemplateRows = 'repeat(8, 1fr)';
    board.style.width = '480px';
    board.style.height = '480px';
    board.style.border = '2px solid #5d4037';

    for (let rank = 0; rank < 8; rank++) {
        for (let file = 0; file < 8; file++) {
            const square = createSquare(rank, file, files, ranks);
            board.appendChild(square);
        }
    }
}

function createSquare(rank, file, files, ranks) {
    const square = document.createElement('div');
    square.id = `${files[file]}${ranks[rank]}`;
    square.className = `square ${(rank + file) % 2 ? 'white' : 'black'}`;
    square.dataset.rank = rank;
    square.dataset.file = file;
    
    const piece = window.gameState.board[rank][file];
    if (piece) {
        square.appendChild(createPieceElement(piece));
    }
    
    square.addEventListener('click', () => handleSquareClick(square));
    return square;
}

function createPieceElement(piece) {
    const pieceElement = document.createElement('div');
    pieceElement.className = 'piece';
    pieceElement.textContent = pieceSymbols[piece];
    pieceElement.dataset.piece = piece;
    pieceElement.dataset.color = piece === piece.toUpperCase() ? 'white' : 'black';
    return pieceElement;
}

export function updateGameStatus() {
    const turnIndicator = document.getElementById('turn-indicator');
    if (turnIndicator) {
        turnIndicator.textContent = `${window.gameState.currentTurn}'s turn`;
        turnIndicator.className = `${window.gameState.currentTurn}-turn`;
    }
}

function handleSquareClick(square) {
    const rank = parseInt(square.dataset.rank);
    const file = parseInt(square.dataset.file);
    
    if (!window.gameState.selectedSquare) {
        selectPiece(rank, file, square);
    } else {
        attemptMove(rank, file);
    }
}

function selectPiece(rank, file, square) {
    const piece = window.gameState.board[rank][file];
    if (piece) {
        const pieceColor = piece === piece.toUpperCase() ? 'white' : 'black';
        if (pieceColor === window.gameState.currentTurn) {
            window.gameState.selectedSquare = { rank, file };
            square.classList.add('selected');
        }
    }
}

function attemptMove(rank, file) {
    const from = window.gameState.selectedSquare;
    const to = { rank, file };
    const piece = window.gameState.board[from.rank][from.file];
    
    if (window.isValidMove(from, to, piece)) {
        document.querySelector('.selected')?.classList.remove('selected');
        window.gameState.selectedSquare = null;
        window.movePiece(from, to);
    } else {
        console.log("Invalid move for", piece);
        window.gameState.selectedSquare = null;
        document.querySelector('.selected')?.classList.remove('selected');
    }
}
