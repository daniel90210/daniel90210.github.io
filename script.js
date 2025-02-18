let stockfish = new Worker('stockfish.js');

stockfish.onmessage = function(event) {
    let message = event.data;
    if (message.includes('bestmove')) {
        let bestMove = message.split(' ')[1]; // Extract the best move from Stockfish
        handleAIMove(bestMove);
    }
};

function sendToStockfish(command) {
    stockfish.postMessage(command);
}

function startGame() {
    sendToStockfish('uci');  // Start Stockfish engine
    sendToStockfish('isready');  // Wait for the engine to be ready
    sendToStockfish('position startpos');  // Set the starting position
    sendToStockfish('go movetime 1000');  // Give Stockfish time to make a move
}
