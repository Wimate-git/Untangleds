import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DreamIdComponent } from './dream-id.component';

describe('DreamIdComponent', () => {
  let component: DreamIdComponent;
  let fixture: ComponentFixture<DreamIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DreamIdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DreamIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
