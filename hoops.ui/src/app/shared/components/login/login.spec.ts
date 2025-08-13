import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { Login } from './login';
import { AuthService } from '@app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

describe('Login Component', () => {
  let fixture: ComponentFixture<Login>;
  let component: Login;
  let routerNavigateSpy: jasmine.Spy;

  beforeEach(async () => {
    routerNavigateSpy = jasmine.createSpy('navigate');
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: () => of({ userName: 'u', userType: 1 }),
            currentUser: { set: () => {} },
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { queryParamMap: new Map([['returnUrl', '/secure']]) },
          },
        },
        {
          provide: Router,
          useValue: {
            navigate: routerNavigateSpy,
            navigateByUrl: routerNavigateSpy,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('navigates to returnUrl on successful login', fakeAsync(() => {
    component.loginForm.setValue({ userName: 'u', password: 'p' });
    component.onSubmitClick();
    tick();
    expect(routerNavigateSpy).toHaveBeenCalled();
  }));

  it('toggles hidePassword state', () => {
    const initial = component.hidePassword;
    component.hidePassword = !initial;
    expect(component.hidePassword).toBe(!initial);
  });
});
