import {Component, OnInit} from '@angular/core';
import {ChessService} from '../../services/chess.service';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit {

  private horiIncrement = Math.PI / 2;

  constructor(private chessService: ChessService) {
  }

  ngOnInit() {
  }

  rotateBoard(dir, increment) {
    if (dir === 'vertical') {
      this.chessService.rotateBoardVertically.emit(increment);
    } else if (dir === 'horizontal') {
      this.chessService.rotateBoardHorizontally.emit(increment * this.horiIncrement);
    }
  }
  resetGame() {
    this.chessService.fetchStartGame()
      .subscribe(
        data => {
          this.chessService.setBoard(data['board']);
          this.chessService.boardChanged.emit(data['board']);
        }
      )
  }
}
