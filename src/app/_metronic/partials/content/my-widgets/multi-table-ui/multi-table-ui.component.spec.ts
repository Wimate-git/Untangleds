import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiTableUiComponent } from './multi-table-ui.component';

describe('MultiTableUiComponent', () => {
  let component: MultiTableUiComponent;
  let fixture: ComponentFixture<MultiTableUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiTableUiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiTableUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
