import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TileUi3Component } from './tile-ui3.component';

describe('TileUi3Component', () => {
  let component: TileUi3Component;
  let fixture: ComponentFixture<TileUi3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TileUi3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TileUi3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
