import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Chart1HelpPrimaryValueComponent } from './chart1-help-primary-value.component';

describe('Chart1HelpPrimaryValueComponent', () => {
  let component: Chart1HelpPrimaryValueComponent;
  let fixture: ComponentFixture<Chart1HelpPrimaryValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chart1HelpPrimaryValueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Chart1HelpPrimaryValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
