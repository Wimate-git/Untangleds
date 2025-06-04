import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpSectionDateTypeComponent } from './help-section-date-type.component';

describe('HelpSectionDateTypeComponent', () => {
  let component: HelpSectionDateTypeComponent;
  let fixture: ComponentFixture<HelpSectionDateTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpSectionDateTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpSectionDateTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
