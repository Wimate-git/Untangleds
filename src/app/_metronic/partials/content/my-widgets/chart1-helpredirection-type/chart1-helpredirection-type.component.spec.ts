import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Chart1HelpredirectionTypeComponent } from './chart1-helpredirection-type.component';

describe('Chart1HelpredirectionTypeComponent', () => {
  let component: Chart1HelpredirectionTypeComponent;
  let fixture: ComponentFixture<Chart1HelpredirectionTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chart1HelpredirectionTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Chart1HelpredirectionTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
