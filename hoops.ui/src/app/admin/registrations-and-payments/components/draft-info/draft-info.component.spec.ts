import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftInfoComponent } from './draft-info.component';

describe('DraftInfoComponent', () => {
  let component: DraftInfoComponent;
  let fixture: ComponentFixture<DraftInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DraftInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
