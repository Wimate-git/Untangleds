import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tile3ConfigComponent } from './tile3-config.component';

describe('Tile3ConfigComponent', () => {
  let component: Tile3ConfigComponent;
  let fixture: ComponentFixture<Tile3ConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tile3ConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tile3ConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
