const ChessGame = require('./gameLogic');
const activeGames = new Map();

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        // Game creation handler
        socket.on('createGame', () => {
            const game = new ChessGame();
            const gameId = generateGameId();
            activeGames.set(gameId, {
                game,
                players: []
            });
            socket.join(gameId);
            socket.emit('gameCreated', gameId);
        });

        // Game joining handler
        socket.on('joinGame', (gameId) => {
            if (!activeGames.has(gameId)) {
                socket.emit('error', 'Game not found');
                return;
            }

            const gameData = activeGames.get(gameId);
            if (gameData.players.length >= 2) {
                socket.emit('error', 'Game is full');
                return;
            }

            socket.join(gameId);
            const color = gameData.players.length === 0 ? 'white' : 'black';
            gameData.players.push({ socketId: socket.id, color });
            socket.emit('gameJoined', gameId, color);

            // Start game if both players joined
            if (gameData.players.length === 2) {
                io.to(gameId).emit('gameStart', color);
                io.to(gameId).emit('game_state', {
                    board: gameData.game.board,
                    currentTurn: 'white'
                });
            }
        });

        // Move handler
        socket.on('move', ({ gameId, from, to }) => {
            if (!activeGames.has(gameId)) return;

            const { game } = activeGames.get(gameId);
            try {
                if (game.isValidMove(from, to)) {
                    game.makeMove(from, to);
                    io.to(gameId).emit('game_state', {
                        board: game.board,
                        currentTurn: game.currentTurn,
                        lastMove: { from, to }
                    });
                } else {
                    socket.emit('invalid_move', {
                        message: 'Invalid move attempted'
                    });
                }
            } catch (err) {
                socket.emit('error', err.message);
            }
        });

        // Disconnection handler
        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
            // Clean up empty games
            for (const [gameId, gameData] of activeGames) {
                gameData.players = gameData.players.filter(
                    player => player.socketId !== socket.id
                );
                if (gameData.players.length === 0) {
                    activeGames.delete(gameId);
                } else {
                    // Notify remaining player
                    io.to(gameId).emit('playerDisconnected');
                }
            }
            socket.removeAllListeners();
        });

        // Add ping-pong for connection health
        socket.on('ping', (cb) => {
            if (typeof cb === 'function') cb();
        });

        // Helper function to generate game IDs
        function generateGameId() {
            return Math.random().toString(36).substring(2, 8).toUpperCase();
        }
    });
};
