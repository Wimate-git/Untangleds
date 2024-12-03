import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TileUi1Component } from './tile-ui1.component';

describe('TileUi1Component', () => {
  let component: TileUi1Component;
  let fixture: ComponentFixture<TileUi1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TileUi1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TileUi1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
