import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterTileUiComponent } from './filter-tile-ui.component';

describe('FilterTileUiComponent', () => {
  let component: FilterTileUiComponent;
  let fixture: ComponentFixture<FilterTileUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterTileUiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterTileUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
