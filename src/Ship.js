export default class Ship {
  constructor(length, name) {
    this.length = length;
    this.name = name;
    this.numOfTimesHit = 0;
    this.spots = [];
    this.orientation;
  }

  hit() {
    this.numOfTimesHit ++;
  }

  isSunk() {
    if (this.numOfTimesHit>=this.length) {
      return true;
    } else if (this.numOfTimesHit<this.length) {
      return false;
    } else {
      return 'ERROR';
    }
  }
}