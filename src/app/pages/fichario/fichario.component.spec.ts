import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fichario } from './fichario.component';

describe('Fichario', () => {
  let component: Fichario;
  let fixture: ComponentFixture<Fichario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Fichario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Fichario);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
