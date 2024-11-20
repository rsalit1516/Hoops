import { Component, OnInit } from '@angular/core';
import { DirectorService } from '@app/admin/director/director.service';
import { NgFor, AsyncPipe, TitleCasePipe } from '@angular/common';

@Component({
    selector: 'csbc-contacts',
    templateUrl: './contacts.component.html',
    styleUrls: ['./contacts.component.scss', '../home/home.component.scss'],
    imports: [
        NgFor,
        AsyncPipe,
        TitleCasePipe,
    ]
})
export class ContactsComponent implements OnInit {
  title: string;
  directorList$: any;
  constructor(private directorService: DirectorService) {
    this.title = 'Contacts';
  }

  ngOnInit() {
    this.directorList$ = this.directorService.getDirectors();
  }
}
