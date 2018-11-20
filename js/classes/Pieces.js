class Piece {
  constructor(color, id){
    this.color = color;
    this.name = this.constructor.name.toLowerCase();
    this.id = id;

    // this.position = position
    this.moved = false;
    // this.justMoved = false;
    this.value = this.getValue();
  }
  getValue() {
    switch (this.constructor.name.toLowerCase()) {
      case 'pawn':
        return 10;
      case 'knight':
        return 30;
      case 'rook':
        return 50;
      case 'bishop':
        return 35;
      case 'queen':
        return 90;
      case 'king':
        return 900;
      default:
        return 0;
    }
  }
}


class Rook extends Piece {

}

class Pawn extends Piece { }

class Queen extends Piece { }

class King extends Piece { }

class Knight extends Piece { }

class Bishop extends Piece { }

module.exports = {
  Rook: Rook,
  Pawn: Pawn,
  Queen: Queen,
  King: King,
  Knight: Knight,
  Bishop: Bishop
};
