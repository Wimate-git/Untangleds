import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpSectionChartOptionsComponent } from './help-section-chart-options.component';

describe('HelpSectionChartOptionsComponent', () => {
  let component: HelpSectionChartOptionsComponent;
  let fixture: ComponentFixture<HelpSectionChartOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpSectionChartOptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpSectionChartOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
