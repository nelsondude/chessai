import copy
import random

def myDeepCopy(a):
    if (isinstance(a, list) or isinstance(a, tuple)):
        return [myDeepCopy(element) for element in a]
    else:
        return copy.copy(a)


def print2D(l):
    print('\n')
    for row in l:
        print(row)


def getRowCol(coors1, coors2):
    return [coors1['row'], coors1['col'], coors2['row'], coors2['col']]

def outOfBounds(row, col):
    return row < 0 or row > 7 or col < 0 or col > 7


def legalPieceChecks(board, coors1, coors2):
    curRow, curCol, newRow, newCol = getRowCol(coors1, coors2)
    piece = board[curRow][curCol]
    if not piece:
        return False

    name = piece['name']

    if (outOfBounds(newRow, newCol)):
        return False

    if (isSameSide(board, coors1, coors2)):
        return False

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
        legal = isLegalPawn(board, coors1, coors2)
    elif (name == 'king'):
        legal = isLegalKing(coors1, coors2)

    if (legal and name != 'knight' and isBlocked(board, coors1, coors2)):
        return False

    return legal

# class method
# Make recursive
def minimaxRoot(board, color, isMaximisingPlayer, depth):
    moves = getAllMoves(board, color)
    bestMove = -9999
    bestMovesFound = []

    # bestMoveFound = moves[0]
    for i in range(len(moves)):
        move = moves[i]
        temp = createTempBoard(board, move['coors1'], move['coors2'])
        value = minimax(depth - 1, temp, getOtherColor(color), -10000, 10000, not isMaximisingPlayer)
        # if (value >= bestMove):
        #     bestMove = value
        #     bestMoveFound = move
        if (value == bestMove):
            bestMove = value
            bestMovesFound.append(move)
        elif (value > bestMove):
            bestMove = value
            bestMovesFound = [move]
    # return bestMoveFound
    return random.choice(bestMovesFound) if len(moves) > 0 else None


# Minimax Method with alpha beta pruning
def minimax(depth, board, color, alpha, beta, isMaximisingPlayer):
    if depth == 0:
        return getPoints(board, color)
    moves = getAllMoves(board, color)
    if isMaximisingPlayer:
        bestMove = -9999
        for i in range(len(moves)):
            move = moves[i]
            temp = createTempBoard(board, move['coors1'], move['coors2'])
            bestMove = max(bestMove, minimax(depth - 1, temp, getOtherColor(color), alpha, beta, not isMaximisingPlayer))
            alpha = max(alpha, bestMove)
            if (beta <= alpha):
                return bestMove
        return bestMove
    else:
        bestMove = 9999
        for i in range(len(moves)):
            move = moves[i]
            temp = createTempBoard(board, move['coors1'], move['coors2'])
            bestMove = min(bestMove, minimax(depth - 1, temp, getOtherColor(color), alpha, beta, not isMaximisingPlayer))
            beta = min(beta, bestMove)
            if (beta <= alpha):
                return bestMove
        return bestMove


def getBestMove(board, color, depth):
    move = minimaxRoot(board, color, True, depth)
    newBoard = createTempBoard(board, move['coors1'], move['coors2']) if move else board

    return {
        'board': newBoard,
        'mate': move == None
    }



# Static method
def getPoints(board, color):
    total = 0
    for row in board:
        for square in row:
            if (square):
                if square['color'] == color:
                    total -= square['value']
                else:
                    total += square['value']
    return total

# class method
def getRandomMove(board, color):
    moves = getAllMoves(board, color)
    random_move = random.choice(moves)
    temp = createTempBoard(board, random_move['coors1'], random_move['coors2'])
    return temp

# static method
def getAllMoves(board, color):
    moves = []
    for i in range(len(board)):
        for j in range(len(board)):
            square = board[i][j]
            if (square and square['color'] == color):
                coors1 = {'row': i, 'col': j}
                legalMoves = getLegalMovesForPiece(board, coors1)
                if (len(legalMoves) > 0):
                    moves.extend(legalMoves)
    return moves

# def getNumLegalMoves(board, color):
#     return len(getAllMoves(board, color))


def getLegalMovesForPiece(board, coors1):
    moves = []
    for i in range(len(board)):
        for j in range(len(board)):
            coors2 = {'row': i, 'col': j}
            if isLegal(board, coors1, coors2):
                moves.append({'coors1': coors1, 'coors2': coors2})
    return moves

def isLegal(board, coors1, coors2):
    legal = legalPieceChecks(board, coors1, coors2)

    if legal:
        curRow, curCol, newRow, newCol = getRowCol(coors1, coors2)
        piece = board[curRow][curCol]
        tempBoard = createTempBoard(board, coors1, coors2)
        legal = not isColorInCheck(tempBoard, piece['color'])

        # Checks to see if tempboard has check once moved

    # castle_board = isLegalCastle(board, coors1, coors2)
    # if (castle_board)
    # 1. Does the move put the current player in check?
    # 2. Does the move go through any piece? NA for Knight
    # 3. Does the move go on the same color piece

    return legal

def modifyLegalBoard(board, coors1, coors2):
    # board = isLegalCastle(board, coors1, coors2)
    # piece = getPiece(board, coors1)
    # if (castle and not isColorInCheck(castle, piece['color'])):
    #     return castle
    return createTempBoard(board, coors1, coors2)


def isColorInCheck(tempBoard, color):
    coors2 = getCoorsFromNameColor(tempBoard, 'king', color)
    color2 = getOtherColor(color)
    for i in range(len(tempBoard)):
        row = tempBoard[i]
        for j in range(len(row)):
            square = row[j]
            if (square and square['color'] == color2):
                coors1 = {'row': i, 'col': j}
                if legalPieceChecks(tempBoard, coors1, coors2):
                    return True
    return False

def getCoorsFromNameColor(board, name, color):
    for i in range(len(board)):
        row = board[i]
        for j in range(len(row)):
            square = row[j]
            if (square and square['name'] == name and square['color'] == color):
                return {'row': i, 'col': j}
    return None

def createTempBoard(board, coors1, coors2):
    temp = myDeepCopy(board)
    curRow, curCol, newRow, newCol = getRowCol(coors1, coors2)
    piece = temp[curRow][curCol]
    if piece: piece['moved'] = True
    temp[curRow][curCol] = None
    temp[newRow][newCol] = piece
    return temp

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
    # king side castle:
    # two squares must be empty
    # Check to see if king is blocked by going to the corner
    # King and Rook have already moved
    rowDif, colDif = getRowColDif(coors1, coors2)
    piece = getPiece(board, coors1)

    if (colDif != 2 or rowDif != 0):
        return False
    if (piece['name'] != 'king'):
        return False
    if piece and piece['moved'] == True:
        return False

    corner = {'row': 7, 'col': 7}
    rookMove = {'row': 7, 'col': 5}
    piece2 = getPiece(board, corner)
    if piece2 and piece2['moved'] == True:
        return False
    if isBlocked(board, coors1, corner):
        return False

    mod1 = createTempBoard(board, coors1, coors2);
    mod2 = createTempBoard(mod1, corner, rookMove)

    return mod2



def getPiece(board, coors):
    return board[coors['row']][coors['col']]

def isSameSide(board, coors1, coors2):
    piece = getPiece(board, coors1)
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

def isMovingForward(board, coors1, coors2):
    piece = getPiece(board, coors1)
    if (piece['color'] == 'dark'):
        return coors2['row'] > coors1['row']
    else:
        return coors1['row'] > coors2['row']

# Piece Legal Functions
def isLegalKnight(coors1, coors2):
    rowDif, colDif = getRowColDif(coors1, coors2)
    return (max(rowDif, colDif) == 2 and min(rowDif, colDif) == 1)

def isPieceOfColor(board, coors, color):
    piece = getPiece(board, coors)
    if (piece):
        return piece['color'] == color
    return False

def isPieceAtCoors(board, coors):
    return board[coors['row']][coors['col']] != None

def getOtherColor(color):
    return 'light' if color == 'dark' else 'dark'


def isLegalPawn(board, coors1, coors2):
    rowDif, colDif = getRowColDif(coors1, coors2)
    piece = getPiece(board, coors1)
    if not isMovingForward(board, coors1, coors2):
        return False
    if isDiagonalMove(coors1, coors2):
        diagGood = isPieceOfColor(board, coors2, getOtherColor(piece['color']))
        if (rowDif != 1 or colDif != 1 or not diagGood):
            return False
        return True
    if isVerticalMove(coors1, coors2) and not isPieceAtCoors(board, coors2):
        if (coors1['row'] == 1 or coors1['row'] == 6):
            return rowDif <= 2
        else:
            return rowDif <= 1

    return False

def isLegalRook(coors1, coors2):
    return (isHorizontalMove(coors1, coors2) ^
			isVerticalMove(coors1, coors2))

def isLegalQueen(coors1, coors2):
    return (isLegalBishop(coors1, coors2) or
			isLegalRook(coors1, coors2))

def isLegalKing(coors1, coors2):
    rowDif, colDif = getRowColDif(coors1, coors2)
    return (rowDif <= 1 and colDif <= 1)

def isLegalBishop(coors1, coors2):
    return isDiagonalMove(coors1, coors2)
