import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GaugeChartConfigComponent } from './gauge-chart-config.component';

describe('GaugeChartConfigComponent', () => {
  let component: GaugeChartConfigComponent;
  let fixture: ComponentFixture<GaugeChartConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GaugeChartConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GaugeChartConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
