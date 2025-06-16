import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpSectionAdvanceEquationComponent } from './help-section-advance-equation.component';

describe('HelpSectionAdvanceEquationComponent', () => {
  let component: HelpSectionAdvanceEquationComponent;
  let fixture: ComponentFixture<HelpSectionAdvanceEquationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpSectionAdvanceEquationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpSectionAdvanceEquationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
