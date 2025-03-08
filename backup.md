(function() {
    const PubSub = {
      events: {},
      subscribe(event, callback) {
        if(!this.events[event]) {
          this.events[event] = [];
        }
        this.events[event].push(callback);
      },
    
      publish(event, data) {
        if(this.events[event]) {
          this.events[event].forEach(callback => callback(data));
        }
      }
              publish(event, data) {
            if(this.events[event]) {
                this.events[event].forEach(callback => callback(data));
            };
        }
    }
  
    const gameboard = (function() {
      let board = [
        ['','',''],
        ['','',''],
        ['','','']
      ];
  
      const getBoard = () => {
        return board;
      }
  
      const makeMove = (marker, row, col) => {
        board[row][col] = marker;
        PubSub.publish('boardUpdated', {board});
      };
  
      const reset = () => {
        board = [
        ['','',''],
        ['','',''],
        ['','','']];
        PubSub.publish('boardUpdated', {board});
      };
  
      return { makeMove, reset, getBoard }
    })();
  
    const displayController = (function() {
      const boardContainer = document.getElementById('gameboard'); //gets the container where to draw cells
      const render = (board) => {
        clearBoard();
        board.forEach((row, rowIndex) => {
          row.forEach((cellValue, colIndex) => {
            let cell = document.createElement('div');
            cell.classList.add('cell');
            cell.innerHTML =  cellValue;
            bindCellClick(cell, rowIndex, colIndex);
            boardContainer.appendChild(cell);
          })
        });
      };
  
      const clearBoard = () => {
        boardContainer.innerHTML = '';
      };
  
      const bindCellClick = (cell, row, col) => {
        cell.addEventListener('click', () => {
          PubSub.publish('cellClicked', {row, col});
        })
      };
  
      const resetButtonListener = () => {
        let resetButton = document.getElementById('resetbtn'); 
        resetButton.addEventListener('click', () => {
          PubSub.publish('boardReset');
        })
      }
  
      PubSub.subscribe('boardReset', clearBoard);
      PubSub.subscribe('boardUpdated', (data) => render(data.board));
      resetButtonListener();
  
      return { render };
    })();
  
    const gameController = (function() {
      let currentPlayer = 'X'; 
  
      const startGame = () => {
        gameboard.reset();
        // PubSub.publish('boardUpdated', {board:gameboard.getBoard()});
      };
  
      const handleCellClick = ({row, col}) => {
        if (gameboard.getBoard()[row][col] !== '') return;
  
        gameboard.makeMove(currentPlayer, row, col);
  
        if (checkWin()) {
          alert(`${currentPlayer} wins!`);
          startGame();
          return;
        };
  
        if (checkDraw()) {
          alert(`It's a draw!`);
          startGame();
          return;
        };
  
        currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
      };
  
      const checkWin = () => {
        const board = gameboard.getBoard();
  
        const lines = [
          ...board,
          [board[0][0], board[1][0], board[2][0]],
          [board[0][1], board[1][1], board[2][1]],
          [board[0][2], board[1][2], board[2][2]],
          [board[0][0], board[1][1], board[2][2]],
          [board[0][2], board[1][1], board[2][0]]
        ];
        return lines.some(line => line.every(cell => cell === currentPlayer));
      };
  
      const checkDraw = () => {
        return gameboard.getBoard().flat().every(cell => cell !== '');
      };
  
      PubSub.subscribe('cellClicked', handleCellClick);
      PubSub.subscribe('boardReset', () => {
        currentPlayer = 'X';
        gameboard.reset();
      });

  
      return { startGame }
    })();
  
    gameController.startGame();
  })();
  
