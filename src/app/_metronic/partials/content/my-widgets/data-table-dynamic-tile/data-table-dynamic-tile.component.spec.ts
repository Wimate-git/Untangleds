import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTableDynamicTileComponent } from './data-table-dynamic-tile.component';

describe('DataTableDynamicTileComponent', () => {
  let component: DataTableDynamicTileComponent;
  let fixture: ComponentFixture<DataTableDynamicTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTableDynamicTileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataTableDynamicTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
