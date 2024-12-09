import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartUi4Component } from './chart-ui4.component';

describe('ChartUi4Component', () => {
  let component: ChartUi4Component;
  let fixture: ComponentFixture<ChartUi4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartUi4Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartUi4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
