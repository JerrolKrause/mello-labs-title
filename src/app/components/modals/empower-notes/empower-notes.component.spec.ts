import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpowerNotesComponent } from './empower-notes.component';

describe('EmpowerNotesComponent', () => {
  let component: EmpowerNotesComponent;
  let fixture: ComponentFixture<EmpowerNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpowerNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpowerNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
