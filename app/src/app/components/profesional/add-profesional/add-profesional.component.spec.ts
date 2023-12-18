import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProfesionalComponent } from './add-profesional.component';

describe('AddProfesionalComponent', () => {
  let component: AddProfesionalComponent;
  let fixture: ComponentFixture<AddProfesionalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddProfesionalComponent]
    });
    fixture = TestBed.createComponent(AddProfesionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
