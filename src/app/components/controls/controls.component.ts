import {Component} from '@angular/core';
import {ChessService} from '../../services/chess.service';
import { Options } from 'ng5-slider';
import {IoService} from '../../services/io.service';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent {
  levels = ["Horrible", "Beginner", "Amateur", "Expert"];
  options: Options = {
    floor: 1,
    ceil: 4,
    showTicks: true,
    ticksTooltip: (v: number): string => {
      return this.levels[v];
    },
    getTickColor: (value: number): string => {
      if (value === 1) {
        return '#42f459';
      }
      if (value === 2) {
        return '#f1f441';
      }
      if (value === 3) {
        return '#f48e41';
      }
      return '#f44141';
    }
  };

  constructor(public chessService: ChessService,
              public socketService: IoService) {
  }

  resetGame() {
    this.chessService.fetchStartGame()
      .subscribe(
        data => {
          this.chessService.setBoard(data['board']);
          this.chessService.boardChanged.emit(data['board']);
          this.chessService.setTurn('light');
        }
      )
  }
}
