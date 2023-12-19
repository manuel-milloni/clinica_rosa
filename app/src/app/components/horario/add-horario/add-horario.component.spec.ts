import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHorarioComponent } from './add-horario.component';

describe('AddHorarioComponent', () => {
  let component: AddHorarioComponent;
  let fixture: ComponentFixture<AddHorarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddHorarioComponent]
    });
    fixture = TestBed.createComponent(AddHorarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
