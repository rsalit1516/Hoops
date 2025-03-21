import { Pipe, PipeTransform } from '@angular/core';
import { RegularGame } from '@app/domain/regularGame';

@Pipe({
  name: 'gameSort',
  standalone: true
})
export class GameSortPipe implements PipeTransform {

  transform (array: RegularGame[], gameDate: Date | undefined): RegularGame[] {
    array.sort((a: RegularGame, b: RegularGame) => {
      if (a['gameDate'] == undefined || b['gameDate'] == undefined) {
        return 0;
      }
      if (a['gameDate'] < b['gameDate']) {
        return -1;
      } else {
        if (a['gameDate'] > b['gameDate']) {
          return 1;
        } else {
          return 0;
        }
      }
    });
    return array;
  }

}
