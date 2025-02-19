import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HtmlTileConfigComponent } from './html-tile-config.component';

describe('HtmlTileConfigComponent', () => {
  let component: HtmlTileConfigComponent;
  let fixture: ComponentFixture<HtmlTileConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HtmlTileConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HtmlTileConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
