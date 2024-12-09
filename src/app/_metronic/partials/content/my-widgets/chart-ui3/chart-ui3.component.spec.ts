import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartUi3Component } from './chart-ui3.component';

describe('ChartUi3Component', () => {
  let component: ChartUi3Component;
  let fixture: ComponentFixture<ChartUi3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartUi3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartUi3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
