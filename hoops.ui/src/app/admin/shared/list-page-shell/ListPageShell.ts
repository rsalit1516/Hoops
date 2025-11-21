import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

// list-page-shell.component.ts
@Component({
  selector: 'csbc-list-page-shell',
  imports: [MatCardModule],
  templateUrl: './list-page-shell.html',
  styleUrls: [
    '../../../shared/scss/tables.scss',
    '../../../shared/scss/cards.scss',
    './list-page-shell.scss',
  ],
})
export class ListPageShellComponent {
  title = input<string>(''); // Title to display in the card header
  count = input<number>(0); // Count of items to display
}
