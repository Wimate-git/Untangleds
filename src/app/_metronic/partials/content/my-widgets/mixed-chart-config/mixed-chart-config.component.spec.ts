import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MixedChartConfigComponent } from './mixed-chart-config.component';
import { beforeEach, describe, it } from 'node:test';

describe('MixedChartConfigComponent', () => {
  let component: MixedChartConfigComponent;
  let fixture: ComponentFixture<MixedChartConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MixedChartConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MixedChartConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
