import {Component, OnInit} from '@angular/core';
import {ChessService} from '../../services/chess.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {
  options = [
    {value: 'AI', disabled: false, checked: false},
    {value: 'Human vs Human', disabled: false, checked: true},
    {value: 'Multiplayer', disabled: true, checked: false}
  ]

  constructor(private chessService: ChessService) {
  }

  ngOnInit() {
  }

  changeMode(event) {
    this.chessService.setMode(event.value);
  }

}
