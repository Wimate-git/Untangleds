import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TileUi6Component } from './tile-ui6.component';

describe('TileUi6Component', () => {
  let component: TileUi6Component;
  let fixture: ComponentFixture<TileUi6Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TileUi6Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TileUi6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
