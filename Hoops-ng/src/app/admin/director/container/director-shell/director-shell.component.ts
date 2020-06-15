import { Component, OnInit } from '@angular/core';
import { DirectorService } from './../../director.service';

@Component({
  selector: 'csbc-director-shell',
  templateUrl: './director-shell.component.html',
  styleUrls: ['./director-shell.component.css']
})
export class DirectorShellComponent implements OnInit {
  datasource = [];
  directors: any;
  constructor(private directorService: DirectorService) {}

  ngOnInit() {
    this.directors = this.directorService.getDirectors();
    console.log(this.directors);
    this.datasource = this.directors;
  }
}
