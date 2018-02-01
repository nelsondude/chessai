import math

def getRowCol(coors1, coors2):
	return [coors1['row'], coors1['col'], coors2['row'], coors2['col']]

def isLegal(board, coors1, coors2):
    curRow, curCol, newRow, newCol = getRowCol(coors1, coors2)
    piece = board[curRow][curCol]
    name = piece['name']
    legal = False

    if (name == 'knight'):
        legal = isLegalKnight(coors1, coors2)
    elif (name == 'queen'):
        legal = isLegalQueen(coors1, coors2)
    elif (name == 'bishop'):
        legal = isLegalBishop(coors1, coors2)
    elif (name == 'rook'):
        legal = isLegalRook(coors1, coors2)
    elif (name == 'pawn'):
        legal = isLegalPawn()
    elif (name == 'king'):
        legal = isLegalKing(coors1, coors2)
    print(piece)

    # 1. Does the move put the current player in check?
    # 2. Does the move go through any piece? NA for Knight
    # 3. Does the move go on the same color piece
    # 4. Does the move go out of bounds

    return legal

def getRowColDif(coors1, coors2):
    rowDif = abs(coors1['row'] - coors2['row'])
    colDif = abs(coors1['col'] - coors2['col'])
    return [rowDif, colDif]

def isVerticalMove(coors1, coors2):
    return (coors1['col'] == coors2['col'])

def isHorizontalMove(coors1, coors2):
    return (coors1['row'] == coors2['row'])

def isDiagonalMove(coors1, coors2):
    rowDif, colDif = getRowColDif(coors1, coors2)
    return (rowDif == colDif)


# Piece Legal Functions
def isLegalKnight(coors1, coors2):
    rowDif, colDif = getRowColDif(coors1, coors2)
    return (max(rowDif, colDif) == 3 and min(rowDif, colDif) == 2)

def isLegalPawn():
    return True

def isLegalRook(coors1, coors2):
    return (isHorizontalMove(coors1, coors2) or
			isVerticalMove(coors1, coors2))

def isLegalQueen(coors1, coors2):
    return (isLegalBishop(coors1, coors2) or
			isLegalRook(coors1, coors2))

def isLegalKing(coors1, coors2):
    rowDif, colDif = getRowColDif(coors1, coors2)
    return (rowDif <= 1 and colDif <= 1)

def isLegalBishop(coors1, coors2):
    return isDiagonalMove(coors1, coors2)
