import { Component, OnInit, output } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TopNavComponent } from './shared/top-nav/top-nav.component';
import { SidenavListComponent } from './shared/sidenav-list/sidenav-list.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: [
        './app.component.scss'
    ],
    imports: [SidenavListComponent,
        TopNavComponent, RouterOutlet,
        MatSidenavModule, MatNativeDateModule]
})
export class AppComponent implements OnInit {
  public readonly sidenavToggle = output();
  title = 'CSBC Hoops';

  constructor(private router: Router) {}
  ngOnInit() {
      this.router.navigate([''])
  }
  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  };
}
