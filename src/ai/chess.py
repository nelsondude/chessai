

def isLegal(board, coors, newCoors):
    curRow, curCol = coors['row'], coors['col']
    newRow, newCol = newCoors['row'], newCoors['col']
    piece = board[curRow][curCol]
    print(piece)

    return True