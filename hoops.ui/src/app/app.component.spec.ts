/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MatSidenav, MatSidenavContainer } from '@angular/material/sidenav';


describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [AppComponent],
    declarations: [MatSidenavContainer,
        MatSidenav],
});
  });

  it('should create the app', async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'app works!'`, async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('CSBC Hoops');
  }));
});import { NoopAnimationsModule } from '@angular/platform-browser/animations';

