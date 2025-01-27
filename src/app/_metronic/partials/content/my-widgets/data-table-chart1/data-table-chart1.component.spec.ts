import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTableChart1Component } from './data-table-chart1.component';

describe('DataTableChart1Component', () => {
  let component: DataTableChart1Component;
  let fixture: ComponentFixture<DataTableChart1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTableChart1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataTableChart1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
