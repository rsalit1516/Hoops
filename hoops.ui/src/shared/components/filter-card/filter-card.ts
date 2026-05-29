import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'csbc-filter-card',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './filter-card.html',
  styleUrls: ['./filter-card.scss'],
})
export class FilterCard {
  @Input() hasActiveFilters = false;
  @Input() clearLabel = 'Clear Filters';
  @Output() clearClicked = new EventEmitter<void>();
}
