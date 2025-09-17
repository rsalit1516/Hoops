import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Observable, EMPTY } from 'rxjs';
import { Season } from '@domain/season';
import { Division } from '@app/domain/division';
import { Team } from '@app/domain/team';
import { Store } from '@ngrx/store';

import * as fromGames from '../../state';
import * as gameActions from '../../state/games.actions';

import { RegularGame } from '@app/domain/regularGame';
import { PlayoffGame } from '@app/domain/playoffGame';
import { catchError } from 'rxjs/operators';
import { User } from '@app/domain/user';
import { DivisionService } from './../../../services/division.service';
import { GameService } from '@app/services/game.service';
import { Schedule } from '../../components/schedule/schedule';
import { CommonModule } from '@angular/common';
import { LoggerService } from '@app/services/logger.service';

@Component({
  selector: 'csbc-schedule-shell',
  template: `
    <section class="container mx-auto">
      <h1>{{ title }}</h1>
      <div class="row">
        <csbc-schedule />
      </div>
    </section>
  `,
  styleUrls: ['./schedule-shell.scss'],
  imports: [CommonModule, Schedule],
})
export class ScheduleShell implements OnInit {
  readonly #gameService = inject(GameService);
  readonly #divisionService = inject(DivisionService);
  readonly #loggerService = inject(LoggerService);
  games: RegularGame[] | undefined | null;
  playoffGames!: PlayoffGame[];
  title = 'Regular Season Schedule';
  filteredGames$: Observable<RegularGame[]> | undefined;
  currentSeason$: Observable<Season> | undefined;
  divisions$: Observable<Division[]> | undefined;
  selectedDivisionId$: Observable<number> | undefined;
  teams$: Observable<Team[]> | undefined;
  selectedTeam$: Observable<Team> | undefined;
  errorMessage$: Observable<string> | undefined;
  selectedDivision$: Observable<any> | undefined;
  canEdit = false;
  gamesByDate$: Observable<[Date, RegularGame[]]> | undefined;
  user$: Observable<User> | undefined;
  division$: Observable<Division> | undefined;
  division: Division | undefined;
  user: User | undefined;
  games$ = this.#gameService.seasonGames$.pipe(
    catchError((err) => {
      this.errorMessage$ = err;
      return EMPTY;
    })
  );
  divisionId: number | undefined;
  hasPlayoffs = false;
  dailySchedule = computed(() => this.#gameService.dailySchedule);
  seasonDivisions = signal<Division[]>([]);
  // selectedDivision = signal<Division | undefined>(undefined);
  selectedDivision = computed(() => this.#divisionService.selectedDivision());
  filteredGames = computed(() => this.#gameService.divisionGames());
  constructor() {
    effect(() => {
      const selectedDivision = this.selectedDivision();
      if (selectedDivision) {
        this.#loggerService.info(
          'Selected division in schedule-shell',
          selectedDivision
        );
        //        this.#store.dispatch(new gameActions.// LoadDivisionGames(selectedDivision.divisionId));
        // this.gameService.currentDivision$
        // this.gameService.filterGamesByDivision();
        // this.dailySchedule = this.#gameService.groupRegularGamesByDate(this.games!);
        this.#loggerService.debug('Daily schedule signal', this.dailySchedule);
      }
    });
  }

  ngOnInit() {
    //this.selectedDivision.set(this.#divisionService.selectedDivision()); //this.store.select(fromGames.getCurrentDivision).subscribe((division) => {
    // this.#store.select(fromGames.getFilteredGames).subscribe((games) => {
    //   this.games = games;
    //   this.dailySchedule = [];
    //   this.dailySchedule = this.#gameService.groupRegularGamesByDate(games);
    // });
    // this.#store.dispatch(new gameActions.LoadDivisionPlayoffGames());
    // });
  }

  getCanEdit(user: User | undefined, divisionId: number): boolean {
    this.#loggerService.debug('Check canEdit for division', divisionId);
    if (user !== undefined) {
      if (user.divisions !== undefined) {
        user.divisions.forEach((element) => {
          if (divisionId === element.divisionId) {
            return true;
            this.#loggerService.debug('Division match found', divisionId);
          }
          return false;
        });
      }
    }
    return false;
  }
  // getDailySchedule (games: RegularGame[]) {
  //   this.games = games;
  //   this.dailySchedule = [];
  //   this.dailySchedule = this.#gameService.groupRegularGamesByDate(games);

  // }
}
