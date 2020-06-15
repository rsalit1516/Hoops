import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SeasonService } from '../../services/season.service';
import { Season } from '../../domain/season';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'csbc-season-list',
    templateUrl: './seasonList.component.html',
    styleUrls: [
    '../admin.component.scss']
})
export class SeasonListComponent implements OnInit {
    seasons: Season[];
    errorMessage: string;
    selectedSeason: Season;
    displayedColumns = [
        'description',
      ];
      canEdit = false;
      dataSource: MatTableDataSource<Season>;
 
    constructor(private _seasonService: SeasonService) { }

    ngOnInit() {
        this._seasonService.seasons$.subscribe(seasons => {
                this.seasons = seasons;
                this.dataSource = new MatTableDataSource(this.seasons);
                console.log(seasons);
            });
                // error => this.errorMessage = <any>error);
    }

    onSelect(season: Season): void {
        this.selectedSeason = season;
    }
}
