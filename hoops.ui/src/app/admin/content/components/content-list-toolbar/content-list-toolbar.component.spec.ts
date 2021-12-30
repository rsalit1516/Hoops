import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentListToolbarComponent } from './content-list-toolbar.component';

describe('ContentListToolbarComponent', () => {
  let component: ContentListToolbarComponent;
  let fixture: ComponentFixture<ContentListToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentListToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentListToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
