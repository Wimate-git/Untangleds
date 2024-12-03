import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleUiComponent } from './title-ui.component';

describe('TitleUiComponent', () => {
  let component: TitleUiComponent;
  let fixture: ComponentFixture<TitleUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TitleUiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TitleUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
