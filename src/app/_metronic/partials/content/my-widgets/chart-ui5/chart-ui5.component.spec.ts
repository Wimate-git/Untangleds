import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartUi5Component } from './chart-ui5.component';

describe('ChartUi5Component', () => {
  let component: ChartUi5Component;
  let fixture: ComponentFixture<ChartUi5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartUi5Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartUi5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
