import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TileUi5Component } from './tile-ui5.component';

describe('TileUi5Component', () => {
  let component: TileUi5Component;
  let fixture: ComponentFixture<TileUi5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TileUi5Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TileUi5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
