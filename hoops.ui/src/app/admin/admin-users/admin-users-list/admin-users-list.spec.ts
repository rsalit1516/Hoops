import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { signal } from '@angular/core';
import { AdminUsersList } from './admin-users-list';
import { AdminUsersService } from '../admin-users.service';
import { LoggerService } from '@app/services/logger.service';

describe('AdminUsersList', () => {
  const mockUsers = [
    {
      userId: 1,
      userName: 'alice',
      name: 'Alice A',
      isAdmin: false,
      firstName: 'Alice',
      lastName: 'A',
      userType: 1,
    },
    {
      userId: 2,
      userName: 'bob',
      name: 'Bob B',
      isAdmin: true,
      firstName: 'Bob',
      lastName: 'B',
      userType: 3,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUsersList, HttpClientTestingModule, RouterTestingModule],
      providers: [
        {
          provide: AdminUsersService,
          useValue: {
            loadUsers: jasmine.createSpy('loadUsers'),
            users: signal(mockUsers),
            selectedUser: signal(null),
          },
        },
        {
          provide: LoggerService,
          useValue: { info: jasmine.createSpy(), warn: jasmine.createSpy(), error: jasmine.createSpy(), debug: jasmine.createSpy() },
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
