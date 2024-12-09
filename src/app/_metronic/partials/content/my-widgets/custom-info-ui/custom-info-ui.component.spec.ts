import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomInfoUiComponent } from './custom-info-ui.component';

describe('CustomInfoUiComponent', () => {
  let component: CustomInfoUiComponent;
  let fixture: ComponentFixture<CustomInfoUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomInfoUiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomInfoUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
