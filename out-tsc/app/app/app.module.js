var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ChessboardComponent } from './components/chessboard/chessboard.component';
import { SocketsComponent } from './components/sockets/sockets.component';
import { IoService } from './services/io.service';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule, TabsModule } from 'ngx-bootstrap';
import { ChessService } from './services/chess.service';
import { TruncateModule } from 'ng2-truncate';
import { AboutComponent } from './components/about/about.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Ng2DeviceDetectorModule } from 'ng2-device-detector';
// import { MatTabsModule} from '@angular/material';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        NgModule({
            declarations: [
                AppComponent,
                ChessboardComponent,
                SocketsComponent,
                AboutComponent,
            ],
            imports: [
                BrowserModule,
                HttpClientModule,
                ModalModule.forRoot(),
                TruncateModule,
                BrowserAnimationsModule,
                // MatTabsModule,
                Ng4LoadingSpinnerModule.forRoot(),
                TabsModule.forRoot(),
                Ng2DeviceDetectorModule.forRoot()
            ],
            providers: [
                IoService,
                ChessService
            ],
            bootstrap: [AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
export { AppModule };
//# sourceMappingURL=app.module.js.map