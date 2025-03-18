import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieChartConfigComponent } from './pie-chart-config.component';

describe('PieChartConfigComponent', () => {
  let component: PieChartConfigComponent;
  let fixture: ComponentFixture<PieChartConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PieChartConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PieChartConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
