import Gameboard from "./Gameboard.js"

export {renderGameInitial, renderGameboard, renderShips, waitForClickAttack, renderAttack, findElementToAttack, displayShipPlacement}

const body = document.querySelector('body')
const message = document.createElement('div')
const gameBtnContainer = document.createElement('div');
const orientationBtn = document.createElement('button');


function renderGameInitial() {
  const titleContainer = document.createElement('div')
  titleContainer.classList.add('title-container')
  body.append(titleContainer)

  const title = document.createElement('h1')
  title.classList.add('title')
  title.textContent = "Battleship"
  titleContainer.append(title)

  message.classList.add('turn-msg')
  body.append(message);
  body.append(gameBtnContainer);
  gameBtnContainer.classList.add('game-btn-cont')
  orientationBtn.classList.add('game-btn')
  orientationBtn.textContent = "Vertical"
  gameBtnContainer.append(orientationBtn)
  const bothBoardsCont = document.createElement('div')
  bothBoardsCont.classList.add('both-boards-cont')
  body.append(bothBoardsCont)
}

function renderGameboard(player) {
  const bothBoardsCont = document.querySelector('.both-boards-cont')
  const boardContainer = document.createElement('div')
  boardContainer.classList.add('board-container')
  bothBoardsCont.append(boardContainer)
  const playerName = document.createElement('h2');
  playerName.classList.add('player-name')
  playerName.textContent = player.name
  boardContainer.append(playerName)
  const board = document.createElement('div');
  boardContainer.append(board)
  board.classList.add('board');
  board.classList.add(`${player.name}-board`)
  for (let i=0; i<10; i++) {
    for (let j=0; j<10; j++) {
      const boardItem = document.createElement('div');
      boardItem.classList.add('board-item');
      boardItem.setAttribute('data-index',`${i}, ${j}`);
      board.append(boardItem);
    }
  }
  
}

function renderShips(ship, player) {
  const board = document.querySelector(`.${player.name}-board`)
  
  ship.spots.forEach(spot => {
    //maybe edit this so only shows the ships of player.
    // but currently the player board is first so it finds the spots on that baord anyway so might be fine.
    const domSpot = document.querySelector(`[data-index='${spot[0]}, ${spot[1]}']`)
    // console.log(domSpot)
    domSpot.classList.add('placed-ship')
  })
}

function renderAttack(attacker, playerToAttack, row, column, element) {
  let attackReturn = playerToAttack.gameboard.receiveAttack(row, column);
  if (attackReturn=='Hit!') {
    element.style.background = 'red'
    playerToAttack.gameboard.ships.forEach(ship => {
      console.log(`Length: ${ship.length}, NumOfTimesHit: ${ship.numOfTimesHit}`);
    })
  }
   else if (attackReturn=='All ships sunk!') {
    playerToAttack.gameboard.ships.forEach(ship => {
      console.log(`Length: ${ship.length}, NumOfTimesHit: ${ship.numOfTimesHit}`);
    })
    element.style.background = 'red'
    console.log('All ships sunk!')
    message.textContent = `${attacker.name} wins!!!`
      return 
    } 
    
   else if (attackReturn=='Miss') {
    element.style.background = 'green'
  } else {
    console.log(playerToAttack.gameboard.hitShots)
    console.log(playerToAttack.gameboard.allShipsSunk)
  }
  console.log(playerToAttack.gameboard.hitShots)
}

function handleFinishedPlacement(player, opponent) {
  message.textContent = 'Press start to begin';
  createStartBtn(player, opponent);
  orientationBtn.remove()
}


function waitForClickAttack(opponent, player) {
  function clickHandler (e) {
    message.textContent = "Game in progress";
    const dataIndex = this.getAttribute('data-index')
    const row = dataIndex.substring(0,1)
    const column = dataIndex.substring(3)

    //fixed the error of functions being called twice by setting the return value to a variable
    //before, I think it called them multple times since the function calls were within the if/else conditions
    let turn = 0;
    renderAttack(player, opponent, row, column, this)
    turn++;


    const randSpot = opponent.gameboard.calcRandAttack(player);
    const randRow = randSpot[0];
    const randColumn = randSpot[1];
    const element = findElementToAttack(player, randRow, randColumn)
    renderAttack(opponent, player, randRow, randColumn, element);



    
      

    
  }
  const boardToAttack = document.querySelector(`.${opponent.name}-board`)
  const boardArr = Array.from(boardToAttack.children)
  //maybe do for loop of an array of the elements and remove 
  //the element from the array once attack that spot
  boardArr.forEach(element => {
    element.addEventListener('click', clickHandler, {once: true}) 
  })

  

    boardArr.forEach(element => {
      element.addEventListener('click', ()=> {
        if (player.gameboard.allShipsSunk || opponent.gameboard.allShipsSunk) {
        boardArr.forEach(element => {
          element.removeEventListener('click', clickHandler)
        })
      }
      })
    })
  
  
  

}

function findElementToAttack(playerToAttack, row, column) {
  const boardToAttack = document.querySelector(`.${playerToAttack.name}-board`)
  const domSpot = boardToAttack.querySelector(`[data-index='${row}, ${column}']`)

  return domSpot;
}

// function placeAllShips(player) {
//   displayShipPlacement(play)
// }

function displayShipPlacement(player, shipIndex, initOrientation, opponent) {
  let ship = player.ships[shipIndex];
  message.textContent = `Place your ${ship.name}`;
  let orientation = initOrientation
  const boardToPlace = document.querySelector(`.${player.name}-board`)
  const boardItems = boardToPlace.children;
  let length = ship.length

  removeSpotListeners();

  if (orientation == 'horizontal') {
    Array.from(boardItems).filter(item => {
      return item.getAttribute('data-index').substring(3) <= (9-length+1)
    }).forEach(spot => {
      spot.addEventListener('mouseenter', hoverHandlerEnterHorizontal)
      spot.addEventListener('mouseleave', horizontalMouseLeave)
      spot.addEventListener('click', renderShipPlacement)
    })
    orientationBtn.textContent = 'Horizontal'
  } else {
    Array.from(boardItems).filter(item => {
      return item.getAttribute('data-index').substring(0,1) <= (9-length+1)
    }).forEach(spot => {
      spot.addEventListener('mouseenter', hoverHandlerEnterVertical)
      spot.addEventListener('mouseleave', verticalMouseLeave)
      spot.addEventListener('click', renderShipPlacement)
    })
    orientationBtn.textContent = "Vertical"
  }

  

  

  function removeSpotListeners() {
    for (let i=0; i<10; i++) {
      for (let j=0; j<10; j++) {
        boardToPlace.querySelector(`[data-index='${i}, ${j}']`).removeEventListener('mouseenter', hoverHandlerEnterHorizontal)
        boardToPlace.querySelector(`[data-index='${i}, ${j}']`).removeEventListener('mouseenter', hoverHandlerEnterVertical)
        boardToPlace.querySelector(`[data-index='${i}, ${j}']`).removeEventListener('mouseleave', verticalMouseLeave)
        boardToPlace.querySelector(`[data-index='${i}, ${j}']`).removeEventListener('mouseleave', horizontalMouseLeave)
        boardToPlace.querySelector(`[data-index='${i}, ${j}']`).removeEventListener('click', renderShipPlacement)
        boardToPlace.querySelector(`[data-index='${i}, ${j}']`).onmouseleave = ''
        boardToPlace.querySelector(`[data-index='${i}, ${j}']`).classList.remove('hover')
      }
    }
  }

  function removeBtnClickListener() {
    orientationBtn.onclick = ''
  }



  function renderShipPlacement() {
    
    removeBtnClickListener();
    let row = Number(this.getAttribute('data-index').substring(0,1))
      let column = Number(this.getAttribute('data-index').substring(3))
    if (orientation == 'vertical') {
      // let end = row+length-1;
      let placeShipReturn = player.gameboard.placeShip(ship, row, column, 'vertical');
      console.log(placeShipReturn)
      if (placeShipReturn == undefined) {
        removeSpotListeners();
        renderShips(ship, player)
        if (shipIndex<player.ships.length-1) {
          displayShipPlacement(player, shipIndex+1, orientation, opponent)
       } else {
        handleFinishedPlacement(player, opponent)
       }

      }
      console.log(ship.spots)
      
      
    } else {
      // let end = Number(column) + length - 1;
      let placeShipReturn = player.gameboard.placeShip(ship, row, column, 'horizontal');
      console.log(placeShipReturn)
      if (placeShipReturn == undefined) {
        removeSpotListeners();
        renderShips(ship, player)
        if (shipIndex<player.ships.length-1) {
          displayShipPlacement(player, shipIndex+1, orientation, opponent)
       } else {
        handleFinishedPlacement(player, opponent)
       }
      

    }
    console.log(ship.spots)
      
    }
    
  }


  orientationBtn.onclick = () => {
    removeSpotListeners();
    if (orientationBtn.textContent =='Vertical') {
      orientation = 'horizontal'
      orientationBtn.textContent = "Horizontal";
      Array.from(boardItems).filter(item => {
        return item.getAttribute('data-index').substring(3) <= (9-length+1)
      }).forEach(spot => {
        spot.addEventListener('mouseenter', hoverHandlerEnterHorizontal)
        spot.addEventListener('mouseleave', horizontalMouseLeave)
        spot.addEventListener('click', renderShipPlacement)
      })
      
    } else {
      orientation = 'vertical'
      orientationBtn.textContent = "Vertical";
      Array.from(boardItems).filter(item => {
        return item.getAttribute('data-index').substring(0,1) <= (9-length+1)
      }).forEach(spot => {
        spot.addEventListener('mouseenter', hoverHandlerEnterVertical)
        spot.addEventListener('mouseleave', verticalMouseLeave)
        spot.addEventListener('click', renderShipPlacement)
      })
      
    }
  }

  function hoverHandlerEnterVertical() {
    let row = this.getAttribute('data-index').substring(0,1)
    let column = this.getAttribute('data-index').substring(3)
    let end = 0;
    if (Number(row)+length-1 > 9) {
      end = 9
    } else {
      end = Number(row)+length-1
    }

      
      for (let i=row; i<=end; i++) {
        boardToPlace.querySelector(`[data-index='${i}, ${column}']`).classList.add('hover')
      }
  }

  function hoverHandlerEnterHorizontal() {
    let row = this.getAttribute('data-index').substring(0,1)
    let column = this.getAttribute('data-index').substring(3)
    let end = 0;
    if (Number(column)+length-1 >9) {
      end = 9
    } else {
      end = Number(column)+ length-1
    }
    for (let i=column; i<=end; i++) {
      boardToPlace.querySelector(`[data-index='${row}, ${i}']`).classList.add('hover')
    }
  }

    function verticalMouseLeave() {
      Array.from(boardItems).forEach(spot => {
        spot.addEventListener('mouseleave', () => {
          Array.from(boardItems).forEach(spot => {
            spot.classList.remove('hover')
          })
        })
      })
    }
    
  function horizontalMouseLeave(){
    Array.from(boardItems).forEach(spot => {
      spot.addEventListener('mouseleave', () => {
        Array.from(boardItems).forEach(spot => {
          spot.classList.remove('hover')
        })
      })
    })
  }

}

function createStartBtn(player, opponent) {
  const startBtn = document.createElement('button')
  const form = document.createElement('form')
  const restartBtn = document.createElement('input')
  restartBtn.setAttribute('type', 'submit')
  restartBtn.value = 'Restart'
  startBtn.classList.add('game-btn')
  restartBtn.classList.add('game-btn')

  startBtn.textContent = "Start"
  gameBtnContainer.append(startBtn)
  startBtn.addEventListener('click', () => {
    message.textContent = "User's move"
    waitForClickAttack(opponent, player);
    startBtn.remove()
    gameBtnContainer.append(form)
    form.append(restartBtn)
  })
}