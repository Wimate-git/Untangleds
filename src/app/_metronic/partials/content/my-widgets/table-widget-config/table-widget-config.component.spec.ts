import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableWidgetConfigComponent } from './table-widget-config.component';

describe('TableWidgetConfigComponent', () => {
  let component: TableWidgetConfigComponent;
  let fixture: ComponentFixture<TableWidgetConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableWidgetConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableWidgetConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
