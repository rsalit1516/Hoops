import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'csbc-section-title',
  imports: [ CommonModule ],
  template: `
  <span class="title">{{title()}}</span>
  `,
  styleUrl: './section-title.scss',
})
export class SectionTitle {
  title = input<string>();
}
