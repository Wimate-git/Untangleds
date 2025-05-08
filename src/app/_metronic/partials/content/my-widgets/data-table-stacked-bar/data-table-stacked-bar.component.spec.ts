import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTableStackedBarComponent } from './data-table-stacked-bar.component';

describe('DataTableStackedBarComponent', () => {
  let component: DataTableStackedBarComponent;
  let fixture: ComponentFixture<DataTableStackedBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTableStackedBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataTableStackedBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
