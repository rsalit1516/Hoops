import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { Store, StoreModule } from '@ngrx/store';
import { SchedulePlayoffsComponent } from './schedule-playoffs.component';
import { DailyPlayoffScheduleComponent } from '../daily-playoff-schedule/daily-playoff-schedule.component';
import { PlayoffGame } from '@domain/playoffGame';
import * as fromGames from '../../state';
import { By } from '@angular/platform-browser';

describe('SchedulePlayoffsComponent', () => {
  let component: SchedulePlayoffsComponent;
  let fixture: ComponentFixture<SchedulePlayoffsComponent>;
  let store: Store<fromGames.State>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [ CommonModule,
        StoreModule.forRoot({}),
        SchedulePlayoffsComponent,
        DailyPlayoffScheduleComponent],
      providers: [Store]
    }).compileComponents();

    fixture = TestBed.createComponent(SchedulePlayoffsComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render DailyPlayoffScheduleComponent for each playoffGames entry', () => {
    const mockPlayoffGames: PlayoffGame[][] = [
      [{
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
      }],
      [ {
        scheduleNumber: 101,
        gameNumber: 2,
        divisionId: 1,
        gameId: 1,
        gameDate: new Date(),
        gameTime: new Date(),
        descr: 'Game 2',
        locationName: 'Stadium 1',
        locationNumber: 1,
        homeTeam: 'Team C',
        visitingTeam: 'Team D',
        visitingTeamScore: 14,
        homeTeamScore: 124,
      }]
    ];
    component.playoffGames = mockPlayoffGames;
    fixture.detectChanges();

    const dailyPlayoffScheduleComponents = fixture.debugElement.queryAll(By.directive(DailyPlayoffScheduleComponent));
    expect(dailyPlayoffScheduleComponents.length).toBe(mockPlayoffGames.length);
  });
});
