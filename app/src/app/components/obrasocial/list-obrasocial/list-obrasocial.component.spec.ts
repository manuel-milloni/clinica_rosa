import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListObrasocialComponent } from './list-obrasocial.component';

describe('ListObrasocialComponent', () => {
  let component: ListObrasocialComponent;
  let fixture: ComponentFixture<ListObrasocialComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListObrasocialComponent]
    });
    fixture = TestBed.createComponent(ListObrasocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
