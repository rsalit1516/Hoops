import { Component, input } from '@angular/core';

@Component({
  selector: 'csbc-shell-title',
  imports: [],
  template: `
  <div class="title flex flex-1 justify-end">{{title()}}</div>
  `,
  styleUrl: './shell-title.component.scss'
})
export class ShellTitleComponent {
  title = input<string>();
}
