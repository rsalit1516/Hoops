import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'csbc-shell-title',
  imports: [],
  template: `
  <div class="title flex flex-1 justify-end">{{title()}}</div>
  `,
  styleUrl: './shell-title.scss'
})
export class ShellTitle {
  title = input<string>();
}
