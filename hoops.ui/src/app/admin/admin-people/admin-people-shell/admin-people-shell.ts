import { Component } from '@angular/core';
import { PersonalInfo } from "../personal-info/personal-info";
import { PeopleSearch } from "../people-search/people-search";
import { PeopleSearchResults } from "../people-search-results/people-search-results";
import { PlayerBalance } from '@app/admin/components/player-balance/player-balance';
import { PlayerHistory } from '@app/admin/components/player-history/player-history';
import { ShellTitle } from '@app/shared/components/shell-title/shell-title';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'csbc-admin-people-shell',
  imports: [PersonalInfo,
    PeopleSearch,
    PeopleSearchResults,
    PlayerBalance,
    PlayerHistory,
    ShellTitle,
    RouterModule],
  template: `<section class="container">
  <csbc-shell-title [title]="title"/>
  <router-outlet></router-outlet>
</section>`,
  styleUrls: ['./admin-people-shell.scss',
    '../../admin.scss',
    '../../../shared/scss/cards.scss',
  ]
})
export class AdminPeopleShell {
  title = 'People Management';
}
