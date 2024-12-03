import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tile2ConfigComponent } from './tile2-config.component';

describe('Tile2ConfigComponent', () => {
  let component: Tile2ConfigComponent;
  let fixture: ComponentFixture<Tile2ConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tile2ConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tile2ConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
