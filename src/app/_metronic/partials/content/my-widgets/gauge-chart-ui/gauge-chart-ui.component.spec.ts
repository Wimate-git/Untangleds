import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GaugeChartUiComponent } from './gauge-chart-ui.component';

describe('GaugeChartUiComponent', () => {
  let component: GaugeChartUiComponent;
  let fixture: ComponentFixture<GaugeChartUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GaugeChartUiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GaugeChartUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
