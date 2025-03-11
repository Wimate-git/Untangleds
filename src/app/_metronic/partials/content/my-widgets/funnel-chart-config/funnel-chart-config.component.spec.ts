import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FunnelChartConfigComponent } from './funnel-chart-config.component';

describe('FunnelChartConfigComponent', () => {
  let component: FunnelChartConfigComponent;
  let fixture: ComponentFixture<FunnelChartConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FunnelChartConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FunnelChartConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
