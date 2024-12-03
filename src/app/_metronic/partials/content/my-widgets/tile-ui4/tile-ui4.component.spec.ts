import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TileUi4Component } from './tile-ui4.component';

describe('TileUi4Component', () => {
  let component: TileUi4Component;
  let fixture: ComponentFixture<TileUi4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TileUi4Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TileUi4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
