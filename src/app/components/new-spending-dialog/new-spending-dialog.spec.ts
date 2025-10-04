import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSpendingDialog } from './new-spending-dialog';

describe('NewSpendingDialog', () => {
  let component: NewSpendingDialog;
  let fixture: ComponentFixture<NewSpendingDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewSpendingDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewSpendingDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
