import { Component, OnInit, Input } from '@angular/core';
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
    standalone: true,
    imports: [NgFor, NgIf, SeasonDetailComponent, FormsModule, MatTableModule, MatButtonModule, MatIconModule, DatePipe]
})
export class SeasonListComponent implements OnInit {
    seasons: Season[] | undefined;
    errorMessage: string | undefined;
    selectedSeason: Season | undefined;
    displayedColumns = [
        'description',
      ];
      canEdit = false;
      dataSource!: MatTableDataSource<Season>;
    constructor(private _seasonService: SeasonService) { }

    ngOnInit() {
        this._seasonService.seasons$.subscribe(seasons => {
                this.seasons = seasons as Season[];
                this.dataSource = new MatTableDataSource(this.seasons);
            });
                // error => this.errorMessage = <any>error);
    }

    onSelect(season: Season): void {
        this.selectedSeason = season;
    }
}
