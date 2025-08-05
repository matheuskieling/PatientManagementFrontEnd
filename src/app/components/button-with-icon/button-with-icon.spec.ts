import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonWithIcon } from './button-with-icon';

describe('ButtonWithIcon', () => {
  let component: ButtonWithIcon;
  let fixture: ComponentFixture<ButtonWithIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonWithIcon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonWithIcon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
