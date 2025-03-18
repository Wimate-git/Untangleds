import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StackedBarConfigComponent } from './stacked-bar-config.component';

describe('StackedBarConfigComponent', () => {
  let component: StackedBarConfigComponent;
  let fixture: ComponentFixture<StackedBarConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StackedBarConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StackedBarConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
