import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTableTile1Component } from './data-table-tile1.component';

describe('DataTableTile1Component', () => {
  let component: DataTableTile1Component;
  let fixture: ComponentFixture<DataTableTile1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTableTile1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataTableTile1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
