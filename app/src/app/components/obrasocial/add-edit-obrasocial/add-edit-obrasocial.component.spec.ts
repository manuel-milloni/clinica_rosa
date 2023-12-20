import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditObrasocialComponent } from './add-edit-obrasocial.component';

describe('AddEditObrasocialComponent', () => {
  let component: AddEditObrasocialComponent;
  let fixture: ComponentFixture<AddEditObrasocialComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditObrasocialComponent]
    });
    fixture = TestBed.createComponent(AddEditObrasocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
