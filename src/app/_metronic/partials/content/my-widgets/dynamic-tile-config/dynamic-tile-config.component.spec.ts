import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicTileConfigComponent } from './dynamic-tile-config.component';

describe('DynamicTileConfigComponent', () => {
  let component: DynamicTileConfigComponent;
  let fixture: ComponentFixture<DynamicTileConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicTileConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicTileConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
