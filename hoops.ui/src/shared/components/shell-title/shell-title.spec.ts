import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShellTitle } from './shell-title';

describe('ShellTitle', () => {
  let component: ShellTitle;
  let fixture: ComponentFixture<ShellTitle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
  imports: [ShellTitle]
    })
    .compileComponents();

  fixture = TestBed.createComponent(ShellTitle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
