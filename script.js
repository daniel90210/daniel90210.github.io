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
function handleAIMove(move) {
    // Parse the move and update the board array accordingly
    // Example: 'e2e4' → move piece from e2 to e4
    const fromSquare = move.substring(0, 2); // e.g., 'e2'
    const toSquare = move.substring(2, 4); // e.g., 'e4'

    // Convert board positions (e.g., 'e2' to row/col indices)
    const fromRow = 8 - parseInt(fromSquare[1]);
    const fromCol = fromSquare.charCodeAt(0) - 'a'.charCodeAt(0);
    const toRow = 8 - parseInt(toSquare[1]);
    const toCol = toSquare.charCodeAt(0) - 'a'.charCodeAt(0);

    // Move the piece on the board
    initialBoard[toRow][toCol] = initialBoard[fromRow][fromCol];
    initialBoard[fromRow][fromCol] = '--';

    // Re-render the board with the updated state
    createBoard();

    // Allow the user to make their next move
}
function makeUserMove(from, to) {
    // Similar to how AI moves are handled, update the board with the user's move
    // Then send the updated position to Stockfish to get its response
    const fromRow = 8 - parseInt(from[1]);
    const fromCol = from.charCodeAt(0) - 'a'.charCodeAt(0);
    const toRow = 8 - parseInt(to[1]);
    const toCol = to.charCodeAt(0) - 'a'.charCodeAt(0);

    initialBoard[toRow][toCol] = initialBoard[fromRow][fromCol];
    initialBoard[fromRow][fromCol] = '--';

    // Update the UI
    createBoard();

    // Send the new board position to Stockfish
    let fen = generateFEN();
    sendToStockfish(`position fen ${fen}`);
    sendToStockfish('go movetime 1000');
}
