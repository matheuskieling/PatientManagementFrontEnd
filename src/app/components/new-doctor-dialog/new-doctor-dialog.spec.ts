import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDoctorDialog } from './new-doctor-dialog';

describe('NewDoctorDialog', () => {
  let component: NewDoctorDialog;
  let fixture: ComponentFixture<NewDoctorDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewDoctorDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewDoctorDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
