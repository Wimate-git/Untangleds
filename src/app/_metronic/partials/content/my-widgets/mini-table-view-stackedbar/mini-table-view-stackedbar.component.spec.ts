import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniTableViewStackedbarComponent } from './mini-table-view-stackedbar.component';

describe('MiniTableViewStackedbarComponent', () => {
  let component: MiniTableViewStackedbarComponent;
  let fixture: ComponentFixture<MiniTableViewStackedbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiniTableViewStackedbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiniTableViewStackedbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
