import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiperfilPacienteComponent } from './miperfil-paciente.component';

describe('MiperfilPacienteComponent', () => {
  let component: MiperfilPacienteComponent;
  let fixture: ComponentFixture<MiperfilPacienteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MiperfilPacienteComponent]
    });
    fixture = TestBed.createComponent(MiperfilPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
