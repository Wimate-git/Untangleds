import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HtmlTileUiComponent } from './html-tile-ui.component';

describe('HtmlTileUiComponent', () => {
  let component: HtmlTileUiComponent;
  let fixture: ComponentFixture<HtmlTileUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HtmlTileUiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HtmlTileUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
