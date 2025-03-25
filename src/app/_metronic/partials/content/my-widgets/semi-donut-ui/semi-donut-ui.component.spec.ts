import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SemiDonutUiComponent } from './semi-donut-ui.component';

describe('SemiDonutUiComponent', () => {
  let component: SemiDonutUiComponent;
  let fixture: ComponentFixture<SemiDonutUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SemiDonutUiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SemiDonutUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
