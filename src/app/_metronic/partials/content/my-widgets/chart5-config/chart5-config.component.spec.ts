import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Chart5ConfigComponent } from './chart5-config.component';

describe('Chart5ConfigComponent', () => {
  let component: Chart5ConfigComponent;
  let fixture: ComponentFixture<Chart5ConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chart5ConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Chart5ConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
