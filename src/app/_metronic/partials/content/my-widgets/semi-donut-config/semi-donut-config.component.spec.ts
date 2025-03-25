import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SemiDonutConfigComponent } from './semi-donut-config.component';

describe('SemiDonutConfigComponent', () => {
  let component: SemiDonutConfigComponent;
  let fixture: ComponentFixture<SemiDonutConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SemiDonutConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SemiDonutConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
