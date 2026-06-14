import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  TemplateRef,
  viewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Color } from '@app/domain/color';
import { ColorService } from '../admin-shared/services/color.service';
import { ColorDetail } from './color-detail/color-detail';
import {
  GenericMatTableComponent,
  TableColumn,
} from '../shared/generic-mat-table/generic-mat-table';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-color-list',
  templateUrl: './color-list.html',
  styleUrls: ['../../shared/scss/tables.scss', '../admin.scss', './color-list.scss'],
  imports: [
    GenericMatTableComponent,
    ColorDetail,
    MatButtonModule,
    MatToolbarModule,
    MatCheckboxModule,
  ],
})
export class ColorList implements OnInit {
  readonly #colorService = inject(ColorService);

  private readonly colorNameTpl = viewChild.required<TemplateRef<{ $implicit: Color }>>('colorNameTpl');

  showDiscontinued = signal(false);

  filteredColors = computed(() => {
    const colors = this.#colorService.adminColors();
    return this.showDiscontinued() ? colors : colors.filter((c) => !c.discontinued);
  });

  columns = computed<TableColumn<Color>[]>(() => [
    { key: 'colorName', header: 'Color', template: this.colorNameTpl() },
  ]);

  ngOnInit(): void {
    this.#colorService.fetchAdminColors();
  }

  onSelect(color: Color): void {
    this.#colorService.setSelectedColor(color);
  }

  addNew(): void {
    const newColor = new Color();
    newColor.colorId = 0;
    newColor.colorName = '';
    newColor.discontinued = false;
    this.#colorService.setSelectedColor(newColor);
  }
}
