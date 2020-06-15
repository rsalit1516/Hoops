import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    '../../node_modules/font-awesome/css/font-awesome.css',
    './app.component.scss'
  ]
})
export class AppComponent {
  @Output() public sidenavToggle = new EventEmitter();
  title = 'app works!';
  constructor() {}
  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  };
}
