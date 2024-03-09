import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHospitalComponent } from './addhospital.component';

describe('HospitalformComponent', () => {
  let component: AddHospitalComponent;
  let fixture: ComponentFixture<AddHospitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddHospitalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddHospitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
