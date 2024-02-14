// import { NormalModule } from "webpack";
import Ship from "./Ship.js";

export default class Gameboard {
  constructor() {
    this.board = Array(10).fill(null).map(()=>Array(10).fill(null));
    this.missedShots = [];
    this.hitShots = [];
    this.ships = [];
    this.allShipsSunk = false;
    this.spotsArray = [];
    for (let i=0; i<10; i++) {
      for (let j=0; j<10; j++) {
        this.spotsArray.push([i,j]);
      }
    }
  }


  placeShip(ship, startingRow, startingColumn, orientation) {
    let localSpotsArray = [];
    if (orientation == "horizontal") {

      //handles invalid outside-of-board placements
      if (startingColumn + ship.length-1 > 9) {
        return "Error: invalid move (out of bounds of board)."
      }

      for (let col=startingColumn; col<startingColumn+ship.length; col++) {
        //handles if theres another ship at that spot
        if (this.board[startingRow][col] != null) {
          //once find that ship, go back thru the loop to change what you inputted to null
          for (let colInner = startingColumn; colInner<col; colInner++) {
            this.board[startingRow][colInner] = null;
          }
          return "Error: invalid move."
        }
        localSpotsArray.push([startingRow,col])

      }
      //only adds spots to board/ship spot arrays if goes through whole loop without being invalid
      localSpotsArray.forEach(localSpot => {
        ship.orientation = orientation
        ship.spots.push(localSpot)
        this.board[localSpot[0]][localSpot[1]] = ship;
      })
      this.ships.push(ship);
    } else if (orientation == "vertical") {

      //handles invalid outside-of-board placements
      if (startingRow + ship.length-1 > 9) {
        return "Error: invalid move (out of bounds of board)."
      }
      for (let row=startingRow; row<startingRow+ship.length; row++) {
        //handles if theres another ship at that spot
        if (this.board[row][startingColumn]!=null) {
          //once find that ship, go back thru the loop to change what you inputted to null
          for (let rowInner = startingRow; rowInner<row; rowInner++) {
            this.board[rowInner][startingColumn] = null;
          }
          return "Error: invalid move."
        }
        localSpotsArray.push([row,startingColumn])
        
      }
      localSpotsArray.forEach(localSpot => {
        ship.orientation = orientation
          ship.spots.push(localSpot)
          this.board[localSpot[0]][localSpot[1]] = ship;
        })

      this.ships.push(ship);
      
    }
  }

  randomlyPlaceShip(ship) {
    let successfulPlacement = false;
    while (!successfulPlacement) {
      const row = Math.floor(Math.random() * 10)
      const column = Math.floor(Math.random()*10)
      const randOrientationNum = Math.floor(Math.random() * 2);
      const orientation = randOrientationNum == 1 ? "vertical" : "horizontal"
      let placeShipReturn = this.placeShip(ship, row, column, orientation);
      console.log(this.ships)
      console.log(placeShipReturn)
      if (placeShipReturn == undefined) {
        successfulPlacement = true;
        console.log("Successful")
      }
    }
     
    
  }

  receiveAttack(row, col) {
    if (this.board[row][col]==null) {
      this.missedShots.push([row, col])
      return "Miss"
    } else {
      //if already hit that point wont allow you to hit again
      for (let i=0; i<this.hitShots.length; i++) {
        if (this.hitShots[i][0] == row && this.hitShots[i][1] ==col) {
          return "Already hit here!"
        }
      }
        
      
      this.hitShots.push([row, col])
      this.board[row][col].numOfTimesHit ++;

      let assumeAllSunk = true
      this.ships.forEach(ship => {
        if (ship.isSunk()==false) {
          assumeAllSunk = false
        }
      })

      if (assumeAllSunk == true) {
        this.allShipsSunk = true;
        return "All ships sunk!"
        
      }

      return "Hit!"
    }
    
  }

  returnShots() {
    const previousReceivedAttacks = this.missedShots.concat(this.hitShots)
    return previousReceivedAttacks
  }

  calcRandAttack(playerToAttack) {
    const prevShots = playerToAttack.gameboard.returnShots();

    function isNotContained(element) {
      let isNotContained = true;
      prevShots.forEach(shot => {
        if (shot[0] == element[0] && shot[1] == element[1]) {
          isNotContained = false
        }
        
      })
      return isNotContained;
    }
    
    const availableSpots = playerToAttack.gameboard.spotsArray.filter(isNotContained)
    var randSpot = availableSpots[Math.floor(Math.random()*availableSpots.length)];

    return randSpot
  }

  returnBoard() {
    return this.board;
  }

}
