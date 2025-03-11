import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FunnelChartUiComponent } from './funnel-chart-ui.component';

describe('FunnelChartUiComponent', () => {
  let component: FunnelChartUiComponent;
  let fixture: ComponentFixture<FunnelChartUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FunnelChartUiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FunnelChartUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
