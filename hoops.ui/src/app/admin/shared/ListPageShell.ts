import { Component, ContentChild } from '@angular/core';

// list-page-shell.component.ts
@Component({
  selector: 'app-list-page-shell',
  template: `
    <div class="list-page-container">
      <!-- Filter Section -->
      <div class="filter-section" *ngIf="hasFilterContent">
        <mat-card>
          <mat-card-content>
            <ng-content select="[filter]"></ng-content>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Action Bar (optional - for add buttons, etc) -->
      <div class="action-bar" *ngIf="hasActionsContent">
        <ng-content select="[actions]"></ng-content>
      </div>

      <!-- List/Table Section -->
      <div class="list-section">
        <mat-card>
          <mat-card-content>
            <ng-content select="[list]"></ng-content>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [
    `
      .list-page-container {
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        height: 100%;
      }

      .filter-section {
        flex-shrink: 0;
      }

      .action-bar {
        flex-shrink: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .list-section {
        flex: 1;
        min-height: 0; /* Important for proper scrolling */
      }

      .list-section mat-card {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .list-section mat-card-content {
        flex: 1;
        overflow: auto;
      }
    `,
  ],
})
export class ListPageShellComponent {
  @ContentChild('[filter]') filterContent?: any;
  @ContentChild('[actions]') actionsContent?: any;

  get hasFilterContent(): boolean {
    return !!this.filterContent;
  }

  get hasActionsContent(): boolean {
    return !!this.actionsContent;
  }
}
