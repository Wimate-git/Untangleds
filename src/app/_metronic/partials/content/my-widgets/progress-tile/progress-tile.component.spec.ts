import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressTileComponent } from './progress-tile.component';

describe('ProgressTileComponent', () => {
  let component: ProgressTileComponent;
  let fixture: ComponentFixture<ProgressTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressTileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgressTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
