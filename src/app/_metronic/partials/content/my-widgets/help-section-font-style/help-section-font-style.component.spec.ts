import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpSectionFontStyleComponent } from './help-section-font-style.component';

describe('HelpSectionFontStyleComponent', () => {
  let component: HelpSectionFontStyleComponent;
  let fixture: ComponentFixture<HelpSectionFontStyleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpSectionFontStyleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpSectionFontStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
