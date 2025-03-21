import { Component } from '@angular/core';
import { PersonalInfoComponent } from "../../components/personal-info/personal-info.component";
import { PeopleSearchComponent } from "../../components/people-search/people-search.component";
import { PeopleSearchResultsComponent } from "../../components/people-search-results/people-search-results.component";
import { PlayerBalanceComponent } from '@app/admin/components/player-balance/player-balance.component';
import { PlayerHistoryComponent } from '@app/admin/components/player-history/player-history.component';

@Component({
  selector: 'app-admin-people-shell',
  imports: [ PersonalInfoComponent,
    PeopleSearchComponent,
    PeopleSearchResultsComponent,
    PlayerBalanceComponent,
    PlayerHistoryComponent ],
  templateUrl: './admin-people-shell.component.html',
  styleUrls: [ './admin-people-shell.component.scss',
    '../../admin.component.scss',

  ]
})
export class AdminPeopleShellComponent {

}
