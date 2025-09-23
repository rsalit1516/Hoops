import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AdminUsersList } from './admin-users-list';
import { AdminUsersService } from '../admin-users.service';

describe('AdminUsersList', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUsersList, HttpClientTestingModule, RouterTestingModule],
      providers: [
        {
          provide: AdminUsersService,
          useValue: {
            getUsers: () =>
              of([
                {
                  userId: 1,
                  userName: 'alice',
                  isAdmin: false,
                  firstName: 'Alice',
                  lastName: 'A',
                  userType: 1,
                },
                {
                  userId: 2,
                  userName: 'bob',
                  isAdmin: true,
                  firstName: 'Bob',
                  lastName: 'B',
                  userType: 3,
                },
              ]),
          },
        },
      ],
    }).compileComponents();
  });

  it('should create and render rows', () => {
    const fixture = TestBed.createComponent(AdminUsersList);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('alice');
    expect(compiled.textContent).toContain('Bob');
    expect(compiled.textContent).toContain('Admin');
  });
});
