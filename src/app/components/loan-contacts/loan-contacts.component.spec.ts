import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanContactsComponent } from './loan-contacts.component';

describe('LoanContactsComponent', () => {
  let component: LoanContactsComponent;
  let fixture: ComponentFixture<LoanContactsComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [LoanContactsComponent],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
