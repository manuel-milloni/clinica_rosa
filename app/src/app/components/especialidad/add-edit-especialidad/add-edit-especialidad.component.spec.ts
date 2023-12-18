import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditEspecialidadComponent } from './add-edit-especialidad.component';

describe('AddEditEspecialidadComponent', () => {
  let component: AddEditEspecialidadComponent;
  let fixture: ComponentFixture<AddEditEspecialidadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditEspecialidadComponent]
    });
    fixture = TestBed.createComponent(AddEditEspecialidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
