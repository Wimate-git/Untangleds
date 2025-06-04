import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Chart1HelpFormatTypeComponent } from './chart1-help-format-type.component';

describe('Chart1HelpFormatTypeComponent', () => {
  let component: Chart1HelpFormatTypeComponent;
  let fixture: ComponentFixture<Chart1HelpFormatTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chart1HelpFormatTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Chart1HelpFormatTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
