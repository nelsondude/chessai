import {Component} from '@angular/core';
import {ChessService} from '../../services/chess.service';

@Component({
  selector: 'arrows',
  templateUrl: './arrows.component.html',
  styleUrls: ['./arrows.component.scss']
})
export class ArrowsComponent {
  private horiIncrement = Math.PI / 2;

  constructor(private chessService: ChessService) { }

  rotateBoard(dir, increment) {
    if (dir === 'vertical') {
      this.chessService.rotateBoardVertically.emit(increment);
    } else if (dir === 'horizontal') {
      this.chessService.rotateBoardHorizontally.emit(increment * this.horiIncrement);
    }
  }

}
