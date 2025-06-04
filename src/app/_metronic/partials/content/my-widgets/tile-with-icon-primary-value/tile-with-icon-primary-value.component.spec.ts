import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TileWithIconPrimaryValueComponent } from './tile-with-icon-primary-value.component';

describe('TileWithIconPrimaryValueComponent', () => {
  let component: TileWithIconPrimaryValueComponent;
  let fixture: ComponentFixture<TileWithIconPrimaryValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TileWithIconPrimaryValueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TileWithIconPrimaryValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
