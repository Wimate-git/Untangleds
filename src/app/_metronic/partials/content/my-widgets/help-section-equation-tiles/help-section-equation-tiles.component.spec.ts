import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpSectionEquationTilesComponent } from './help-section-equation-tiles.component';

describe('HelpSectionEquationTilesComponent', () => {
  let component: HelpSectionEquationTilesComponent;
  let fixture: ComponentFixture<HelpSectionEquationTilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpSectionEquationTilesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpSectionEquationTilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
