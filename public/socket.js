// Initialize socket with connection monitoring
if (typeof window._socketInitialized === 'undefined' && typeof io !== 'undefined') {
    window.socket = io({
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
    });
    window._socketInitialized = true;
    
    // Connection monitoring
    window.socket.on('connect', () => {
        console.log('Connected to server');
        setInterval(() => {
            window.socket.emit('ping', () => console.log('Ping successful'));
        }, 30000);
    });

    window.socket.on('playerDisconnected', () => {
        alert('Opponent disconnected! Creating new game...');
        window.socket.emit('createGame');
    });
    window._socketInitialized = true;
    
    // Initialize game state if not exists
    window.gameState = window.gameState || {
        board: Array(8).fill().map(() => Array(8).fill(null)),
        currentTurn: 'white'
    };

    // Socket event handlers
    window.socket.on('connect', () => {
        console.log('Connected to server with socket id:', window.socket.id);
    });

    window.socket.on('game_state', (state) => {
        console.log('Game state updated:', state);
        window.gameState.board = state.board;
        window.gameState.currentTurn = state.currentTurn;
        if (window.updateGameState) window.updateGameState();
    });

    window.socket.on('move', (data) => {
        window.gameState.board = data.board;
        window.gameState.currentTurn = data.currentTurn;
        if (window.updateGameState) window.updateGameState();
    });

    window.socket.on('invalid_move', (message) => {
        console.warn('Invalid move:', message);
        alert('Invalid move attempted!');
    });

    window.socket.on('disconnect', () => {
        console.log('Disconnected from server');
    });
}
