import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TileWithIconRedirectionTypeComponent } from './tile-with-icon-redirection-type.component';

describe('TileWithIconRedirectionTypeComponent', () => {
  let component: TileWithIconRedirectionTypeComponent;
  let fixture: ComponentFixture<TileWithIconRedirectionTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TileWithIconRedirectionTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TileWithIconRedirectionTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
