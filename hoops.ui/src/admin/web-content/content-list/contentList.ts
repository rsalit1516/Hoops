import {
  Component,
  OnInit,
  output,
  inject,
  TemplateRef,
  ViewChild,
  computed,
  effect,
} from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { Content } from '../../../domain/content';

import * as fromContent from '../../state';
import * as contentActions from '../../state/admin.actions';
import { WebContent } from '../../../domain/webContent';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ContentListToolbar } from '../content-list-toolbar/content-list-toolbar';
import { DateTime } from 'luxon';
import { PaginationPreferencesService } from '@app/services/pagination-preferences.service';
import { ContentService } from '../content.service';
import { LoggerService } from '@app/services/logger.service';
import {
  GenericMatTableComponent,
  TableColumn,
} from '../../shared/generic-mat-table/generic-mat-table';

@Component({
  selector: 'csbc-content-list',
  templateUrl: './contentList.html',
  styleUrls: [
    './contentList.scss',
    '../../admin.scss',
    '../../../shared/scss/tables.scss',
  ],
  imports: [
    MatDialogModule,
    MatIconModule,
    ContentListToolbar,
    DatePipe,
    GenericMatTableComponent,
  ],
})
export class ContentList implements OnInit {
  router = inject(Router);
  store = inject(Store<fromContent.State>);

  readonly #contentService = inject(ContentService);
  private readonly logger = inject(LoggerService);
  private readonly prefs = inject(PaginationPreferencesService);

  readonly selectedContent = output<Content>();
  @ViewChild('expirationDateTemplate', { static: true })
  expirationDateTemplate!: TemplateRef<unknown>;

  @ViewChild('actionsTemplate', { static: true })
  actionsTemplate!: TemplateRef<unknown>;

  columns: TableColumn<WebContent>[] = [
    { key: 'title', header: 'Title', field: 'title' },
    { key: 'dateAndTime', header: 'Date And Time', field: 'dateAndTime' },
    { key: 'location', header: 'Location', field: 'location' },
    {
      key: 'expirationDate',
      header: 'Expiry Date',
      template: this.expirationDateTemplate,
    },
    { key: 'actions', header: '', template: this.actionsTemplate },
  ];

  allWebContent = computed(() => this.#contentService.allWebContent);
  pageSize = this.prefs.getPageSize(10);
  contents$!: Observable<WebContent[]>;
  errorMessage: string | undefined;
  pageTitle: string | undefined;
  public dialog!: MatDialog;
  dataSource = new MatTableDataSource<WebContent>([]);
  data: WebContent[] = [];
  filterValue = '';

  constructor() {
    effect(() => {
      if (this.#contentService.isActiveContent()) {
        this.data = this.#contentService.activeWebContent();
      } else {
        this.data = this.#contentService.allWebContent();
      }
      this.dataSource.data = [...this.data].sort((a, b) => {
        const left = DateTime.fromISO(String(a.expirationDate)).toMillis();
        const right = DateTime.fromISO(String(b.expirationDate)).toMillis();
        return right - left;
      });
      this.logger.info(this.data);
    });
  }

  ngOnInit() {
    this.pageTitle = 'Web Site Messages';
    // Fetch fresh data every time the list is displayed
    // Active content is computed automatically from allWebContent
    this.#contentService.fetchAllContents();

    // Note: filterPredicate is no longer needed - filtering is done via computed signal
    this.dataSource.filterPredicate = (data: WebContent, filter: string) => {
      const today = DateTime.now().startOf('day').toJSDate();
      const expirationDateString = data.expirationDate.toString();
      const expirationDate = DateTime.fromISO(expirationDateString).toJSDate();
      const result = expirationDate >= today;
      // console.log(`Filtering ${data.expirationDate}: ${result}`);
      return result;
    };
  }

  editContent(content: WebContent) {
    // this.store.dispatch(new contentActions.SetSelectedContent(content));
    this.#contentService.selectedContent.update(() => content);
    this.router.navigate(['./admin/content/edit']);
  }
  cloneContent(content: Content) {
    // this.store.dispatch(new contentActions.SetClonedContent(content));
    content.webContentId = undefined;
    this.store.dispatch(new contentActions.SetSelectedContent(content));

    this.router.navigate(['./admin/content/edit']);
  }

  addContent(): void {
    this.router.navigate(['./admin/content/edit']);
  }
  applyFilter(): void {
    this.dataSource.filter = 'apply';
  }

  clearFilter(): void {
    this.dataSource.filter = '';
  }
}
