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
  title: string;
  directorList$: any;
  dataSource: MatTableDataSource<Director>;
  displayedColumns!: string[];
  // directors = this.directorService.directors;
  // Signals to support the template
  directors = this.directorService.directors;
  dataResource = this.directorService.dataResource;
  isLoading = this.directorService.isLoading;
  // errorMessage = this.directorService.errorMessage;
  // directorModels = this.directorService.directorModels
  // selectedModel = this.directorService.selectedModel;
  // triggerMessage = this.directorService.triggerMessage;
  constructor () {
    this.title = 'Contacts';
    this.displayedColumns = [
      'title',
      'name',
      'cellPhone',
      'email',
    ];
    this.dataSource = new MatTableDataSource(this.directors);
  }

  ngOnInit () {
    // this.directorService.getDirectors().subscribe((directors: Director[]) => {
    //   this.directors = directors;
    //   this.dataSource = new MatTableDataSource(directors);
    //   console.log(this.directors);
    // });
    this.directorService.reloadDirectors();

  }
}
