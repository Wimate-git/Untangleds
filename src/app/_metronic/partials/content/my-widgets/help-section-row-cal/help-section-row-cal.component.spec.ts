import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpSectionRowCalComponent } from './help-section-row-cal.component';

describe('HelpSectionRowCalComponent', () => {
  let component: HelpSectionRowCalComponent;
  let fixture: ComponentFixture<HelpSectionRowCalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpSectionRowCalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpSectionRowCalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
