import { Component } from '@angular/core';
import { SectionTitleComponent } from "../../../shared/components/section-title/section-title.component";
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'csbc-player-balance',
  imports: [MatCardModule,
    SectionTitleComponent],
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
  styleUrls: ['./player-balance.component.scss',
    '../../../shared/scss/cards.scss',
  ]
})
export class PlayerBalanceComponent {
  playerBalance = '$0.00';
}
