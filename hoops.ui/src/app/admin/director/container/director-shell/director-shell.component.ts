import { Component, inject, OnInit } from '@angular/core';
import { DirectorService } from './../../director.service';
import { Director } from '../../../../domain/director';
import { DirectorEditComponent } from '../../component/director-edit/director-edit.component';
import { DirectorListComponent } from '../../component/director-list/director-list.component';

@Component({
  selector: 'csbc-director-shell',
  templateUrl: './director-shell.component.html',
  styleUrls: ['./director-shell.component.css'],
  imports: [DirectorListComponent, DirectorEditComponent]
})
export class DirectorShellComponent implements OnInit {
  private directorService = inject(DirectorService);
  datasource!: Director[];
  directors: any;
  constructor () { }

  ngOnInit () {
    this.directorService.getDirectors();
    // console.log(this.directors);
    // this.datasource = this.directors;
  }
}
