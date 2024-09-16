import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { DailyPlayoffScheduleComponent } from './daily-playoff-schedule.component';
import { PlayoffGame } from '@app/domain/playoffGame';

describe('DailyPlayoffScheduleComponent', () => {
  let component: DailyPlayoffScheduleComponent;
  let fixture: ComponentFixture<DailyPlayoffScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [CommonModule, MatTableModule, DailyPlayoffScheduleComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DailyPlayoffScheduleComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize data and gameDate on ngOnInit', () => {
    const mockPlayoffGames: PlayoffGame[] = [
      {
        scheduleNumber: 100,
        gameNumber: 1,
        divisionId: 1,
        gameId: 1,
        gameDate: new Date(),
        gameTime: new Date(),
        descr: 'Game 1',
        locationName: 'Stadium 1',
        locationNumber: 1,
        homeTeam: 'Team A',
        visitingTeam: 'Team B',
        visitingTeamScore: 12,
        homeTeamScore: 12,
      }
    ];
    component.playoffGames = mockPlayoffGames;

    component.ngOnInit();

    expect(component.data).toEqual(mockPlayoffGames);
    expect(component.gameDate).toEqual(mockPlayoffGames[0].gameDate!);
  });

  it('should have correct displayed columns', () => {
    expect(component.displayedColumns).toEqual([
      'gameTime',
      'Descr',
      'locationName',
      'homeTeam',
      'visitingTeam',
    ]);
  });
});
