import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnosComponent } from './turnos.component';

describe('TurnosComponent', () => {
  let component: TurnosComponent;
  let fixture: ComponentFixture<TurnosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TurnosComponent]
    });
    fixture = TestBed.createComponent(TurnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
