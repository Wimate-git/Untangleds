import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTableTile2Component } from './data-table-tile2.component';

describe('DataTableTile2Component', () => {
  let component: DataTableTile2Component;
  let fixture: ComponentFixture<DataTableTile2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTableTile2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataTableTile2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
