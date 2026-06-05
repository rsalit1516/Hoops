
import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'csbc-section-title',
  imports: [],
  template: `
  <span class="title">{{title()}}</span>
  `,
  styleUrl: './section-title.scss',
})
export class SectionTitle {
  title = input<string>();
}
