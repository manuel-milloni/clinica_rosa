import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListProfesionalComponent } from './list-profesional.component';

describe('ListProfesionalComponent', () => {
  let component: ListProfesionalComponent;
  let fixture: ComponentFixture<ListProfesionalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListProfesionalComponent]
    });
    fixture = TestBed.createComponent(ListProfesionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
