import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicTileUiComponent } from './dynamic-tile-ui.component';

describe('DynamicTileUiComponent', () => {
  let component: DynamicTileUiComponent;
  let fixture: ComponentFixture<DynamicTileUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicTileUiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicTileUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
