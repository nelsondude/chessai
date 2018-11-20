# Positional evaluation for white; reverse for black

KING = [
	[-3, -4, -4, -5],
	[-3, -4, -4, -5],
	[-3, -4, -4, -5],
	[-3, -4, -4, -5],
	[-2, -3, -3, -4],
	[-1, -2, -2, -2],
	[2, 2, 0, 0],
	[2, 3, 1, 0]
]
KING = [row + list(reversed(row)) for row in KING]


QUEEN = [  # double all the following lists
	[-2, -1, -1, -0.5, ],
	[-1, 0, 0, 0],
	[-1, 0, 0.5, 0.5],
	[-0.5, 0, 0.5, 0.5],
	[0, 0, 0.5, 0.5],
	[-1, 0.5, 0.5, 0.5],
	[-1, 0, 0.5, 0],
	[-2, -1, -1, -0.5]
]
QUEEN = [row + list(reversed(row)) for row in QUEEN]


ROOK = [  # double the following lists
	[0, 0, 0, 0],
	[0.5, 1, 1, 1],
	[-0.5, 0, 0, 0],
	[-0.5, 0, 0, 0],
	[-0.5, 0, 0, 0],
	[-0.5, 0, 0, 0],
	[-0.5, 0, 0, 0],
	[0, 0, 0, 0.5]
]
ROOK = [row + list(reversed(row)) for row in ROOK]


BISHOP = [  # double the following lists
	[-2, -1, -1, -1],
	[-1, 0, 0, 0],
	[-1, 0, -0.5, 1],
	[-1, 0.5, 0.5, 1],
	[-1, 0, 1, 1],
	[-1, 1, 1, 1],
	[-1, 0.5, 0, 0],
	[-2, -1, -1, -1]
]
BISHOP = [row + list(reversed(row)) for row in BISHOP]


KNIGHT = [  # double the following lists
	[-5, -4, -3, -3],
	[-4, -2, 0, 0],
	[-3, 0, 1, 1.5],
	[-3, 0.5, 1.5, 2],
	[-3, 0, 1.5, 2],
	[-3, 0.5, 1, 1.5],
	[-4, -2, 0, 0.5],
	[-5, -4, -3, -3]
]
KNIGHT = [row + list(reversed(row)) for row in KNIGHT]


PAWN = [
	[0, 0, 0, 0],
	[5, 5, 5, 5],
	[1, 1, 2, 3],
	[0.5, 0.5, 1, 2.5],
	[0, 0, 0, 2],
	[0.5, -0.5, -1, 0],
	[0.5, 1, 1, -2],
	[0, 0, 0, 0]
]
PAWN = [row + list(reversed(row)) for row in PAWN]

MAPPING = {
	'rook': ROOK,
	'knight': KNIGHT,
	'bishop': BISHOP,
	'queen': QUEEN,
	'king': KING,
	'pawn': PAWN
}


def get_points(board, color):
	total = 0
	rows, cols = len(board), len(board[0])
	for row in range(rows):
		for col in range(cols):
			square = board[row][col]
			if square:
				if square['color'] == color:
					total -= square['value']
					total -= MAPPING[square['name']][7 - row][col]
				else:
					total += square['value']
					total += MAPPING[square['name']][row][col]
	return total
