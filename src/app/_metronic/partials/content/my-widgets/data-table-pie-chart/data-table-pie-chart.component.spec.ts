import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTablePieChartComponent } from './data-table-pie-chart.component';

describe('DataTablePieChartComponent', () => {
  let component: DataTablePieChartComponent;
  let fixture: ComponentFixture<DataTablePieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTablePieChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataTablePieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
