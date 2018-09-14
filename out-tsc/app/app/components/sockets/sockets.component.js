var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { IoService } from '../../services/io.service';
import { BsModalService } from 'ngx-bootstrap';
var SocketsComponent = (function () {
    function SocketsComponent(socketService, modalService) {
        this.socketService = socketService;
        this.modalService = modalService;
        this.modalOpen = false;
    }
    SocketsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.socketService.modalControl.subscribe(function (data) { return _this.openModal(_this.modalTemp); });
    };
    SocketsComponent.prototype.ngAfterContentInit = function () {
        this.socketService.updateClients();
    };
    SocketsComponent.prototype.respondToRequest = function (res) {
        this.modalOpen = false;
        this.modalRef.hide();
        this.socketService.sendRequestResponse(res);
    };
    SocketsComponent.prototype.openModal = function (template) {
        this.modalRef = this.modalService.show(template);
    };
    __decorate([
        ViewChild('template'),
        __metadata("design:type", Object)
    ], SocketsComponent.prototype, "modalTemp", void 0);
    SocketsComponent = __decorate([
        Component({
            selector: 'app-sockets',
            templateUrl: './sockets.component.html',
            styleUrls: ['./sockets.component.css']
        }),
        __metadata("design:paramtypes", [IoService,
            BsModalService])
    ], SocketsComponent);
    return SocketsComponent;
}());
export { SocketsComponent };
//# sourceMappingURL=sockets.component.js.map