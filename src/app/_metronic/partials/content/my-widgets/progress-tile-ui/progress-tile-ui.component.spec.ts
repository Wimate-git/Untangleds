import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressTileUiComponent } from './progress-tile-ui.component';

describe('ProgressTileUiComponent', () => {
  let component: ProgressTileUiComponent;
  let fixture: ComponentFixture<ProgressTileUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressTileUiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgressTileUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
