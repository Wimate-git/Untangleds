import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTableChart2Component } from './data-table-chart2.component';

describe('DataTableChart2Component', () => {
  let component: DataTableChart2Component;
  let fixture: ComponentFixture<DataTableChart2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTableChart2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataTableChart2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
