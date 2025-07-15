import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShellTitleComponent } from './shell-title.component';

describe('ShellTitleComponent', () => {
  let component: ShellTitleComponent;
  let fixture: ComponentFixture<ShellTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShellTitleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShellTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
