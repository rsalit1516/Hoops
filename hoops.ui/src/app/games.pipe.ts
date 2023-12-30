import { Pipe, PipeTransform } from '@angular/core';
import { Game } from './domain/game';
@Pipe({
    name: 'games',
    standalone: true
})
export class GamesPipe implements PipeTransform {

  transform(value: Game[], filterBy: number): any {
    filterBy = filterBy ? filterBy : null;
    return filterBy ? value.filter((game: Game) => game.divisionId !== -1) : value;

  }

}
