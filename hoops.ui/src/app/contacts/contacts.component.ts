import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { DirectorService } from '@app/services/director.service';
import { NgFor, AsyncPipe, TitleCasePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Director } from '@app/domain/director';

@Component({
  selector: 'csbc-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss', '../home/home.component.scss', '../shared/scss/cards.scss',
    '../shared/scss/tables.scss',
  ],
  imports: [
    MatCardModule,
    MatTableModule,
    NgFor,
    AsyncPipe,
    TitleCasePipe,
  ]
})
export class ContactsComponent implements OnInit {
  private directorService = inject(DirectorService);
  title = 'Contacts';
  directorList$: any;
  displayedColumns = [
    'title',
    'name',
    'cellPhone',
    'email',
  ];
  dataSource = new MatTableDataSource<Director>([]);
  directors = this.directorService.directors!;
  isLoading = this.directorService.isLoading;
  // errorMessage = this.directorService.errorMessage;
  // directorModels = this.directorService.directorModels
  // selectedModel = this.directorService.selectedModel;
  // triggerMessage = this.directorService.triggerMessage;

  constructor () {
    effect(() => {
      const directors = this.directorService.directorsSignal();
      if (directors) {
        this.dataSource = new MatTableDataSource<Director>(directors);
      }
    });

  }

  ngOnInit () {
    // this.directorService.getDirectors().subscribe((directors: Director[]) => {
    //   this.directors = directors;
    //   this.dataSource = new MatTableDataSource(directors);
    //   console.log(this.directors);
    // });
    // this.directorService.reloadDirectors();
    console.log('Directors:', this.directors);
    console.log(this.directorService.directors());
    this.directorService.fetchDirectors();
    //this.directorService.directorsSignal() && this.dataSource.data.push(this.directorService.directorsSignal());
  }


}
