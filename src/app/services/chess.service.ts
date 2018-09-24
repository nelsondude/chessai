import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { environment } from '../../environments/environment';

@Injectable()
export class ChessService {
  private board;
  private id;
  private startTime;
  public changes: EventEmitter<any> = new EventEmitter();
  public boardChanged: EventEmitter<any> = new EventEmitter();
  public turn = 'light';

  public mode = 'AI';
  public level = 2;

  public rotateBoardVertically: EventEmitter<any> = new EventEmitter<any>();
  public rotateBoardHorizontally: EventEmitter<any> = new EventEmitter<any>();

  constructor(private http: HttpClient,
              private spinnerService: Ng4LoadingSpinnerService) {

  }

  isAIMode() {
    return this.mode === 'AI';
  }

  isMultiplayerMode() {
    return this.mode === 'Multiplayer';
  }

  isHumanMode() {
    return this.mode === 'Human vs Human';
  }

  setMode(mode) {
    this.mode = mode;
  }

  isPlaying() {
    return this.id && this.id !== '';
  }

  wasPlaying() {
    return localStorage.getItem('id')!== null;
  }

  fetchStartGame() {
    return this.http.get('api/get-start-board');
  }

  setBoard(board) {
    this.board = board;
  }

  switchTurn() {
    this.turn = this.turn === 'light' ? 'dark' : 'light';
  }

  doUserChessMove(coors, newCoors) {
    const body = {
      board: this.board,
      coors: coors,
      newCoors: newCoors,
      turn: this.turn
    };
    return this.http.post(environment.domain + 'ai/islegal', JSON.stringify(body));
  }

  doAIChessMove() {
    return this.http.post(environment.domain + 'ai/', {
      board: this.board,
      turn: this.turn,
      level: this.level
    })
  }

  quitGame() {
    // this.board = null;
    this.id = null;
    localStorage.removeItem('id');
  }

  getGameId() {
    const id = this.id || localStorage.getItem('id');
    if (id) {
      return id;
    }
    return '';
  }
  getGameBoard() {
    return this.board;
  }

  updateGame(board, startTime, id) {
    this.board = board;
    this.startTime = startTime;
    this.id = id;
    this.boardChanged.emit(board);
    this.setGameInStorage(id);
  }

  updateAIGame(board) {
    this.board = board;
    this.boardChanged.emit(board);
  }

  setGameInStorage(id) {
    localStorage.setItem('id', id);
  }
  getPieceFromCoors(coors) {
    return this.board[coors.row][coors.col];
  }

  modifyBoard(piece, coors, newCoors, callback) {
    if (newCoors.row === coors.row && newCoors.col === coors.col) {
      callback(null);
    } else {
      const current = this.board[newCoors.row][newCoors.col];
      piece['moved'] = true;
      this.board[coors.row][coors.col] = null;
      this.board[newCoors.row][newCoors.col] = piece;
      callback(current);
    }
  }
}
