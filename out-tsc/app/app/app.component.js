var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { ChessService } from './services/chess.service';
import { IoService } from './services/io.service';
import { state, trigger, style, transition, animate } from '@angular/animations';
var AppComponent = (function () {
    function AppComponent(chessService, socketService) {
        this.chessService = chessService;
        this.socketService = socketService;
        this.title = 'app';
        this.collapse = 'closed';
    }
    AppComponent.prototype.toggleCollapse = function () {
        this.collapse = this.collapse === 'open' ? 'closed' : 'open';
    };
    AppComponent = __decorate([
        Component({
            selector: 'app-root',
            templateUrl: './app.component.html',
            styleUrls: ['./app.component.scss'],
            animations: [
                trigger('collapse', [
                    state('open', style({
                        opacity: '1',
                        display: 'block',
                        transform: 'translate3d(0, 0, 0)'
                    })),
                    state('closed', style({
                        opacity: '0',
                        display: 'none',
                        transform: 'translate3d(0, -100%, 0)'
                    })),
                    transition('closed => open', animate('200ms ease-in')),
                    transition('open => closed', animate('100ms ease-out'))
                ])
            ]
        }),
        __metadata("design:paramtypes", [ChessService,
            IoService])
    ], AppComponent);
    return AppComponent;
}());
export { AppComponent };
//# sourceMappingURL=app.component.js.map