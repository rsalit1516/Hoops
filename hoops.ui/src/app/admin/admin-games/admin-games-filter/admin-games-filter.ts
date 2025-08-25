import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { DivisionSelect } from '@app/admin/admin-shared/division-select/division-select';
import { GameTypeSelect } from '@app/admin/admin-shared/game-type-select/game-type-select';
import { SeasonSelect } from '@app/admin/admin-shared/season-select/season-select';
import { Division } from '@app/domain/division';
import { Season } from '@app/domain/season';
import { DivisionService } from '@app/services/division.service';
import { SeasonService } from '@app/services/season.service';
import { AdminGamesState } from '../adminGamesState.service';
import { AdminGameService } from '../adminGame.service';
import { GameService } from '@app/services/game.service';
import { PlayoffGameService } from '@app/services/playoff-game.service';
import { RegularGame } from '@app/domain/regularGame';
import { PlayoffGame } from '@app/domain/playoffGame';

@Component({
  selector: 'csbc-admin-games-filter',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    SeasonSelect,
    GameTypeSelect,
    DivisionSelect,
  ],
  templateUrl: './admin-games-filter.html',
  styleUrls: ['./admin-games-filter.scss', '../../admin.scss'],
})
export class AdminGamesFilter {
  @Output() gameFilterChanged = new EventEmitter<{
    season: Season;
    gameType: string;
    division: Division;
  }>();
  readonly #router = inject(Router);
  #seasonService = inject(SeasonService);
  #divisionService = inject(DivisionService);
  state = inject(AdminGamesState);
  adminGameService = inject(AdminGameService);
  regularService = inject(GameService);
  playoffService = inject(PlayoffGameService);

  selectSeason: Season | undefined;
  selectDivision: Division | undefined;

  selectedSeason = signal<Season | undefined>(undefined);
  selectedDivision = signal<Division | null>(null) as any;

  selectGameType: string = 'Regular Season';

  // gameFilterEvent = EventEmitter(Season, gameType, Division, );
  newGame() {
    const type = this.state.gameType();
    const divisionId =
      this.#divisionService.selectedDivision()?.divisionId ?? 0;
    if (type === 'playoff') {
      const divGames = this.playoffService.divisionPlayoffGames();
      const scheduleNumber =
        divGames && divGames.length > 0 ? divGames[0].scheduleNumber : 1;
      const blank: PlayoffGame & { schedulePlayoffId?: number } = {
        scheduleNumber,
        gameNumber: 0,
        divisionId,
        descr: '',
        gameId: 0,
        locationNumber: undefined,
        gameDate: new Date(new Date().toISOString().slice(0, 10)),
        gameTime: undefined,
        homeTeam: '',
        visitingTeam: '',
        homeTeamScore: 0,
        visitingTeamScore: 0,
        locationName: undefined,
      } as any;
      this.playoffService.updateSelectedRecord(blank);
      this.#router.navigate(['./admin/games/detail-playoff']);
      return;
    }
    // regular
    const blankReg: RegularGame = {
      gameDescription: null,
      seasonId: this.#seasonService.selectedSeason()?.seasonId ?? 0,
      divisionId,
      divisionDescription: undefined,
      gameId: 0,
      locationName: '',
      locationNumber: 0,
      location: undefined,
      gameDate: new Date(new Date().toISOString().slice(0, 10)),
      gameTime: undefined,
      gameTimeString: undefined,
      homeTeamName: undefined,
      homeTeamId: 0,
      homeTeamNumber: 0,
      homeTeamScore: 0,
      homeTeamSeasonNumber: undefined,
      visitingTeamName: undefined,
      visitingTeamId: 0,
      visitingTeamNumber: 0,
      visitingTeamScore: 0,
      visitingTeamSeasonNumber: undefined,
      scheduleGamesId: 0,
      scheduleNumber: 0,
      gameNumber: 0,
      gameType: 0,
      gameDateOnly: undefined,
    } as RegularGame;
    this.regularService.updateSelectedGame(blankReg);
    this.#router.navigate(['./admin/games/detail-regular']);
  }

  handleSeasonChange(season: Season) {
    console.log('Selected season:', season);
    // Handle the selected season
  }
  handleDivisionChange(division: Division) {
    console.log('Selected division:', division);
    // Handle the selected season
  }
  handleGameTypeChange(gameType: string) {
    console.log('Selected gameType:', gameType);
    console.log('Selected season:', this.selectedSeason());
    console.log('Selected division:', this.selectedDivision());
    if (!this.selectedSeason()) {
      this.#seasonService.updateSelectedSeason(this.selectedSeason()!);
    }
    if (!this.selectedDivision) {
      this.selectedDivision.update(
        () => this.#divisionService.selectedDivision
      );
    }
    console.log('Selected season:', this.selectedSeason());
    console.log('Selected division:', this.selectedDivision());

    // if (this.selectedSeason() && this.selectedDivision()) {
    this.gameFilterChanged.emit({
      season: this.selectedSeason()!,
      gameType,
      division: this.selectedDivision(),
    });
    // } else {
    //   console.error('Season or Division is undefined');
    // }
    // Handle the selected season
  }
}
