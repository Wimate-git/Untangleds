import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpSectionPredefinedComponent } from './help-section-predefined.component';

describe('HelpSectionPredefinedComponent', () => {
  let component: HelpSectionPredefinedComponent;
  let fixture: ComponentFixture<HelpSectionPredefinedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpSectionPredefinedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpSectionPredefinedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
