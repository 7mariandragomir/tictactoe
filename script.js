(function(){

    // basic pubsub module
    const pubsub = {
        events: {},
        subscribe(event, callback) {
            if (!this.events[event]) {
                this.events[event] = [];
            }; 
            this.events[event].push(callback);
        },
        publish(event, data) {
            if(this.events[event]) {
                this.events[event].forEach(f => f(data));
            }
        }
    };

    // gameBoard module. handles the board array, updates it when a move is 
    // made.
    const gameBoard = (function() {
        let board = [
            ['','',''],
            ['','',''],
            ['','','']
        ]; 

        const getBoard = () => {
            return board;
        }; 

        const resetBoard = () => {
            board = [
                ['','',''],
                ['','',''],
                ['','','']
            ]; 
            pubsub.publish('resetBoard', board);
        };

        const makeMove = (marker, rowIndex, colIndex) => {
            board[rowIndex][colIndex] = marker;            
            pubsub.publish('updatedBoard', board );
        };

        pubsub.subscribe('requestReset', resetBoard);

        return { getBoard, resetBoard, makeMove }
    })();

    // displayController module. keeps track of game logic and handles the UI 
    // updates
    const displayController = (function() {
        const boardContainer = document.getElementById('gameboard'); 
        const render = (boardParam) => {
            boardContainer.innerHTML = '';
            boardParam.forEach((row, rowIndex) => {
                row.forEach((cellValue, colIndex) => {
                    let cellElement = document.createElement('div');
                    cellElement.classList.add('cell');
                    cellElement.innerHTML = cellValue;
                    bindCellElement(cellElement, rowIndex, colIndex);
                    boardContainer.appendChild(cellElement);
                });
            });
        };
        
        const bindCellElement = (cell, row, col) => {
            cell.addEventListener('click', () => {
                pubsub.publish('cellClicked', {row, col});
            });
        };

        // reset button
        const resetButton = document.getElementById('resetbtn');
        resetButton.addEventListener('click', () => {
            pubsub.publish('requestReset');
        })

        // score update
        const renderNewScore = ({ marker, score }) => {
            if (marker === 'X') {
                document.getElementById('x-score').innerHTML = score;
            } else if(marker === 'O') {
                document.getElementById('o-score').innerHTML = score;
            }
        };

        // change name
        const names = document.querySelectorAll('.name');
        names.forEach(nm => {
            nm.addEventListener('click', (e) => {
                newName = prompt('Change name to...');
                if(newName == '') {
                    alert('player name cannot be blank');
                }else {
                    e.target.innerHTML = newName;
                }
            })
        })

        pubsub.subscribe('scoreUpdated', renderNewScore);
        pubsub.subscribe('resetBoard', render);
        pubsub.subscribe('updatedBoard', render);

        return { render };
    })();

    // Player constructor function, used in the game controller module. 
    const Player = function(marker) {
        let score = 0;
        return { marker, score }
    };

    // gameController module. handles game logic. 
    const gameController = (function() {
        let playerX = Player('X');
        let PlayerO = Player('O');
        let currentPlayer = playerX;

        const handleCellClicked = ({row, col}) => {
            gameBoard.makeMove(currentPlayer.marker, row, col);
            if (checkWin()) {
                alert(`${currentPlayer.marker} is the winner!`)
                updateScore(currentPlayer);
                console.log(currentPlayer.marker + ' - ' + currentPlayer.score);
                gameBoard.resetBoard();
            };

            if(checkDraw()) {
                alert(`It's a draw!`);
                gameBoard.resetBoard();
                return;
            }

            currentPlayer = (currentPlayer == playerX) ? PlayerO : playerX;

        };

        const checkWin = () => {
            let board = gameBoard.getBoard();
            let winningConditions = [
                [[0,0], [0,1], [0,2]],
                [[1,0], [1,1], [1,2]],
                [[2,0], [2,1], [2,2]],
                [[0,0], [1,0], [2,0]],
                [[0,1], [1,1], [2,1]],
                [[0,2], [1,2], [2,2]],
                [[0,0], [1,1], [2,2]],
                [[0,2], [1,1], [2,0]]
            ];

            for(let condition of winningConditions) {
                const [a, b, c] = condition;
                const [rowA, colA] = a;
                const [rowB, colB] = b;
                const [rowC, colC] = c;

                if(board[rowA][colA] !== '' && board[rowA][colA] === board[rowB][colB] && board[rowA][colA] === board[rowC][colC]) {
                    return true;
                }

            }
        };

        const checkDraw = () => {
            const board = gameBoard.getBoard();
            const flatBoard = board.flat();

            if(flatBoard.every(item => item !== '')) return true;

        };

        const updateScore = (player) => {
            player.score += 1;
            let marker = player.marker;
            let score = player.score;
            pubsub.publish('scoreUpdated', { marker, score });
        };

        const startGame = () => {
            displayController.render(gameBoard.getBoard());
        }

        pubsub.subscribe('cellClicked', handleCellClicked);

        return { startGame };
    })();

    gameController.startGame();

})()