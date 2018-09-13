import copy
import random


def my_deep_copy(a):
    if isinstance(a, list) or isinstance(a, tuple):
        return [my_deep_copy(element) for element in a]
    else:
        return copy.copy(a)


def print_2d(l):
    print('\n')
    for row in l:
        print(row)


def get_row_col(coors1, coors2):
    return [coors1['row'], coors1['col'], coors2['row'], coors2['col']]


def out_of_bounds(row, col):
    return row < 0 or row > 7 or col < 0 or col > 7


def legal_piece_checks(board, coors1, coors2):
    cur_row, cur_col, new_row, new_col = get_row_col(coors1, coors2)
    piece = board[cur_row][cur_col]
    if not piece:
        return False

    name = piece['name']

    if out_of_bounds(new_row, new_col):
        return False

    if is_same_side(board, coors1, coors2):
        return False

    legal = False
    if name == 'knight':
        legal = is_legal_knight(coors1, coors2)
    elif name == 'queen':
        legal = is_legal_queen(coors1, coors2)
    elif name == 'bishop':
        legal = is_legal_bishop(coors1, coors2)
    elif name == 'rook':
        legal = is_legal_rook(coors1, coors2)
    elif name == 'pawn':
        legal = is_legal_pawn(board, coors1, coors2)
    elif name == 'king':
        legal = is_legal_king(coors1, coors2)

    if legal and name != 'knight' and is_blocked(board, coors1, coors2):
        return False

    return legal


def minimax_root(board, color, is_maximizing_player, depth):
    moves = get_all_moves(board, color)
    best_move = -9999
    best_moves_found = []

    # bestMoveFound = moves[0]
    for i in range(len(moves)):
        move = moves[i]
        temp = create_temp_board(board, move['coors1'], move['coors2'])
        value = minimax(depth - 1, temp, get_other_color(color), -10000, 10000, not is_maximizing_player)
        # if (value >= bestMove):
        #     bestMove = value
        #     bestMoveFound = move
        if value == best_move:
            best_move = value
            best_moves_found.append(move)
        elif value > best_move:
            best_move = value
            best_moves_found = [move]
    # return bestMoveFound
    return random.choice(best_moves_found) if len(moves) > 0 else None


# Minimax Method with alpha beta pruning
def minimax(depth, board, color, alpha, beta, is_maximizing_player):
    if depth == 0:
        return get_points(board, color)
    moves = get_all_moves(board, color)
    if is_maximizing_player:
        best_move = -9999
        for i in range(len(moves)):
            move = moves[i]
            temp = create_temp_board(board, move['coors1'], move['coors2'])
            best_move = max(best_move, minimax(
                depth - 1, temp, get_other_color(color), alpha, beta, not is_maximizing_player))
            alpha = max(alpha, best_move)
            if beta <= alpha:
                return best_move
        return best_move
    else:
        best_move = 9999
        for i in range(len(moves)):
            move = moves[i]
            temp = create_temp_board(board, move['coors1'], move['coors2'])
            best_move = min(best_move, minimax(
                depth - 1, temp, get_other_color(color), alpha, beta, not is_maximizing_player))
            beta = min(beta, best_move)
            if beta <= alpha:
                return best_move
        return best_move


def get_best_move(board, color, depth):
    move = minimax_root(board, color, True, depth)
    new_board = create_temp_board(board, move['coors1'], move['coors2']) if move else board

    return {
        'board': new_board,
        'mate': move is None
    }


# Static method
def get_points(board, color):
    total = 0
    for row in board:
        for square in row:
            if square:
                if square['color'] == color:
                    total -= square['value']
                else:
                    total += square['value']
    return total


# class method
def get_random_move(board, color):
    moves = get_all_moves(board, color)
    random_move = random.choice(moves)
    temp = create_temp_board(board, random_move['coors1'], random_move['coors2'])
    return temp


# static method
def get_all_moves(board, color):
    moves = []
    for i in range(len(board)):
        for j in range(len(board)):
            square = board[i][j]
            if square and square['color'] == color:
                coors1 = {'row': i, 'col': j}
                legal_moves = get_legal_moves_for_piece(board, coors1)
                if legal_moves:
                    moves.extend(legal_moves)
    return moves


def get_legal_moves_for_piece(board, coors1):
    moves = []
    for i in range(len(board)):
        for j in range(len(board)):
            coors2 = {'row': i, 'col': j}
            turn = board[coors1['row']][coors1['col']]['color']
            if is_legal(board, coors1, coors2, turn)['legal']:
                moves.append({'coors1': coors1, 'coors2': coors2})
    return moves


def correct_color_piece_moved(board, coors, turn):
    piece = board[coors['row']][coors['col']]
    return piece['color'] == turn


def is_legal(board, coors1, coors2, turn):
    if turn and not correct_color_piece_moved(board, coors1, turn):
        return False

    cur_row, cur_col, new_row, new_col = get_row_col(coors1, coors2)
    piece = board[cur_row][cur_col]
    castle = False
    legal = legal_piece_checks(board, coors1, coors2)
    if legal:
        temp_board = create_temp_board(board, coors1, coors2)
        legal = not is_color_in_check(temp_board, piece['color'])
        # Checks to see if tempboard has check once moved
    elif (piece['name'] == 'king' and turn == piece['color'] and
            is_legal_castle(board, coors1, coors2, turn)):
        castle = True

    return {'legal': legal, 'castle': castle}


def modify_legal_board(board, coors1, coors2):
    # board = is_legal_castle(board, coors1, coors2)
    # piece = get_piece(board, coors1)
    # if (castle and not is_color_in_check(castle, piece['color'])):
    #     return castle
    return create_temp_board(board, coors1, coors2)


def is_color_in_check(temp_board, color):
    coors2 = get_coors_from_name_color(temp_board, 'king', color)
    color2 = get_other_color(color)
    for i in range(len(temp_board)):
        row = temp_board[i]
        for j in range(len(row)):
            square = row[j]
            if square and square['color'] == color2:
                coors1 = {'row': i, 'col': j}
                if legal_piece_checks(temp_board, coors1, coors2):
                    return True
    return False


def get_coors_from_name_color(board, name, color):
    for i in range(len(board)):
        row = board[i]
        for j in range(len(row)):
            square = row[j]
            if square and square['name'] == name and square['color'] == color:
                return {'row': i, 'col': j}
    return None


def create_temp_board(board, coors1, coors2):
    temp = my_deep_copy(board)
    cur_row, cur_col, new_row, new_col = get_row_col(coors1, coors2)
    if cur_row == cur_col and new_row == new_col:
        return temp
    piece = temp[cur_row][cur_col]
    if piece:
        piece['moved'] = True
    temp[cur_row][cur_col] = None
    temp[new_row][new_col] = piece
    return temp


def is_blocked(board, coors1, coors2):
    result = False
    count = 0
    if coors2['col'] == coors1['col']:
        direction = 1 if coors2['row'] > coors1['row'] else -1
        for row in range(coors1['row'], coors2['row'], direction):
            if board[row][coors2['col']] is not None and count != 0:
                result = True
                break
            count += 1
    else:
        m = (coors2['row'] - coors1['row'])//(coors2['col'] - coors1['col'])
        direction = 1 if coors2['col'] > coors1['col'] else -1
        for col in range(coors1['col'], coors2['col'], direction):
            row = coors1['row'] + m * (col - coors1['col'])
            if board[row][col] is not None and count != 0:
                result = True
                break
            count += 1
    return result


def is_legal_castle(board, coors1, coors2, color):
    start_row, start_col = coors1['row'], coors1['col']
    end_row, end_col = coors2['row'], coors2['col']

    # King must be there and not moved
    king = board[start_row][start_col]
    if not king or king['name'] != 'king' or king['moved']:
        return False

    # Rook must be there and not moved
    rook = board[start_row][7]
    if not rook or rook['name'] != 'rook' or rook['moved']:
        return False

    # Spaces must be empty
    if board[start_row][5] or board[start_row][6]:
        return False

    if end_row != start_row or end_col != 6:
        return False

    coors = [
        [start_row, start_col],
        [start_row, start_col + 1],
        [start_row, start_col + 2]
    ]
    for row, col in coors:
        temp_board = create_temp_board(board, coors1, {'row': row, 'col': col})
        if is_color_in_check(temp_board, color):
            return False

    return True


def get_piece(board, coors):
    return board[coors['row']][coors['col']]


def is_same_side(board, coors1, coors2):
    piece = get_piece(board, coors1)
    color = piece['color']
    next_piece = board[coors2['row']][coors2['col']]
    if next_piece:
        next_color = next_piece.get('color')
        if next_color == color:
            return True
    return False


def get_row_col_dif(coors1, coors2):
    row_dif = abs(coors1['row'] - coors2['row'])
    col_dif = abs(coors1['col'] - coors2['col'])
    return [row_dif, col_dif]


def is_vertical_move(coors1, coors2):
    return coors1['col'] == coors2['col']


def is_horizontal_mode(coors1, coors2):
    return coors1['row'] == coors2['row']


def is_diagonal_mode(coors1, coors2):
    row_dif, col_dif = get_row_col_dif(coors1, coors2)
    return row_dif == col_dif


def is_moving_forward(board, coors1, coors2):
    piece = get_piece(board, coors1)
    if piece['color'] == 'dark':
        return coors2['row'] > coors1['row']
    else:
        return coors1['row'] > coors2['row']


# Piece Legal Functions
def is_legal_knight(coors1, coors2):
    row_dif, col_dif = get_row_col_dif(coors1, coors2)
    return max(row_dif, col_dif) == 2 and min(row_dif, col_dif) == 1


def is_piece_of_color(board, coors, color):
    piece = get_piece(board, coors)
    if piece:
        return piece['color'] == color
    return False


def is_piece_at_coors(board, coors):
    return board[coors['row']][coors['col']] is not None


def get_other_color(color):
    return 'light' if color == 'dark' else 'dark'


def is_legal_pawn(board, coors1, coors2):
    row_dif, col_dif = get_row_col_dif(coors1, coors2)
    piece = get_piece(board, coors1)
    if not is_moving_forward(board, coors1, coors2):
        return False
    if is_diagonal_mode(coors1, coors2):
        diag_good = is_piece_of_color(board, coors2, get_other_color(piece['color']))
        if row_dif != 1 or col_dif != 1 or not diag_good:
            return False
        return True
    if is_vertical_move(coors1, coors2) and not is_piece_at_coors(board, coors2):
        if coors1['row'] == 1 or coors1['row'] == 6:
            return row_dif <= 2
        else:
            return row_dif <= 1

    return False


def is_legal_rook(coors1, coors2):
    return (is_horizontal_mode(coors1, coors2) ^
            is_vertical_move(coors1, coors2))


def is_legal_queen(coors1, coors2):
    return (is_legal_bishop(coors1, coors2) or
            is_legal_rook(coors1, coors2))


def is_legal_king(coors1, coors2):
    row_dif, col_dif = get_row_col_dif(coors1, coors2)
    return row_dif <= 1 and col_dif <= 1


def is_legal_bishop(coors1, coors2):
    return is_diagonal_mode(coors1, coors2)
