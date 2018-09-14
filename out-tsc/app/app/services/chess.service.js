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
import { HttpClient } from '@angular/common/http';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { environment } from '../../environments/environment';
var ChessService = (function () {
    function ChessService(http, spinnerService) {
        this.http = http;
        this.spinnerService = spinnerService;
        this.changes = new EventEmitter();
        this.boardChanged = new EventEmitter();
        this.turn = 'light';
    }
    ChessService.prototype.isPlaying = function () {
        return this.id && this.id !== '';
    };
    ChessService.prototype.wasPlaying = function () {
        if (localStorage.getItem('id')) {
            return true;
        }
        return false;
    };
    ChessService.prototype.fetchStartGame = function (callback) {
        var _this = this;
        this.http.get('api/get-start-board')
            .subscribe(function (data) {
            _this.board = data['board'];
            callback(true);
        }, function (err) {
            console.log(err);
            callback(false);
        });
    };
    ChessService.prototype.sendBoard = function (color) {
        var _this = this;
        this.spinnerService.show();
        var body = {
            'board': this.board,
            'turn': color
        };
        this.http.post(environment.domain + 'ai/', body)
            .subscribe(function (data) {
            _this.spinnerService.hide();
            var board = data['board'];
            var mate = data['mate'];
            if (mate) {
                console.log(color.toUpperCase() + " was checkmated!!!");
            }
            _this.updateAIGame(board);
        }, function (err) {
            console.log(err);
            _this.spinnerService.hide();
        });
    };
    ChessService.prototype.switchTurn = function () {
        // console.log(this.turn);
        this.turn = this.turn === 'light' ? 'dark' : 'light';
    };
    ChessService.prototype.checkLegal = function (coors, newCoors) {
        // console.log('CHECKING LEGAL WITH THE SERVER');
        var body = {
            'board': this.board,
            'coors': coors,
            'newCoors': newCoors
        };
        return this.http.post(environment.domain + 'ai/islegal', JSON.stringify(body));
    };
    ChessService.prototype.quitGame = function () {
        // this.board = null;
        this.id = null;
        localStorage.removeItem('id');
    };
    ChessService.prototype.getGameId = function () {
        var id = this.id || localStorage.getItem('id');
        if (id) {
            return id;
        }
        return '';
    };
    ChessService.prototype.getGameBoard = function () {
        return this.board;
    };
    ChessService.prototype.updateGame = function (board, startTime, id) {
        this.board = board;
        this.startTime = startTime;
        this.id = id;
        this.boardChanged.emit(board);
        this.setGameInStorage(id);
    };
    ChessService.prototype.updateAIGame = function (board) {
        this.board = board;
        this.boardChanged.emit(board);
    };
    ChessService.prototype.setGameInStorage = function (id) {
        localStorage.setItem('id', id);
    };
    ChessService.prototype.getPieceFromCoors = function (coors) {
        return this.board[coors.row][coors.col];
    };
    ChessService.prototype.modifyBoard = function (piece, coors, newCoors, callback) {
        if (newCoors.row === coors.row && newCoors.col === coors.col) {
            callback(null);
        }
        else {
            var current = this.board[newCoors.row][newCoors.col];
            piece['moved'] = true;
            this.board[coors.row][coors.col] = null;
            this.board[newCoors.row][newCoors.col] = piece;
            callback(current);
        }
    };
    ChessService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient,
            Ng4LoadingSpinnerService])
    ], ChessService);
    return ChessService;
}());
export { ChessService };
//# sourceMappingURL=chess.service.js.map