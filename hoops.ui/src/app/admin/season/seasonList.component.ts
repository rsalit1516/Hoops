import { Component, OnInit, Input, inject, effect, signal } from '@angular/core';
import { SeasonService } from '../../services/season.service';
import { Season } from '../../domain/season';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { SeasonDetailComponent } from './seasonDetail.component';
import { NgFor, NgIf, DatePipe } from '@angular/common';

@Component({
  selector: 'csbc-season-list',
  templateUrl: './seasonList.component.html',
  styleUrls: [
    '../admin.component.scss'
  ],
  imports: [NgFor, NgIf, SeasonDetailComponent, FormsModule, MatTableModule, MatButtonModule, MatIconModule, DatePipe]
})
export class SeasonListComponent implements OnInit {
  readonly _seasonService = inject(SeasonService);
  seasons = signal<Season[]>([]);
  errorMessage: string | undefined;
  selectedSeason: Season | undefined;
  displayedColumns = [
    'description',
  ];
  canEdit = false;
  dataSource!: MatTableDataSource<Season>;
  constructor () {
    effect(() => {
      const seasons = this.seasons();// this._seasonService.getSeasons().subscribe(seasons => {
      //     this.seasons = seasons as Season[];
      this.dataSource = new MatTableDataSource(this.seasons());
      // });
    });
  }

  ngOnInit () {
    this._seasonService.seasons$.subscribe(seasons => {
      this.seasons.update(() => seasons as Season[]);
    });
    // error => this.errorMessage = <any>error);
  }

  onSelect (season: Season): void {
    this.selectedSeason = season;
  }
}
