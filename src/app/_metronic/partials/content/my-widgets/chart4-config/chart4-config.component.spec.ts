import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Chart4ConfigComponent } from './chart4-config.component';

describe('Chart4ConfigComponent', () => {
  let component: Chart4ConfigComponent;
  let fixture: ComponentFixture<Chart4ConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chart4ConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Chart4ConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
