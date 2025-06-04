import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TileWithIconHelpFormatTypeComponent } from './tile-with-icon-help-format-type.component';

describe('TileWithIconHelpFormatTypeComponent', () => {
  let component: TileWithIconHelpFormatTypeComponent;
  let fixture: ComponentFixture<TileWithIconHelpFormatTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TileWithIconHelpFormatTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TileWithIconHelpFormatTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
