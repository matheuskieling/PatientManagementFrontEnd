import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPatientDialog } from './new-patient-dialog';

describe('NewPatientDialog', () => {
  let component: NewPatientDialog;
  let fixture: ComponentFixture<NewPatientDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewPatientDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewPatientDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
