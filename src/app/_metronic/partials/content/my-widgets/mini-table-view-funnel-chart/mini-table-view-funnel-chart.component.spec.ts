import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniTableViewFunnelChartComponent } from './mini-table-view-funnel-chart.component';

describe('MiniTableViewFunnelChartComponent', () => {
  let component: MiniTableViewFunnelChartComponent;
  let fixture: ComponentFixture<MiniTableViewFunnelChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiniTableViewFunnelChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiniTableViewFunnelChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
