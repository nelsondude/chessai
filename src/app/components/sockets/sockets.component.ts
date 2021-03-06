import {AfterContentInit, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {IoService} from '../../services/io.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {ChessService} from '../../services/chess.service';

@Component({
  selector: 'app-sockets',
  templateUrl: './sockets.component.html',
  styleUrls: ['./sockets.component.css']
})
export class SocketsComponent implements OnInit, AfterContentInit {
  modalRef: BsModalRef;
  modalOpen = false;

  @ViewChild('template') modalTemp;


  constructor(public socketService: IoService,
              private modalService: BsModalService,
              public chessService: ChessService) { }

  ngOnInit() {
    this.socketService.modalControl.subscribe(
      (data) => this.openModal(this.modalTemp)
    );
  }

  ngAfterContentInit() {
    this.socketService.updateClients();
  }

  respondToRequest(res: string) {
    this.modalOpen = false;
    this.modalRef.hide();
    this.socketService.sendRequestResponse(res);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
}
