import Gameboard from "./Gameboard.js";
import Ship from "./Ship.js";
import './styles.css'

export default class Player {
  constructor(playerName) {
    this.name = playerName;
    this.gameboard;
    this.carrier = new Ship(5, 'carrier');
    this.battleship = new Ship(4, 'battleship')
    this.destroyer = new Ship(3, 'destroyer')
    this.submarine = new Ship(3, 'submarine')
    this.patrolBoat = new Ship(2, 'patrol boat')
    this.ships = [this.carrier, this.battleship, this.destroyer, this.submarine, this.patrolBoat]
  }
}