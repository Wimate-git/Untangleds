import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartUi2Component } from './chart-ui2.component';

describe('ChartUi2Component', () => {
  let component: ChartUi2Component;
  let fixture: ComponentFixture<ChartUi2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartUi2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartUi2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
