import Gameboard from "./Gameboard.js";
import Player from "./Player.js";
import Ship from "./Ship.js";
import { renderGameInitial, renderGameboard, renderShips, waitForClickAttack, renderAttack, findElementToAttack, displayShipPlacement } from "./DOM.js";

export {gameLoop}

function gameLoop(player1, player2) {
  const playerGameboard = new Gameboard();
  const opponentGameboard = new Gameboard();
  const player = player1;
  player.gameboard = playerGameboard;
  const opponent = player2;
  opponent.gameboard = opponentGameboard;
  
  renderGameInitial();

  renderGameboard(player);
  renderGameboard(opponent);


  opponent.gameboard.randomlyPlaceShip(opponent.carrier);
  opponent.gameboard.randomlyPlaceShip(opponent.battleship);
  opponent.gameboard.randomlyPlaceShip(opponent.destroyer);
  opponent.gameboard.randomlyPlaceShip(opponent.submarine);
  opponent.gameboard.randomlyPlaceShip(opponent.patrolBoat);



  //after this ship is placed, then the rest of the ships are placed one by one
  //also links into start game

  // tried to make all of these things happen in gameLoop, but they all depended on an event,
  // so I put it in the DOM module

  displayShipPlacement(player, 0, "vertical", opponent)




}

gameLoop(new Player("User"), new Player("Opponent"));