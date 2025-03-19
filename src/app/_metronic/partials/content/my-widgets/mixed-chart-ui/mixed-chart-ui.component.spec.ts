import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MixedChartUiComponent } from './mixed-chart-ui.component';

describe('MixedChartUiComponent', () => {
  let component: MixedChartUiComponent;
  let fixture: ComponentFixture<MixedChartUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MixedChartUiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MixedChartUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
