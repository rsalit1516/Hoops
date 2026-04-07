import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';

import { GameScoreDialog } from './game-score-dialog';
import { GameService } from '@app/services/game.service';
import { RegularGame } from '@app/domain/regularGame';

describe('GameScoreDialog', () => {
  let fixture: ComponentFixture<GameScoreDialog>;
  let component: GameScoreDialog;

  it('renders team labels with fallback display values when team names are empty', async () => {
    const dialogGame = {
      scheduleGamesId: 101,
      seasonId: 1,
      divisionId: 1,
      gameId: 1,
      gameDate: new Date('2026-01-10T10:00:00Z'),
      locationName: 'Gym 1',
      locationNumber: 1,
      scheduleNumber: 1,
      gameDescription: null,
      gameType: 0,
      homeTeamId: 11,
      homeTeamNumber: 11,
      homeTeamName: '',
      homeTeamColor: 'Blue',
      homeTeamSeasonNumber: 12,
      homeTeamScore: 0,
      visitingTeamId: 22,
      visitingTeamNumber: 22,
      visitingTeamName: '',
      visitingTeamColor: 'Red',
      visitingTeamSeasonNumber: 3,
      visitingTeamScore: 0,
    } as RegularGame;

    const selectedGameSignal = signal<RegularGame | null>(null);
    const gameServiceMock = {
      selectedGameSignal: selectedGameSignal.asReadonly(),
      updateSelectedGame: jasmine.createSpy('updateSelectedGame'),
      saveGame: jasmine.createSpy('saveGame').and.returnValue(of(dialogGame)),
      validateScores: jasmine.createSpy('validateScores').and.returnValue(true),
    };

    await TestBed.configureTestingModule({
      imports: [GameScoreDialog],
      providers: [
        { provide: GameService, useValue: gameServiceMock },
        { provide: MAT_DIALOG_DATA, useValue: { game: dialogGame } },
        {
          provide: MatDialogRef,
          useValue: { close: jasmine.createSpy('close') },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GameScoreDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const teamNameEls = Array.from(
      fixture.nativeElement.querySelectorAll('.teamName'),
    ) as HTMLElement[];

    expect(component).toBeTruthy();
    expect(teamNameEls.length).toBe(2);
    expect(teamNameEls[0].textContent?.trim()).toBe('Red (3):');
    expect(teamNameEls[1].textContent?.trim()).toBe('Blue (12):');
  });
});
