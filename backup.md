let ttt = (function() {
    const gameboard = (function(){
        let board = {
            topLeft: "X",
            top: "",
            topRight: "0",
            midLeft: "",
            mid: "",
            midRight: "",
            botLeft: "",
            bot: "X",
            botRight: "0"
        };

        const printBoard = () => {
            console.log(`${board.topLeft} | ${board.top} | ${board.topRight}`);
            console.log(`${board.midLeft} | ${board.mid} | ${board.midRight}`);
            console.log(`${board.botLeft} | ${board.bot} | ${board.botRight}`);
        };

        const getMoves = () => {
            return Object.keys(board);
        }

        const checkMove = (move) => {
            if(move in board  && board[String(move)] == "") {return true};
        }

        const makeMove = (marker, position) => {
            board[String(position)] = marker;
        }

        const checkWin = () => {
            let checkCell = (cell) => {
                if (board[String(cell)] === play.playerTurn.getMarker()) {
                    return true;
                } else {return false} 
            } 

            if(
                checkCell("topLeft") && checkCell("top") && checkCell("topRight") ||
                checkCell("midLeft") && checkCell("mid") && checkCell("midRight") ||
                checkCell("botLeft") && checkCell("bot") && checkCell("botRight") ||
                checkCell("topLeft") && checkCell("mid") && checkCell("botRight") ||
                checkCell("topRight") && checkCell("mid") && checkCell("botLeft") ||
                checkCell("topLeft") && checkCell("midLeft") && checkCell("botLeft") ||
                checkCell("topRight") && checkCell("midRight") && checkCell("botRight") ||
                checkCell("top") && checkCell("mid") && checkCell("bot")) {
                    console.log(`${play.playerTurn.getName()} won!!`)
                    play.playerTurn.updateWin();
                    printScores;
                }
        }

        return { printBoard, makeMove, checkWin, getMoves, checkMove};
    })()

    function playerFactory(name, marker) {
        let score = 0;

        const updateWin = () => {
            score += 1;
        }

        const getMarker = () => {
            return marker;
        }

        const getName = () => {
            return name;
        }
        
        const getScore = () => {
            return score;
        }

        return { updateWin, getMarker, getName, getScore };
    }

    let playerX = playerFactory("ONE", "X");
    let playerO = playerFactory("TWO", "0");

    const play = (function() {
        let playerTurn = playerX; 

        const turn = () => {
            requestMove();
            gameboard.printBoard();
            gameboard.checkWin();
            changeTurn();
            requestNextTurn();
        }

        const requestMove = () => {
            let position = prompt(`${playerTurn.getName()}, what is your move?`);
            if(gameboard.checkMove(position)) {
                gameboard.makeMove(playerTurn.getMarker(), position);
                return true;
            } else {
                console.log(`That was not a legal move or that cell is occupied.`);
                console.log(`Run ttt.startGame() to try again.`);
                console.log(`Or run ttt.checkMoves to see all available moves.`);
                return;
            }
            
        }

        const requestNextTurn = () => {
            confirm(`${playerTurn.getName()}, it is your turn. Ready?`) ? turn() : console.log("Game paused");
        }

        const changeTurn = () => {
            playerTurn = playerTurn === playerO ? playerX : playerO;
        }

        return { turn, playerTurn }
    })();

    // Console Gane Controls
    const startGame = () => {
        play.turn();
    };

    const restartGame = () => {
        gameboard.board.forEach((key) =>{
            key = "";
        });
    };

    const printScores = () => {
        console.log(`${playerX.getName()} (${playerX.getMarker()}): ${playerX.getScore()}`);
        console.log(`${playerO.getName()} (${playerO.getMarker()}): ${playerO.getScore()}`);
    };

    const checkMoves = () => {
        let moves = gameboard.getMoves();
        moves.forEach((move) => {
            console.log(move);
        });
    };

    console.log(`Run ttt.startGame() to start game in console.`)

    return {startGame, restartGame, printScores, checkMoves, restartGame}
})();
