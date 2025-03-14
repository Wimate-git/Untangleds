import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TileWithIconUiComponent } from './tile-with-icon-ui.component';

describe('TileWithIconUiComponent', () => {
  let component: TileWithIconUiComponent;
  let fixture: ComponentFixture<TileWithIconUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TileWithIconUiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TileWithIconUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
