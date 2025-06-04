import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Chart1HelpCustomValueComponent } from './chart1-help-custom-value.component';

describe('Chart1HelpCustomValueComponent', () => {
  let component: Chart1HelpCustomValueComponent;
  let fixture: ComponentFixture<Chart1HelpCustomValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chart1HelpCustomValueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Chart1HelpCustomValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
