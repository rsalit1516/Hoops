
import { Component, input } from '@angular/core';

@Component({
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
