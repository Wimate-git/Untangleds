import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableWidgetUiComponent } from './table-widget-ui.component';

describe('TableWidgetUiComponent', () => {
  let component: TableWidgetUiComponent;
  let fixture: ComponentFixture<TableWidgetUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableWidgetUiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableWidgetUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
