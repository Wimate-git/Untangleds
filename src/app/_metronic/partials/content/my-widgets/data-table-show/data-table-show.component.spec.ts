import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTableShowComponent } from './data-table-show.component';

describe('DataTableShowComponent', () => {
  let component: DataTableShowComponent;
  let fixture: ComponentFixture<DataTableShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTableShowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataTableShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
