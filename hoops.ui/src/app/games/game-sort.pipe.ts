import { Pipe, PipeTransform } from '@angular/core';
import { Game } from 'app/domain/game';

@Pipe({
  name: 'gameSort'
})
export class GameSortPipe implements PipeTransform {

  transform(array: Game[], gameDate: Date): Game[] {
    array.sort((a: Game, b: Game) => {
      if (a['gameDate'] < b['gameDate']) {
        return -1;
      } else {if (a['gameDate'] > b['gameDate']) {
        return 1;
      } else {
        return 0;
      }
      }
    });
    return array;
  }

}
