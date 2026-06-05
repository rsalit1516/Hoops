import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SectionTitle } from "../../../shared/components/section-title/section-title";
import { MatCardModule } from '@angular/material/card';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'csbc-player-balance',
  imports: [MatCardModule,
    SectionTitle],
  template:
    `
    <mat-card>
    <mat-card-header>
    <mat-card-title>Player Balance
    <csbc-section-title title="Player Balance"/>
    </mat-card-title>
    </mat-card-header>
    <mat-card-content>
    <div>Player Balance: {{playerBalance}}</div>
    </mat-card-content>
    </mat-card>`
  ,
  styleUrls: ['./player-balance.scss',
    '../../../shared/scss/cards.scss',
  ]
})
export class PlayerBalance {
  playerBalance = '$0.00';
}
