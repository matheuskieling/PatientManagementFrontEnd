import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewHealthPlanDialog } from './new-health-plan-dialog';

describe('NewHealthPlanDialog', () => {
  let component: NewHealthPlanDialog;
  let fixture: ComponentFixture<NewHealthPlanDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewHealthPlanDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewHealthPlanDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
