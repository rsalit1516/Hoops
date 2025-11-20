import { Component } from '@angular/core';





import { ShellTitle } from '@app/shared/components/shell-title/shell-title';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'csbc-admin-people-shell',
  imports: [ShellTitle,
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
