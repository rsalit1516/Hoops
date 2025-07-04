import { Component } from '@angular/core';
import { PersonalInfoComponent } from "../personal-info/personal-info.component";
import { PeopleSearchComponent } from "../people-search/people-search";
import { PeopleSearchResultsComponent } from "../people-search-results/people-search-results.component";
import { PlayerBalanceComponent } from '@app/admin/components/player-balance/player-balance.component';
import { PlayerHistoryComponent } from '@app/admin/components/player-history/player-history.component';
import { ShellTitleComponent } from '@app/shared/shell-title/shell-title.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'csbc-admin-people-shell',
  imports: [PersonalInfoComponent,
    PeopleSearchComponent,
    PeopleSearchResultsComponent,
    PlayerBalanceComponent,
    PlayerHistoryComponent,
    ShellTitleComponent,
    RouterModule],
  template: `<section class="container">
  <csbc-shell-title [title]="title"/>
  <router-outlet></router-outlet>
</section>`,
  styleUrls: ['./admin-people-shell.scss',
    '../../admin.component.scss',
    '../../../shared/scss/cards.scss',
  ]
})
export class AdminPeopleShellComponent {
  title = 'People Management';
}
