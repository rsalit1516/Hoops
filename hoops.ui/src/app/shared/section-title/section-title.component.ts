import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'csbc-section-title',
  imports: [ CommonModule ],
  template: `
  <span class="title">{{title()}}</span>
  `,
  styleUrl: './section-title.component.scss',
})
export class SectionTitleComponent {
  title = input<string>();
}
