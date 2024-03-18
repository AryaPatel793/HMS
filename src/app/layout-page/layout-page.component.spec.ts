import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutPageComponent } from './layout-page.component';

describe('AdminPageComponent', () => {
  let component: LayoutPageComponent;
  let fixture: ComponentFixture<LayoutPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LayoutPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
