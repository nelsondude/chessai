var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { EventEmitter, Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { ChessService } from './chess.service';
var IoService = (function () {
    function IoService(chessService) {
        var _this = this;
        this.chessService = chessService;
        this.clients = [];
        this.modalControl = new EventEmitter();
        this.requestedSocket = '';
        this.socket = io();
        this.socket.on('updated clients', function (clients) {
            _this.clients = _this.removeId(clients, _this.socket.id);
        });
        this.socket.on('received request', function (socket_id) {
            _this.modalControl.emit(true);
            _this.requestedSocket = socket_id;
        });
        this.socket.on('game update', function (game) {
            var board = game['game'];
            var startTime = game['startTime'];
            var id = game['_id'];
            _this.chessService.updateGame(board, startTime, id);
        });
    }
    IoService.prototype.ngOnInit = function () {
        // if (this.chessService.wasPlaying()) {
        //   this.fetchGame(this.chessService.getGameId());
        // }
    };
    IoService.prototype.removeId = function (array, element) {
        return array.filter(function (e) { return e !== element; });
    };
    IoService.prototype.getSocketId = function () {
        if (this.socket) {
            return this.socket.id;
        }
        return '';
    };
    IoService.prototype.getRequestedSocket = function () {
        return this.requestedSocket;
    };
    // Handling requesting to play certain players
    IoService.prototype.sendRequestResponse = function (res) {
        this.socket.emit("" + res, this.requestedSocket);
    };
    IoService.prototype.fetchGame = function (game_id) {
        this.socket.emit('fetch game', game_id);
        // console.log('fetching game');
    };
    IoService.prototype.updateGame = function () {
        var board = this.chessService.getGameBoard();
        var id = this.chessService.getGameId();
        this.socket.emit('update game', board, id);
    };
    IoService.prototype.requestToPlay = function (socket) {
        this.socket.emit('request to play', socket);
    };
    // Updating the clients for the UI
    IoService.prototype.updateClients = function () {
        this.socket.emit('update clients');
    };
    IoService.prototype.peopleConnected = function () {
        return this.clients.length > 0;
    };
    IoService.prototype.getClients = function () {
        return this.clients;
    };
    IoService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [ChessService])
    ], IoService);
    return IoService;
}());
export { IoService };
//# sourceMappingURL=io.service.js.map