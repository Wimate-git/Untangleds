import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Chart1ConfigComponent } from './chart1-config.component';

describe('Chart1ConfigComponent', () => {
  let component: Chart1ConfigComponent;
  let fixture: ComponentFixture<Chart1ConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chart1ConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Chart1ConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
