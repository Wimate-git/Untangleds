import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniTableViewChart3Component } from './mini-table-view-chart3.component';

describe('MiniTableViewChart3Component', () => {
  let component: MiniTableViewChart3Component;
  let fixture: ComponentFixture<MiniTableViewChart3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiniTableViewChart3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiniTableViewChart3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
