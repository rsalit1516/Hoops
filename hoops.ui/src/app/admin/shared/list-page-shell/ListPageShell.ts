import { CommonModule } from '@angular/common';
import { Component, ContentChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

// list-page-shell.component.ts
@Component({
  selector: 'csbc-list-page-shell',
  imports: [CommonModule, MatCardModule],
  templateUrl: './list-page-shell.html',
  styleUrls: ['./list-page-shell.scss'],
})
export class ListPageShellComponent {
  @ContentChild('[filter]') filterContent?: any;
  @ContentChild('[actions]') actionsContent?: any;

  get hasFilterContent(): boolean {
    return !!this.filterContent;
  }

  get hasActionsContent(): boolean {
    return !!this.actionsContent;
  }
}
