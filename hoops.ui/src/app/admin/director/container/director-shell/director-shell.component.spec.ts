import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectorShellComponent } from './director-shell.component';

describe('DirectorShellComponent', () => {
  let component: DirectorShellComponent;
  let fixture: ComponentFixture<DirectorShellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DirectorShellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectorShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
