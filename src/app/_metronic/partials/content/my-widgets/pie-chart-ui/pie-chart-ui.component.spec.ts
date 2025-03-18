import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieChartUiComponent } from './pie-chart-ui.component';

describe('PieChartUiComponent', () => {
  let component: PieChartUiComponent;
  let fixture: ComponentFixture<PieChartUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PieChartUiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PieChartUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
