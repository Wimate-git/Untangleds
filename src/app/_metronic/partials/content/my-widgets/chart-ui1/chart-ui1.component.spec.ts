import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartUi1Component } from './chart-ui1.component';

describe('ChartUi1Component', () => {
  let component: ChartUi1Component;
  let fixture: ComponentFixture<ChartUi1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartUi1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartUi1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
