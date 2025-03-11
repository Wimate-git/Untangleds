import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTableFunnelChartComponent } from './data-table-funnel-chart.component';

describe('DataTableFunnelChartComponent', () => {
  let component: DataTableFunnelChartComponent;
  let fixture: ComponentFixture<DataTableFunnelChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTableFunnelChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataTableFunnelChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
