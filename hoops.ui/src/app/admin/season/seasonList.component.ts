import { Component, OnInit, Input } from '@angular/core';
import { SeasonService } from '../../services/season.service';
import { Season } from '../../domain/season';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';

@Component({
    selector: 'csbc-season-list',
    templateUrl: './seasonList.component.html',
    styleUrls: [
    '../admin.component.scss']
})
export class SeasonListComponent implements OnInit {
    seasons: Season[] | undefined;
    errorMessage: string | undefined;
    selectedSeason: Season | undefined;
    displayedColumns = [
        'description',
      ];
      canEdit = false;
      dataSource: MatTableDataSource<Season> | undefined;
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
