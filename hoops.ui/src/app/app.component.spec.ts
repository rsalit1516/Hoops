import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';

import { AppComponent } from './app.component';
import { TopNavComponent } from './shared/top-nav/top-nav.component';
import { SidenavListComponent } from './shared/sidenav-list/sidenav-list.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatNativeDateModule } from '@angular/material/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { provideMockStore } from '@ngrx/store/testing';
import { StoreModule } from '@ngrx/store';


describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
      ],
      imports: [
        CommonModule,
        MatSidenavModule,
        MatNativeDateModule,
        AppComponent,
        NoopAnimationsModule,
        // RouterLink, RouterOutlet,
        RouterModule,
        StoreModule.forRoot(provideMockStore)
      ],
      providers: [
        { provide: TopNavComponent, useValue: {} },
        { provide: SidenavListComponent, useValue: {} },
        { provide: Router, useValue: {} },
        { provide: ActivatedRoute, useValue: {} },
        provideMockStore({}),
        // {provide: Router, useClass: MockRouter}
      ]
    }).compileComponents();

    // const mockRouter = new MockRouter();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have a title "CSBC Hoops"', () => {
    expect(component.title).toBe('CSBC Hoops');
  });

  it('should navigate to the root on ngOnInit', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.ngOnInit();
    expect(navigateSpy).toHaveBeenCalledWith(['']);
  });

  it('should emit sidenavToggle event on onToggleSidenav', () => {
    spyOn(component.sidenavToggle, 'emit');
    component.onToggleSidenav();
    expect(component.sidenavToggle.emit).toHaveBeenCalled();
  });
});
