import {EventEmitter, Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import {ChessService} from './chess.service';

@Injectable()
export class IoService {
  private socket: SocketIOClient.Socket;
  private clients = [];
  public modalControl = new EventEmitter<Boolean>();

  private requestedSocket = '';



  constructor(private chessService: ChessService) {
    this.socket = io();

    this.socket.on('updated clients', (clients) => {
      this.clients = this.removeId(clients, this.socket.id);
    });

    this.socket.on('received request', (socket_id) => {
      this.modalControl.emit(true);
      this.requestedSocket = socket_id;
    });

    this.socket.on('game update', (game) => {
      const board = game['game'];
      const startTime = game['startTime'];
      const id = game['_id'];
      const turn = game['turn'];
      this.chessService.setMode('Multiplayer');
      this.chessService.setTurn(turn);
      this.chessService.updateGame(board, startTime, id);
    });
  }

  removeId(array, element) {
    return array.filter(e => e !== element);
  }

  // Handling requesting to play certain players
  sendRequestResponse(res: string) {
    this.socket.emit(`${res}`, this.requestedSocket);
  }

  fetchGame(game_id) {
    this.socket.emit('fetch game', game_id);
    // console.log('fetching game');
  }
  updateGame() {
    const board = this.chessService.getGameBoard();
    const id = this.chessService.getGameId();
    this.socket.emit('update game', board, id);
  }

  requestToPlay(socket: string) {
    this.socket.emit('request to play', socket);
  }

  // Updating the clients for the UI
  updateClients() {
    this.socket.emit('update clients');
  }

  peopleConnected() {
    return this.clients.length > 0;
  }

  getClients() {
    return this.clients;
  }

}
