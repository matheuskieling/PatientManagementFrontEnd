import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyClosing } from './daily-closing';

describe('DailyClosing', () => {
  let component: DailyClosing;
  let fixture: ComponentFixture<DailyClosing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyClosing]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyClosing);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
