/**
 * @jest-environment jsdom
 */

import {jest} from '@jest/globals';

import Gameboard from "./Gameboard.js";
import Ship from "./Ship.js";
import Player from "./Player.js";
import { gameLoop } from "./index.js";



test('places carrier horizontally at [0,0], receives attacks at [0,0] and [0,1]', () => {
  const gameboard = new Gameboard();
  const carrier = new Ship(5)
  gameboard.placeShip(carrier, 0, 0, "horizontal")
  expect(gameboard.board).toEqual([
    [carrier, carrier, carrier, carrier, carrier, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null]


  ]);
  gameboard.receiveAttack(0,0);
  expect(gameboard.board[0][0].numOfTimesHit).toBe(1)
  gameboard.receiveAttack(0,1)
  expect(gameboard.board[0][1].numOfTimesHit).toBe(2)
  expect(gameboard.hitShots).toEqual([[0,0], [0,1]])
})

test('places ship of length 5 vertically at [0,0]', () => {
  const gameboard = new Gameboard();
  const carrier = new Ship(5)
  gameboard.placeShip(carrier, 0, 0, "vertical")
  expect(gameboard.board).toEqual([
    [carrier, null, null, null, null, null, null, null, null, null],
    [carrier, null, null, null, null, null, null, null, null, null],
    [carrier, null, null, null, null, null, null, null, null, null],
    [carrier, null, null, null, null, null, null, null, null, null],
    [carrier, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null]

  ]);
})

test('returns "Error: invalid move (out of bounds of board)." for placing ship of length 5 vertically at (9,0)', () => {
  const gameboard = new Gameboard();
  const carrier = new Ship(5)
  expect(gameboard.placeShip(carrier, 9, 0, "vertical")).toEqual("Error: invalid move (out of bounds of board).")
})

test('places ship of length 5 vertically at [0,0]', () => {
  const gameboard = new Gameboard();
  const carrier = new Ship(5)
  const battleship = new Ship(4);
  gameboard.placeShip(carrier, 2, 2, "vertical")
  gameboard.placeShip(battleship, 2, 0, "horizontal")
  expect(gameboard.board).toEqual(
    [
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, carrier, null, null, null, null, null, null, null],
    [null, null, carrier, null, null, null, null, null, null, null],
    [null, null, carrier, null, null, null, null, null, null, null],
    [null, null, carrier, null, null, null, null, null, null, null],
    [null, null, carrier, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null]

  ]
  );
})

test('adds ship that is placed to the ships property of the gameboard', () => {
  const gameboard = new Gameboard();
  const carrier = new Ship(5)
  gameboard.placeShip(carrier, 2, 2, "vertical");
  expect(gameboard.ships).toEqual([carrier]);
})

test('adds missed shot to missedShots array', () => {
  const gameboard = new Gameboard();
  const carrier = new Ship(5)
  gameboard.placeShip(carrier, 0, 0, "horizontal")
  gameboard.receiveAttack(1,0)
  expect(gameboard.missedShots).toEqual([[1,0]])
})

test('tests that hitting same spot twice wont register as two hits', () => {
  const gameboard = new Gameboard();
  const carrier = new Ship(5)
  gameboard.placeShip(carrier, 0, 0, "horizontal")
  gameboard.receiveAttack(0,1);
  
  expect(gameboard.receiveAttack(0,1)).toBe("Already hit here!")
  gameboard.receiveAttack(0,1)
  expect(gameboard.hitShots).toEqual([[0,1]]);
  expect(carrier.numOfTimesHit).toEqual(1);

})

test('shows that patrol boat is sunk after two hits', () => {
  const gameboard = new Gameboard();
  const patrolBoat = new Ship(2)
  gameboard.placeShip(patrolBoat, 6, 7, "vertical")
  gameboard.receiveAttack(6,7);
  // expect(patrolBoat.isSunk()).toBe(true);
  expect(gameboard.ships).toEqual([patrolBoat]);
  expect(gameboard.allShipsSunk).toBe(false);
  gameboard.receiveAttack(7,7);
  expect(gameboard.allShipsSunk).toBe(true);
})

test('placing all 5 ships from index for player', () => {
  const player = new Player("Player");
  const opponent = new Player("Opponent");
  gameLoop(player, opponent);
  expect(player.gameboard.board).toEqual(
    [
    [null, null, null, null, null, null, null, null, player.submarine, null],
    [null, player.patrolBoat, player.patrolBoat, null, null, null, null, null, player.submarine, null],
    [player.battleship, null, player.carrier, null, null, null, null, null, player.submarine, null],
    [player.battleship, null, player.carrier, null, null, null, null, null, null, null],
    [player.battleship, null, player.carrier, null, null, null, null, null, null, null],
    [player.battleship, null, player.carrier, null, null, null, null, null, null, null],
    [null, null, player.carrier, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, player.destroyer, player.destroyer, player.destroyer, null, null, null, null, null]

  ]
  );

  expect(opponent.gameboard.board).toEqual(
    [
    [opponent.carrier, null, null, null, null, null, null, null, null, null],
    [opponent.carrier, null, null, opponent.destroyer, opponent.destroyer, opponent.destroyer, null, null, null, null],
    [opponent.carrier, null, null, null, null, null, null, null, null, null],
    [opponent.carrier, null, null, null, null, null, null, null, null, null],
    [opponent.carrier, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, opponent.battleship, opponent.battleship, opponent.battleship, opponent.battleship, null, null, null, null, null],
    [opponent.submarine, null, null, null, null, null, null, null, null, null],
    [opponent.submarine, null, null, null, null, null, null, null, opponent.patrolBoat, null],
    [opponent.submarine, null, null, null, null, null, null, null, opponent.patrolBoat, null]

  ]
  );
})

// test.skip('testing last hit to result in all ships sunk', () => {
//   const opponent = new Player("Opponent");
//   opponent.gameboard.placeShip(opponent.carrier, 0, 0, "vertical")
//   opponent.gameboard.placeShip(opponent.battleship, 6, 1, 'horizontal')
//   opponent.gameboard.placeShip(opponent.destroyer, 1, 3, "horizontal")
//   opponent.gameboard.placeShip(opponent.submarine, 7, 0, 'vertical')
//   opponent.gameboard.placeShip(opponent.patrolBoat, 8,8,'vertical')

//   opponent.gameboard.receiveAttack(0,0)
//   opponent.gameboard.receiveAttack(1,0)
//   opponent.gameboard.receiveAttack(2,0)
//   opponent.gameboard.receiveAttack(3,0)
//   opponent.gameboard.receiveAttack(4,0)

//   opponent.gameboard.receiveAttack(7,0)
//   opponent.gameboard.receiveAttack(8,0)
//   opponent.gameboard.receiveAttack(9,0)

//   opponent.gameboard.receiveAttack(6,1)
//   opponent.gameboard.receiveAttack(6,2)
//   opponent.gameboard.receiveAttack(6,3)
//   opponent.gameboard.receiveAttack(6,4)

//   opponent.gameboard.receiveAttack(8,8)
//   opponent.gameboard.receiveAttack(9,8)

//   opponent.gameboard.receiveAttack(1,3)
//   opponent.gameboard.receiveAttack(1,4)

//   expect(opponent.gameboard.receiveAttack(1,5)).toBe("All ships sunk!s")
//   // opponent.gameboard.receiveAttack(1,5)

//   opponent.gameboard.receiveAttack(0,0)
//   opponent.gameboard.receiveAttack(0,0)
//   opponent.gameboard.receiveAttack(0,0)
// })

test('returning the concatenation of two arrays', () => {
  const opponent = new Player("Opponent");
  const opponentGameboard = new Gameboard();
  opponent.gameboard = opponentGameboard;
  opponent.gameboard.placeShip(opponent.carrier, 0, 0, "vertical")
  opponent.gameboard.placeShip(opponent.battleship, 6, 1, 'horizontal')
  opponent.gameboard.placeShip(opponent.destroyer, 1, 3, "horizontal")
  opponent.gameboard.placeShip(opponent.submarine, 7, 0, 'vertical')
  opponent.gameboard.placeShip(opponent.patrolBoat, 8,8,'vertical')
  opponent.gameboard.receiveAttack(0,0)
  opponent.gameboard.receiveAttack(1,0)
  opponent.gameboard.receiveAttack(2,0)
  opponent.gameboard.receiveAttack(9,9)
  opponent.gameboard.receiveAttack(9,8)
  opponent.gameboard.receiveAttack(9,7)
  opponent.gameboard.receiveAttack(9,6)
  opponent.gameboard.receiveAttack(9,5)
  opponent.gameboard.receiveAttack(9,4)
  opponent.gameboard.receiveAttack(9,3)
  opponent.gameboard.receiveAttack(9,2)
  opponent.gameboard.receiveAttack(9,1)
  opponent.gameboard.receiveAttack(9,0)

  expect(opponent.gameboard.calcRandAttack()).toEqual([Array.from([0,0])])
})

