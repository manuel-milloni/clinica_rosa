import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInPacienteComponent } from './sign-in-paciente.component';

describe('SignInPacienteComponent', () => {
  let component: SignInPacienteComponent;
  let fixture: ComponentFixture<SignInPacienteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignInPacienteComponent]
    });
    fixture = TestBed.createComponent(SignInPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
