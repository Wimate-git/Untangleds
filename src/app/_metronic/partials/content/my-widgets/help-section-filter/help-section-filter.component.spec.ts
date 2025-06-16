import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpSectionFilterComponent } from './help-section-filter.component';

describe('HelpSectionFilterComponent', () => {
  let component: HelpSectionFilterComponent;
  let fixture: ComponentFixture<HelpSectionFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpSectionFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpSectionFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
