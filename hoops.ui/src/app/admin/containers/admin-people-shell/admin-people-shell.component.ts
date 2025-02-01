import { Component } from '@angular/core';
import { PersonalInfoComponent } from "../../components/personal-info/personal-info.component";
import { SearchPeopleComponent } from "../../components/search-people/search-people.component";
import { SearchPeopleResultsComponent } from "../../components/search-people-results/search-people-results.component";
import { PlayerBalanceComponent } from '@app/admin/components/player-balance/player-balance.component';
import { PlayerHistoryComponent } from '@app/admin/components/player-history/player-history.component';

@Component({
  selector: 'app-admin-people-shell',
  imports: [ PersonalInfoComponent, SearchPeopleComponent,
    SearchPeopleResultsComponent,
    PlayerBalanceComponent,
    PlayerHistoryComponent ],
  templateUrl: './admin-people-shell.component.html',
  styleUrls: [ './admin-people-shell.component.scss',
    '../../admin.component.scss',

  ]
})
export class AdminPeopleShellComponent {

}
