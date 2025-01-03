import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterTileConfigComponent } from './filter-tile-config.component';

describe('FilterTileConfigComponent', () => {
  let component: FilterTileConfigComponent;
  let fixture: ComponentFixture<FilterTileConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterTileConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterTileConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
