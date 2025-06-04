import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tile1HelpFormatTypeComponent } from './tile1-help-format-type.component';

describe('Tile1HelpFormatTypeComponent', () => {
  let component: Tile1HelpFormatTypeComponent;
  let fixture: ComponentFixture<Tile1HelpFormatTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tile1HelpFormatTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tile1HelpFormatTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
