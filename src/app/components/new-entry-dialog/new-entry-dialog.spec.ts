import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEntryDialog } from './new-entry-dialog';

describe('NewEntryDialog', () => {
  let component: NewEntryDialog;
  let fixture: ComponentFixture<NewEntryDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewEntryDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewEntryDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
