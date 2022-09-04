import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ContentShellComponent } from './content-shell.component';

describe('ContentShellComponent', () => {
  let component: ContentShellComponent;
  let fixture: ComponentFixture<ContentShellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentShellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
