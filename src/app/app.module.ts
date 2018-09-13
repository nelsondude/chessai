import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {ChessboardComponent} from './components/chessboard/chessboard.component';
import {SocketsComponent} from './components/sockets/sockets.component';
import {IoService} from './services/io.service';
import {HttpClientModule} from '@angular/common/http';
import {ModalModule, TabsModule} from 'ngx-bootstrap';
import {ChessService} from './services/chess.service';
import {TruncateModule} from 'ng2-truncate';
import {AboutComponent} from './components/about/about.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Ng2DeviceDetectorModule} from 'ng2-device-detector';
import {Ng4LoadingSpinnerModule} from 'ng4-loading-spinner';
import {BannerComponent} from './components/banner/banner.component';
import {ControlsComponent} from './components/controls/controls.component';
import {InfoComponent} from './components/info/info.component';
import {MatRadioModule, MatSlideToggleModule} from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    ChessboardComponent,
    SocketsComponent,
    AboutComponent,
    BannerComponent,
    ControlsComponent,
    InfoComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ModalModule.forRoot(),
    TruncateModule,
    BrowserAnimationsModule,
    Ng4LoadingSpinnerModule.forRoot(),
    TabsModule.forRoot(),
    Ng2DeviceDetectorModule.forRoot(),
    MatRadioModule,
    MatSlideToggleModule
  ],
  providers: [
    IoService,
    ChessService

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
