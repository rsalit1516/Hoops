import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { DirectorService } from '@app/services/director.service';
import { NgFor, AsyncPipe, TitleCasePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Director } from '@app/domain/director';
import { LoggerService } from '@app/services/logger.service';

@Component({
  selector: 'csbc-contacts',
  templateUrl: './contacts.html',
  styleUrls: [
    './contacts.scss',
    '../home/home.scss',
    '../shared/scss/cards.scss',
    '../shared/scss/tables.scss',
  ],
  imports: [MatCardModule, MatTableModule, NgFor, AsyncPipe, TitleCasePipe],
})
export class Contacts implements OnInit {
  private directorService = inject(DirectorService);
  private logger = inject(LoggerService);
  title = 'Contacts';
  directorList$: any;
  displayedColumns = ['title', 'name', 'cellPhone', 'email'];
  dataSource = new MatTableDataSource<Director>([]);
  // directors = this.directorService.directors!;
  directors = computed(() => {
    const value = this.directorService.directors();
    this.logger.debug('Directors computed', value);
    return value;
  });
  isLoading = this.directorService.isLoading;
  // errorMessage = this.directorService.errorMessage;
  // directorModels = this.directorService.directorModels
  // selectedModel = this.directorService.selectedModel;
  // triggerMessage = this.directorService.triggerMessage;

  constructor() {
    effect(() => {
      const directors = this.directorService.directorsSignal();
      this.logger.info('Directors updated', directors);
      if (directors) {
        this.dataSource = new MatTableDataSource<Director>(directors);
      }
    });
  }

  ngOnInit() {
    this.directorService.fetchDirectors();
  }
}
