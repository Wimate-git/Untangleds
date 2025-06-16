import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpSectionRowUnitComponent } from './help-section-row-unit.component';

describe('HelpSectionRowUnitComponent', () => {
  let component: HelpSectionRowUnitComponent;
  let fixture: ComponentFixture<HelpSectionRowUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpSectionRowUnitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpSectionRowUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
