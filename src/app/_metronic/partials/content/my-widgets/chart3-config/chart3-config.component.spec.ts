import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Chart3ConfigComponent } from './chart3-config.component';

describe('Chart3ConfigComponent', () => {
  let component: Chart3ConfigComponent;
  let fixture: ComponentFixture<Chart3ConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chart3ConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Chart3ConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
