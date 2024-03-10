import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProInformesComponent } from './pro-informes.component';

describe('ProInformesComponent', () => {
  let component: ProInformesComponent;
  let fixture: ComponentFixture<ProInformesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProInformesComponent]
    });
    fixture = TestBed.createComponent(ProInformesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
