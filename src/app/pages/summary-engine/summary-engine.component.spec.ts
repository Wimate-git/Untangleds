import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryEngineComponent } from './summary-engine.component';

describe('SummaryEngineComponent', () => {
  let component: SummaryEngineComponent;
  let fixture: ComponentFixture<SummaryEngineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryEngineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummaryEngineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
