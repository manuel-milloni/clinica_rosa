import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHorarioComponent } from './edit-horario.component';

describe('EditHorarioComponent', () => {
  let component: EditHorarioComponent;
  let fixture: ComponentFixture<EditHorarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditHorarioComponent]
    });
    fixture = TestBed.createComponent(EditHorarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
