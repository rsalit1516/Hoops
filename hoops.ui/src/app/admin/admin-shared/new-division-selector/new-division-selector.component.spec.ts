import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewDivisionSelectorComponent } from './new-division-selector.component';
import { DivisionService } from '@app/services/division.service';

describe('NewDivisionSelectorComponent', () => {
  let component: NewDivisionSelectorComponent;
  let fixture: ComponentFixture<NewDivisionSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ NewDivisionSelectorComponent ],
      providers: [DivisionService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewDivisionSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should have a title', () => {
    component.title = 'New Division';
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h2').textContent).toContain('New Division');
  });
});
