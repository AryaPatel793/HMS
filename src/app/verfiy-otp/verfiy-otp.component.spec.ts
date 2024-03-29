import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerfiyOtpComponent } from './verfiy-otp.component';

describe('VerfiyOtpComponent', () => {
  let component: VerfiyOtpComponent;
  let fixture: ComponentFixture<VerfiyOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerfiyOtpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerfiyOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
