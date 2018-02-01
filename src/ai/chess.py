import math
import copy

def myDeepCopy(a):
    if (isinstance(a, list) or isinstance(a, tuple)):
        return [myDeepCopy(element) for element in a]
    else:
        return copy.copy(a)

def getRowCol(coors1, coors2):
    return [coors1['row'], coors1['col'], coors2['row'], coors2['col']]

def isLegal(board, coors1, coors2):
    curRow, curCol, newRow, newCol = getRowCol(coors1, coors2)
    piece = board[curRow][curCol]
    name = piece['name']
    legal = False

    if (isSameSide(board, coors1, coors2)):
        return False

    if (name != 'knight' and isBlocked(board, coors1, coors2)):
        return False


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
        legal = isLegalKing(coors1, coors2) or isLegalCastle(board, coors1, coors2)


    if legal:
        tempBoard = createTempBoard(board, coors1, coors2)
        legal = not inCheck(tempBoard)


    # 1. Does the move put the current player in check?
    # 2. Does the move go through any piece? NA for Knight
    # 3. Does the move go on the same color piece
    # 4. Does the move go out of bounds

    return legal

def inCheck(board):
    return False

def createTempBoard(board, coors1, coors2):
    return myDeepCopy(board)

def isBlocked(board, coors1, coors2):
    result = False
    count = 0
    if (coors2['col'] == coors1['col']):
        dir = 1 if coors2['row'] > coors1['row'] else -1
        for row in range(coors1['row'], coors2['row'], dir):
            if (board[row][coors2['col']] != None and count != 0):
                result = True
                break
            count += 1
    else:
        m = (coors2['row'] - coors1['row'])//(coors2['col'] - coors1['col'])
        dir = 1 if coors2['col'] > coors1['col'] else -1
        for col in range(coors1['col'], coors2['col'], dir):
            row = coors1['row'] + m * (col - coors1['col'])
            if (board[row][col] != None and count != 0):
                result = True
                break
            count += 1
    return result

def isLegalCastle(board, coors1, coors2):
    return False

def isSameSide(board, coors1, coors2):
    piece = board[coors1['row']][coors1['col']]
    color = piece['color']
    next = board[coors2['row']][coors2['col']]
    if (next):
        next_color = next.get('color')
        if (next_color == color):
            return True
    return False

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
    return (max(rowDif, colDif) == 2 and min(rowDif, colDif) == 1)

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
