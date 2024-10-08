import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SeasonAddComponent } from './season-add.component';
import { SeasonService } from '@app/services/season.service';
import { CommonModule } from '@angular/common';

describe('SeasonAddComponent', () => {
  let component: SeasonAddComponent;
  let fixture: ComponentFixture<SeasonAddComponent>;
  let seasonService: jasmine.SpyObj<SeasonService>;

  beforeEach(async () => {
    const seasonServiceSpy = jasmine.createSpyObj('SeasonService', ['getCurrentDivision']);

    await TestBed.configureTestingModule({
      declarations: [ ],
      providers: [
        { provide: SeasonService, useValue: seasonServiceSpy },
      ],
      imports: [ CommonModule,
        ReactiveFormsModule,
        UntypedFormBuilder,
        SeasonAddComponent ]
    }).compileComponents();

    fixture = TestBed.createComponent(SeasonAddComponent);
    component = fixture.componentInstance;
    seasonService = TestBed.inject(SeasonService) as jasmine.SpyObj<SeasonService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a title "Season"', () => {
    expect(component.title).toBe('Season');
  });

  it('should create a form with three controls', () => {
    expect(component.form.contains('name')).toBeTruthy();
    expect(component.form.contains('seasonId')).toBeTruthy();
    expect(component.form.contains('divisionId')).toBeTruthy();
  });

  it('should make the name control required', () => {
    const control = component.form.get('name');
    control.setValue('');
    expect(control.valid).toBeFalsy();
  });
});
