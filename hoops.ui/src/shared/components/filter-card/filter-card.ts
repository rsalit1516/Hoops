import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'csbc-filter-card',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './filter-card.html',
  styleUrls: ['./filter-card.scss', '../../scss/cards.scss'],
})
export class FilterCard {
  @Input() hasActiveFilters = false;
  @Input() clearLabel = 'Clear Filters';
  @Output() clearClicked = new EventEmitter<void>();
}
