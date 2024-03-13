import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatietDetailComponent } from './patiet-detail.component';

describe('PatietDetailComponent', () => {
  let component: PatietDetailComponent;
  let fixture: ComponentFixture<PatietDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatietDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PatietDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
