import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniTableViewTile1Component } from './mini-table-view-tile1.component';

describe('MiniTableViewTile1Component', () => {
  let component: MiniTableViewTile1Component;
  let fixture: ComponentFixture<MiniTableViewTile1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiniTableViewTile1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiniTableViewTile1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
