import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StackedBarUiComponent } from './stacked-bar-ui.component';

describe('StackedBarUiComponent', () => {
  let component: StackedBarUiComponent;
  let fixture: ComponentFixture<StackedBarUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StackedBarUiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StackedBarUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
