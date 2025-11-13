import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CitizenPortalPage } from './citizen-portal.page';

describe('CitizenPortalPage', () => {
  let component: CitizenPortalPage;
  let fixture: ComponentFixture<CitizenPortalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CitizenPortalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

