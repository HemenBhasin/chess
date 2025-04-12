// Main game initialization
import { initBoard, updateGameStatus } from './gameUI.js';
import { isValidMove, movePiece } from './gameLogic.js';

// Expose functions to window for global access
window.initBoard = initBoard;
window.updateGameStatus = updateGameStatus;
window.isValidMove = isValidMove;
window.movePiece = movePiece;

document.addEventListener('DOMContentLoaded', () => {
    window.gameState = {
        board: [
            ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
            ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
            Array(8).fill(null),
            Array(8).fill(null),
            Array(8).fill(null),
            Array(8).fill(null),
            ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
            ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
        ],
        currentTurn: 'white',
        selectedSquare: null
    };

    initBoard();
    updateGameStatus();
});
