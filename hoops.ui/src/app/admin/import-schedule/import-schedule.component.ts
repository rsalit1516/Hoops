import { Component, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';

@Component({
    selector: 'csbc-import-schedule',
    templateUrl: './import-schedule.component.html',
    styleUrls: ['./import-schedule.component.scss'],
    standalone: true,
    imports: [MatListModule]
})
export class ImportScheduleComponent implements OnInit {
  importSteps: string[] = [
    'Import mdb file (Access) Data from Scheduler program into SQL database', 
    'Import SchDiv to ScheduleDivTeams and SchGames to ScheduleGames', 
    'Get SeasonId', 
    'Update ScheduleGames with seasonId for game Dates', 
    'Update SchedulGames with divisions'];
  constructor() { }

  ngOnInit() {
  }

}
