import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebComplaintsComponent } from './web-Complaint.component';

describe('WebComplaintsComponent', () => {
  let component: WebComplaintsComponent;
  let fixture: ComponentFixture<WebComplaintsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebComplaintsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebComplaintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});