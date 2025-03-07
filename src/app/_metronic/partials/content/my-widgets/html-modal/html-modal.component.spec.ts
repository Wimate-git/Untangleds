import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HtmlModalComponent } from './html-modal.component';

describe('HtmlModalComponent', () => {
  let component: HtmlModalComponent;
  let fixture: ComponentFixture<HtmlModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HtmlModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HtmlModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
