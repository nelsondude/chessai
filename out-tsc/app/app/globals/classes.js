var Piece = (function () {
    function Piece(name, color) {
        this.name = name;
        this.color = color;
    }
    return Piece;
}());
export { Piece };
var Coor = (function () {
    function Coor(row, col) {
        this.row = row;
        this.col = col;
    }
    return Coor;
}());
export { Coor };
var Pos = (function () {
    function Pos(x, z) {
        this.x = x;
        this.z = z;
    }
    return Pos;
}());
export { Pos };
var Change = (function () {
    function Change(oldCoor, newCoor, piece) {
        this.oldCoor = oldCoor;
        this.newCoor = newCoor;
        this.piece = piece;
    }
    return Change;
}());
export { Change };
//# sourceMappingURL=classes.js.map