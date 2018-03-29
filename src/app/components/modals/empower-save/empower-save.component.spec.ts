import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpowerSaveComponent } from './empower-save.component';

describe('EmpowerSaveComponent', () => {
  let component: EmpowerSaveComponent;
  let fixture: ComponentFixture<EmpowerSaveComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [EmpowerSaveComponent],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpowerSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
