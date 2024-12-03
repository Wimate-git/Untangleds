import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tile4ConfigComponent } from './tile4-config.component';

describe('Tile4ConfigComponent', () => {
  let component: Tile4ConfigComponent;
  let fixture: ComponentFixture<Tile4ConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tile4ConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tile4ConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
