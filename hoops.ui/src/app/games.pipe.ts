import { Pipe, PipeTransform } from '@angular/core';
import { RegularGame } from './domain/regularGame';
@Pipe({
  name: 'games',
  standalone: true
})
export class GamesPipe implements PipeTransform {

  transform (value: RegularGame[], filterBy: number): any {
    filterBy = filterBy ? filterBy : null;
    return filterBy ? value.filter((game: RegularGame) => game.divisionId !== -1) : value;

  }

}
