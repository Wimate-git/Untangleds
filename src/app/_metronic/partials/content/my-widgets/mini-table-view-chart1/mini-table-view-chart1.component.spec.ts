import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniTableViewChart1Component } from './mini-table-view-chart1.component';

describe('MiniTableViewChart1Component', () => {
  let component: MiniTableViewChart1Component;
  let fixture: ComponentFixture<MiniTableViewChart1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiniTableViewChart1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiniTableViewChart1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
