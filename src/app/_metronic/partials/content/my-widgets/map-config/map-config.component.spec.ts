import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapConfigComponent } from './map-config.component';

describe('MapConfigComponent', () => {
  let component: MapConfigComponent;
  let fixture: ComponentFixture<MapConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
