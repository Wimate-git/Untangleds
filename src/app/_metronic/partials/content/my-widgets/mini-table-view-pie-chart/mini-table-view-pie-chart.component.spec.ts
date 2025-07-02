import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniTableViewPieChartComponent } from './mini-table-view-pie-chart.component';

describe('MiniTableViewPieChartComponent', () => {
  let component: MiniTableViewPieChartComponent;
  let fixture: ComponentFixture<MiniTableViewPieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiniTableViewPieChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiniTableViewPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
