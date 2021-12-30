/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CsbcClubDocsComponent } from './csbc-club-docs.component';

describe('CsbcClubDocsComponent', () => {
  let component: CsbcClubDocsComponent;
  let fixture: ComponentFixture<CsbcClubDocsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CsbcClubDocsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsbcClubDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
