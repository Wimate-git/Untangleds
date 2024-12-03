import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TileUi2Component } from './tile-ui2.component';

describe('TileUi2Component', () => {
  let component: TileUi2Component;
  let fixture: ComponentFixture<TileUi2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TileUi2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TileUi2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
