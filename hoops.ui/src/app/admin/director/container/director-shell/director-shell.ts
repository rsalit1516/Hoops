import { Component, inject, OnInit } from '@angular/core';
import { DirectorService } from '../../../../services/director.service';
import { Director } from '../../../../domain/director';
import { DirectorEdit } from '../../component/director-edit/director-edit';
import { DirectorList } from '../../component/director-list/director-list';

@Component({
  selector: 'csbc-director-shell',
  templateUrl: "./director-shell.html",
  styleUrls: ['./director-shell.css'],
  imports: [DirectorList, DirectorEdit]
})
export class DirectorShell implements OnInit {
  private directorService = inject(DirectorService);
  datasource!: Director[];
  directors: any;
  constructor () { }

  ngOnInit () {
    //this.directorService.getDirectors();
    // console.log(this.directors);
    // this.datasource = this.directors;
  }
}
