import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Chart2ConfigComponent } from './chart2-config.component';

describe('Chart2ConfigComponent', () => {
  let component: Chart2ConfigComponent;
  let fixture: ComponentFixture<Chart2ConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chart2ConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Chart2ConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
