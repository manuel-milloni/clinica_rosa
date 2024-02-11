import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProMisTurnosComponent } from './pro-mis-turnos.component';

describe('ProMisTurnosComponent', () => {
  let component: ProMisTurnosComponent;
  let fixture: ComponentFixture<ProMisTurnosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProMisTurnosComponent]
    });
    fixture = TestBed.createComponent(ProMisTurnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
